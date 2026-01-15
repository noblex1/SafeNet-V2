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
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface MyReportsScreenProps {
  navigation: any;
}

export const MyReportsScreen: React.FC<MyReportsScreenProps> = ({ navigation }) => {
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

  if (loading && incidents.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && incidents.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            loadIncidents(1, true);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>My Reports</Text>
            <Text style={styles.title}>Track Your Incidents</Text>
            <Text style={styles.subtitle}>
              Monitor the status of your reported incidents
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
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
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
            </View>
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptyText}>
              You haven't reported any incidents yet. Start by reporting an incident to help keep your community safe.
            </Text>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => navigation.navigate('ReportIncident')}
            >
              <Text style={styles.reportButtonText}>Report an Incident</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          loading && incidents.length > 0 ? (
            <View style={styles.footerLoader}>
              <LoadingSpinner size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl + Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  logoutText: {
    ...Typography.bodySmall,
    color: Colors.error,
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
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  reportButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  reportButtonText: {
    ...Typography.bodyMedium,
    color: Colors.textInverse,
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
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    ...Typography.bodyMedium,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
});
