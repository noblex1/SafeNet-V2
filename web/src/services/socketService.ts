/**
 * Socket.IO Client Service
 * Handles real-time notifications via WebSocket
 */

import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/storage';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Set<Function>> = new Map();

  /**
   * Connect to Socket.IO server
   */
  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    try {
      const token = getAccessToken();
      if (!token) {
        console.warn('No token available for Socket.IO connection');
        return;
      }

      // Extract base URL (remove /api if present)
      const baseURL = API_BASE_URL.replace(/\/api$/, '');

      this.socket = io(baseURL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        auth: {
          token,
        },
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('Socket.IO connection error:', error);
    }
  }

  /**
   * Setup socket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket.IO connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket.IO reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
    });

    // Listen for incident notifications
    this.socket.on('incident:verified', (data) => {
      console.log('Received incident:verified event:', data);
      this.emitToListeners('incident:verified', data);
    });

    this.socket.on('incident:created', (data) => {
      console.log('Received incident:created event:', data);
      this.emitToListeners('incident:created', data);
    });

    this.socket.on('incident:status_updated', (data) => {
      console.log('Received incident:status_updated event:', data);
      this.emitToListeners('incident:status_updated', data);
    });
  }

  /**
   * Emit event to registered listeners
   */
  private emitToListeners(event: string, data: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error('Error in socket listener:', error);
        }
      });
    }
  }

  /**
   * Subscribe to a socket event
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
