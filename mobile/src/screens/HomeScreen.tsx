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

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  logoDot: {
    fontSize: 20,
  },
  logoText: {
    ...Typography.h3,
    color: colors.textPrimary,
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    fontSize: 18,
    marginRight: Spacing.xs,
  },
  tabLabel: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.primary,
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 44,
    shadowColor: colors.shadow,
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
    color: colors.textPrimary,
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  // Category Filters
  categoryContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    backgroundColor: colors.surface,
    marginRight: Spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md + 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: colors.textInverse,
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
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  // Connectivity Message
  connectivityMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: colors.background,
    marginTop: Spacing.sm,
  },
  connectivityIcon: {
    fontSize: 16,
    color: colors.textTertiary,
    marginRight: Spacing.sm,
  },
  connectivityText: {
    ...Typography.caption,
    color: colors.textTertiary,
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
});

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
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
  const dynamicStyles = createStyles(colors);

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
      <View style={dynamicStyles.errorContainer}>
        <Text style={dynamicStyles.errorText}>{error}</Text>
        <TouchableOpacity
          style={dynamicStyles.retryButton}
          onPress={() => {
            setLoading(true);
            loadIncidents();
          }}
        >
          <Text style={dynamicStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      {/* Top Bar */}
      <View style={dynamicStyles.topBar}>
        <View style={dynamicStyles.logoContainer}>
          <View style={dynamicStyles.logoIcon}>
            <Text style={dynamicStyles.logoDot}>🛡️</Text>
          </View>
          <Text style={dynamicStyles.logoText}>SafeNet</Text>
        </View>
        <View style={dynamicStyles.topBarActions}>
          <TouchableOpacity
            style={dynamicStyles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={dynamicStyles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={dynamicStyles.iconButton}
            onPress={() => setMenuDrawerVisible(true)}
          >
            <Text style={dynamicStyles.iconText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={dynamicStyles.tabContainer}>
        <TouchableOpacity
          style={[dynamicStyles.tab, activeTab === 'feed' && dynamicStyles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={dynamicStyles.tabIcon}>📋</Text>
          <Text
            style={[
              dynamicStyles.tabLabel,
              activeTab === 'feed' && dynamicStyles.tabLabelActive,
            ]}
          >
            Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[dynamicStyles.tab, activeTab === 'map' && dynamicStyles.tabActive]}
          onPress={() => {
            setActiveTab('map');
            navigation.navigate('Map');
          }}
        >
          <Text style={dynamicStyles.tabIcon}>🗺️</Text>
          <Text
            style={[
              dynamicStyles.tabLabel,
              activeTab === 'map' && dynamicStyles.tabLabelActive,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={dynamicStyles.searchContainer}>
        <View style={dynamicStyles.searchBar}>
          <Text style={dynamicStyles.searchIcon}>🔍</Text>
          <TextInput
            style={dynamicStyles.searchInput}
            placeholder="Search alerts or locations..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={dynamicStyles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={dynamicStyles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={dynamicStyles.categoryContainer}
        contentContainerStyle={dynamicStyles.categoryContent}
      >
        {INCIDENT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              dynamicStyles.categoryPill,
              selectedCategory === category.value && dynamicStyles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(category.value)}
          >
            <Text
              style={[
                dynamicStyles.categoryText,
                selectedCategory === category.value && dynamicStyles.categoryTextActive,
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
        contentContainerStyle={dynamicStyles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={dynamicStyles.emptyContainer}>
            <Text style={dynamicStyles.emptyText}>No verified alerts at this time</Text>
          </View>
        }
        ListFooterComponent={
          <View style={dynamicStyles.connectivityMessage}>
            <Text style={dynamicStyles.connectivityIcon}>│</Text>
            <Text style={dynamicStyles.connectivityText}>
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
