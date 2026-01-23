/**
 * Notification Context
 * Manages real-time notifications from Socket.IO
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { socketService } from '../services/socketService';
import { useAuth } from './AuthContext';

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
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

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
          message: `Your incident status has been updated`,
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

    // Show toast for all platforms
    const displayMessage = notification.incident?.title 
      ? `${notification.title}: ${notification.incident.title}`
      : notification.message;

    // Use ToastAndroid for Android, and for iOS/Web we'll use a custom toast or keep Alert as fallback
    if (Platform.OS === 'android') {
      ToastAndroid.show(displayMessage, ToastAndroid.LONG);
    } else {
      // For iOS/Web, show a brief alert (can be replaced with a custom toast component later)
      // Using a shorter timeout alert-like behavior
      Alert.alert(
        notification.title,
        displayMessage,
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );
    }

    // Log for debugging
    console.log('Notification received:', {
      type: notification.type,
      title: notification.title,
      incidentId: notification.incident?._id,
    });
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
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
