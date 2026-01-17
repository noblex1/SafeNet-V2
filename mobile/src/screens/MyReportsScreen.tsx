/**
 * My Reports Screen
 * Displays user's own reported incidents with status tracking
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Incident } from '../types';
import { incidentService } from '../services/incidentService';
import { IncidentCard } from '../components/IncidentCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface MyReportsScreenProps {
  navigation: any;
}

export const MyReportsScreen: React.FC<MyReportsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadIncidents = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setError(null);
      const response = await incidentService.getMyIncidents(pageNum, 20);
      
      if (reset) {
        setIncidents(response.incidents || []);
      } else {
        setIncidents((prev) => [...prev, ...(response.incidents || [])]);
      }
      
      // Calculate totalPages from backend response
      // Backend returns: { incidents, total, page, limit }
      const limit = response.limit || 20;
      const total = response.total || 0;
      const totalPages = Math.ceil(total / limit);
      
      setHasMore(pageNum < totalPages);
      setPage(pageNum);
    } catch (err: any) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
      console.error('Error loading incidents:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadIncidents(1, true);
    }
  }, [user, loadIncidents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadIncidents(1, true);
  }, [loadIncidents]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !refreshing) {
      loadIncidents(page + 1, false);
    }
  }, [loading, hasMore, refreshing, page, loadIncidents]);

  const handleIncidentPress = (incident: Incident) => {
    navigation.navigate('IncidentDetail', { incidentId: incident._id });
  };

  const dynamicStyles = createStyles(colors);

  if (loading && incidents.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && incidents.length === 0) {
    return (
      <View style={dynamicStyles.errorContainer}>
        <Text style={dynamicStyles.errorText}>{error}</Text>
        <TouchableOpacity
          style={dynamicStyles.retryButton}
          onPress={() => {
            setLoading(true);
            loadIncidents(1, true);
          }}
        >
          <Text style={dynamicStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerTop}>
          <View style={dynamicStyles.headerTextContainer}>
            <Text style={dynamicStyles.greeting}>My Reports</Text>
            <Text style={dynamicStyles.title}>Track Your Incidents</Text>
            <Text style={dynamicStyles.subtitle}>
              Monitor the status of your reported incidents
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={dynamicStyles.logoutButton}>
            <Text style={dynamicStyles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={incidents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <IncidentCard
            incident={item}
            onPress={() => handleIncidentPress(item)}
          />
        )}
        contentContainerStyle={dynamicStyles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={dynamicStyles.emptyContainer}>
            <View style={dynamicStyles.emptyIconContainer}>
              <Text style={dynamicStyles.emptyIcon}>📋</Text>
            </View>
            <Text style={dynamicStyles.emptyTitle}>No Reports Yet</Text>
            <Text style={dynamicStyles.emptyText}>
              You haven't reported any incidents yet. Start by reporting an incident to help keep your community safe.
            </Text>
            <TouchableOpacity
              style={dynamicStyles.reportButton}
              onPress={() => navigation.navigate('ReportIncident')}
            >
              <Text style={dynamicStyles.reportButtonText}>Report an Incident</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          loading && incidents.length > 0 ? (
            <View style={dynamicStyles.footerLoader}>
              <LoadingSpinner size="small" />
            </View>
          ) : null
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
    padding: Spacing.xl,
    paddingTop: Spacing.xxl + Spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    color: colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  logoutText: {
    ...Typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.lg,
  },
  emptyContainer: {
    padding: Spacing.xxxl * 2,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    ...Typography.h3,
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  reportButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.md,
  },
  reportButtonText: {
    ...Typography.bodyMedium,
    color: colors.textInverse,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  errorText: {
    ...Typography.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    ...Typography.bodyMedium,
    color: colors.textInverse,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
});
