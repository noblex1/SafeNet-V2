/**
 * Notifications Screen
 * Displays user notifications
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'update' | 'system';
  read: boolean;
  createdAt: string;
}

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications for now
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        title: 'New Alert',
        message: 'A new incident has been verified in your area',
        type: 'alert',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Report Update',
        message: 'Your incident report has been verified',
        type: 'update',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        title: 'System Update',
        message: 'SafeNet app has been updated to version 1.0.0',
        type: 'system',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return '🚨';
      case 'update':
        return '✅';
      case 'system':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const dynamicStyles = createStyles(colors);

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[dynamicStyles.notificationItem, !item.read && dynamicStyles.unread]}
    >
      <View style={dynamicStyles.notificationIcon}>
        <Text style={dynamicStyles.iconText}>{getNotificationIcon(item.type)}</Text>
      </View>
      <View style={dynamicStyles.notificationContent}>
        <Text style={dynamicStyles.notificationTitle}>{item.title}</Text>
        <Text style={dynamicStyles.notificationMessage}>{item.message}</Text>
        <Text style={dynamicStyles.notificationTime}>{getTimeAgo(item.createdAt)}</Text>
      </View>
      {!item.read && <View style={dynamicStyles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Notifications</Text>
        {notifications.filter((n) => !n.read).length > 0 && (
          <View style={dynamicStyles.badge}>
            <Text style={dynamicStyles.badgeText}>
              {notifications.filter((n) => !n.read).length}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={dynamicStyles.listContent}
        ListEmptyComponent={
          <View style={dynamicStyles.emptyContainer}>
            <Text style={dynamicStyles.emptyIcon}>🔔</Text>
            <Text style={dynamicStyles.emptyText}>No notifications</Text>
            <Text style={dynamicStyles.emptySubtext}>
              You're all caught up! New alerts will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...Typography.h2,
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: BorderRadius.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  badgeText: {
    ...Typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unread: {
    backgroundColor: colors.primaryLight + '20',
    borderColor: colors.primary,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  iconText: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  notificationMessage: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  notificationTime: {
    ...Typography.caption,
    color: colors.textTertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    padding: Spacing.xxxl * 2,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    ...Typography.h3,
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
