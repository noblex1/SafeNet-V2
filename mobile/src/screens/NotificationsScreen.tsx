/**
 * Notifications Screen
 * Displays all real-time notifications
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { IncidentType } from '../types';

interface NotificationsScreenProps {
  navigation: any;
}

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
    ...Typography.h1,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: colors.surface,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationItemUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
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
  notificationUnreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: Spacing.xs,
  },
  markAllReadButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.primary,
  },
  markAllReadText: {
    ...Typography.bodySmall,
    color: colors.textInverse,
    fontWeight: '600',
  },
});

const getNotificationIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'incident_verified':
      return 'checkmark-circle';
    case 'incident_created':
      return 'alert-circle';
    case 'incident_status_updated':
      return 'information-circle';
    default:
      return 'notifications';
  }
};

const formatTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return timestamp.toLocaleDateString();
};

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { colors } = useTheme();
  const dynamicStyles = createStyles(colors);

  const handleNotificationPress = (notification: any) => {
    // Mark as read when tapped
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to incident detail if available
    if (notification.incident?._id) {
      navigation.navigate('IncidentDetail', { incidentId: notification.incident._id });
    }
  };

  const renderNotification = ({ item }: { item: any }) => {
    const iconName = getNotificationIcon(item.type);
    const isUnread = !item.read;

    return (
      <TouchableOpacity
        style={[dynamicStyles.notificationItem, isUnread && dynamicStyles.notificationItemUnread]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={dynamicStyles.notificationIcon}>
          <Ionicons name={iconName} size={20} color={colors.primary} />
        </View>
        <View style={dynamicStyles.notificationContent}>
          <Text style={dynamicStyles.notificationTitle}>{item.title}</Text>
          <Text style={dynamicStyles.notificationMessage}>{item.message}</Text>
          <Text style={dynamicStyles.notificationTime}>{formatTime(item.timestamp)}</Text>
        </View>
        {isUnread && <View style={dynamicStyles.notificationUnreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Notifications</Text>
        <View style={dynamicStyles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={dynamicStyles.markAllReadButton}
              onPress={markAllAsRead}
            >
              <Text style={dynamicStyles.markAllReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {notifications.length === 0 ? (
        <View style={dynamicStyles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color={colors.textTertiary}
            style={dynamicStyles.emptyIcon}
          />
          <Text style={dynamicStyles.emptyText}>No notifications yet</Text>
          <Text style={[dynamicStyles.emptyText, { marginTop: Spacing.xs }]}>
            You'll see real-time alerts here when incidents are verified
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: Spacing.sm }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
