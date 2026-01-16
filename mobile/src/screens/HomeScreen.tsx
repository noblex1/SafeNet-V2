/**
 * Home Screen
 * Displays verified incident alerts feed
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Incident, IncidentType, IncidentStatus } from '../types';
import { incidentService } from '../services/incidentService';
import { IncidentCard } from '../components/IncidentCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { FilterModal, FilterOptions } from '../components/FilterModal';
import { MenuDrawer } from '../components/MenuDrawer';

interface HomeScreenProps {
  navigation: any;
}

const INCIDENT_CATEGORIES = [
  { label: 'All Alerts', value: 'all' },
  { label: 'Missing Persons', value: IncidentType.MISSING_PERSON },
  { label: 'Disasters', value: IncidentType.NATURAL_DISASTER },
  { label: 'Traffic', value: IncidentType.STOLEN_VEHICLE },
  { label: 'Kidnapping', value: IncidentType.KIDNAPPING },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'map'>('feed');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const loadIncidents = useCallback(async () => {
    try {
      setError(null);
      const alerts = await incidentService.getVerifiedAlerts();
      setIncidents(alerts);
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
    loadIncidents();
  }, [loadIncidents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadIncidents();
  }, [loadIncidents]);

  const handleIncidentPress = (incident: Incident) => {
    navigation.navigate('IncidentDetail', { incidentId: incident._id });
  };

  // Filter incidents based on category, search, and filters
  const filteredIncidents = incidents
    .filter((incident) => {
      const matchesCategory =
        selectedCategory === 'all' || incident.type === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !filters.status || incident.status === filters.status;
      const matchesType = !filters.type || incident.type === filters.type;
      const matchesDateRange = !filters.dateRange || checkDateRange(incident, filters.dateRange);
      return matchesCategory && matchesSearch && matchesStatus && matchesType && matchesDateRange;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      } else if (filters.sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return 0;
    });

  const checkDateRange = (incident: Incident, range: string): boolean => {
    if (!incident.createdAt) return false;
    const incidentDate = new Date(incident.createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - incidentDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (range) {
      case 'today':
        return diffInDays === 0;
      case 'week':
        return diffInDays <= 7;
      case 'month':
        return diffInDays <= 30;
      default:
        return true;
    }
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            loadIncidents();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoDot}>🛡️</Text>
          </View>
          <Text style={styles.logoText}>SafeNet</Text>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setMenuDrawerVisible(true)}
          >
            <Text style={styles.iconText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={styles.tabIcon}>📋</Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'feed' && styles.tabLabelActive,
            ]}
          >
            Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'map' && styles.tabActive]}
          onPress={() => {
            setActiveTab('map');
            navigation.navigate('Map');
          }}
        >
          <Text style={styles.tabIcon}>🗺️</Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'map' && styles.tabLabelActive,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search alerts or locations..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {INCIDENT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.categoryPill,
              selectedCategory === category.value && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(category.value)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.value && styles.categoryTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Incident List */}
      <FlatList
        data={filteredIncidents}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No verified alerts at this time</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.connectivityMessage}>
            <Text style={styles.connectivityIcon}>│</Text>
            <Text style={styles.connectivityText}>
              Nearby incidents simplified for slow connection.
            </Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />

      {/* Menu Drawer */}
      <MenuDrawer
        visible={menuDrawerVisible}
        onClose={() => setMenuDrawerVisible(false)}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  logoDot: {
    fontSize: 20,
  },
  logoText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  topBarActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginRight: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabIcon: {
    fontSize: 18,
    marginRight: Spacing.xs,
  },
  tabLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 44,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.textPrimary,
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterIcon: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  // Category Filters
  categoryContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    marginRight: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md + 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: Colors.textInverse,
    fontWeight: '700',
    fontSize: 15,
  },
  // List
  listContent: {
    padding: Spacing.lg,
  },
  emptyContainer: {
    padding: Spacing.xxxl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  emptyText: {
    ...Typography.h4,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  // Connectivity Message
  connectivityMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    marginTop: Spacing.sm,
  },
  connectivityIcon: {
    fontSize: 16,
    color: Colors.textTertiary,
    marginRight: Spacing.sm,
  },
  connectivityText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  // Error States
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
});
