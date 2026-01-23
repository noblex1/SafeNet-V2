/**
 * Notification Context
 * Manages real-time notifications from Socket.IO
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  type: 'incident_verified' | 'incident_created' | 'incident_status_updated';
  title: string;
  message: string;
  incident?: {
    _id: string;
    type: string;
    title: string;
    description: string;
    location: any;
    status: number;
  };
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  isConnected: boolean;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string; id: string } | null>(null);

  // Connect to Socket.IO when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect().then(() => {
        setIsConnected(socketService.isConnected());
      });

      // Listen for connection status
      const checkConnection = setInterval(() => {
        setIsConnected(socketService.isConnected());
      }, 1000);

      // Subscribe to incident notifications
      const unsubscribeVerified = socketService.on('incident:verified', (data) => {
        handleNotification({
          type: 'incident_verified',
          title: 'New Verified Alert',
          message: data.incident?.title || 'A new incident has been verified',
          incident: data.incident,
          timestamp: new Date(data.timestamp),
        });
      });

      const unsubscribeCreated = socketService.on('incident:created', (data) => {
        handleNotification({
          type: 'incident_created',
          title: 'New Incident Reported',
          message: data.incident?.title || 'A new incident has been reported',
          incident: data.incident,
          timestamp: new Date(data.timestamp),
        });
      });

      const unsubscribeStatusUpdated = socketService.on('incident:status_updated', (data) => {
        handleNotification({
          type: 'incident_status_updated',
          title: 'Incident Status Updated',
          message: `Incident status has been updated`,
          incident: data.incident,
          timestamp: new Date(data.timestamp),
        });
      });

      return () => {
        clearInterval(checkConnection);
        unsubscribeVerified();
        unsubscribeCreated();
        unsubscribeStatusUpdated();
        socketService.disconnect();
      };
    } else {
      socketService.disconnect();
      setIsConnected(false);
    }
  }, [isAuthenticated]);

  const handleNotification = useCallback((notificationData: {
    type: Notification['type'];
    title: string;
    message: string;
    incident?: any;
    timestamp: Date;
  }) => {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      ...notificationData,
      read: false,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50 notifications

    // Show toast notification
    const displayMessage = notification.incident?.title 
      ? `${notification.title}: ${notification.incident.title}`
      : notification.message;

    showToast(displayMessage, notification.type === 'incident_created' ? 'info' : 'success');

    // Log for debugging
    console.log('Notification received:', {
      type: notification.type,
      title: notification.title,
      incidentId: notification.incident?._id,
    });
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const toastId = `${Date.now()}-${Math.random()}`;
    setToast({ message, type, id: toastId });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToast(null);
    }, 5000);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    isConnected,
    showToast,
  };

  return (
    <>
      <NotificationContext.Provider value={value}>
        {children}
      </NotificationContext.Provider>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`
            px-4 py-3 rounded-lg shadow-lg border max-w-md
            ${toast.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500/90 border-blue-400 text-white' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500/90 border-yellow-400 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : ''}
          `}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
