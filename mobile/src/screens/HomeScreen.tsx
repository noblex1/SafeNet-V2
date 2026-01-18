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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  // Top Bar - Glass effect
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: colors.glassBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neonCyan,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  logoDot: {
    fontSize: 20,
  },
  logoText: {
    ...Typography.h3,
    color: colors.neonCyan, // Gradient-like effect with neon
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
  // Tab Navigation - Glass effect
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.glassBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
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
    borderBottomColor: colors.neonCyan,
  },
  tabIcon: {
    marginRight: Spacing.xs,
  },
  tabLabel: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.neonCyan,
  },
  // Search - Glass effect
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: colors.glassBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassBg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    minHeight: 44,
  },
  searchIcon: {
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
    backgroundColor: colors.glassBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
  },
  // Category Filters - Glass effect pills
  categoryContainer: {
    backgroundColor: colors.glassBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
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
    backgroundColor: colors.glassBg,
    marginRight: Spacing.md,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPillActive: {
    backgroundColor: colors.neonCyan,
    borderColor: colors.neonCyan,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md + 4,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryText: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#0a0a0a', // Dark text on neon
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
    backgroundColor: colors.neonCyan,
    borderRadius: BorderRadius.lg,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  retryButtonText: {
    ...Typography.bodyMedium,
    color: '#0a0a0a',
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
            <Ionicons name="shield" size={20} color="#0a0a0a" />
          </View>
          <Text style={dynamicStyles.logoText}>SafeNet</Text>
        </View>
        <View style={dynamicStyles.topBarActions}>
          <TouchableOpacity
            style={dynamicStyles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={dynamicStyles.iconButton}
            onPress={() => setMenuDrawerVisible(true)}
          >
            <Ionicons name="menu" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={dynamicStyles.tabContainer}>
        <TouchableOpacity
          style={[dynamicStyles.tab, activeTab === 'feed' && dynamicStyles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Ionicons 
            name="document-text-outline" 
            size={18} 
            color={activeTab === 'feed' ? colors.neonCyan : colors.textSecondary}
            style={dynamicStyles.tabIcon}
          />
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
          <Ionicons 
            name="map-outline" 
            size={18} 
            color={activeTab === 'map' ? colors.neonCyan : colors.textSecondary}
            style={dynamicStyles.tabIcon}
          />
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
          <Ionicons 
            name="search-outline" 
            size={18} 
            color={colors.textTertiary}
            style={dynamicStyles.searchIcon}
          />
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
          <Ionicons 
            name="options-outline" 
            size={20} 
            color={colors.textSecondary}
          />
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
