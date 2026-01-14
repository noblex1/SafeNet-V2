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
        setIncidents(response.incidents);
      } else {
        setIncidents((prev) => [...prev, ...response.incidents]);
      }
      
      setHasMore(pageNum < response.pagination.totalPages);
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
            <Text style={styles.title}>My Reports</Text>
            <Text style={styles.subtitle}>
              Track the status of your reported incidents
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
            <Text style={styles.emptyText}>You haven't reported any incidents yet</Text>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  reportButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  reportButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
