/**
 * Filter Modal Component
 * Advanced filtering options for incidents
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IncidentStatus, IncidentType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Button } from './Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  status?: IncidentStatus;
  type?: IncidentType;
  dateRange?: 'today' | 'week' | 'month' | 'all';
  sortBy?: 'newest' | 'oldest' | 'relevance';
}

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: undefined },
  { label: 'Pending', value: IncidentStatus.PENDING },
  { label: 'Verified', value: IncidentStatus.VERIFIED },
  { label: 'Resolved', value: IncidentStatus.RESOLVED },
  { label: 'False', value: IncidentStatus.FALSE },
];

const TYPE_OPTIONS = [
  { label: 'All Types', value: undefined },
  { label: 'Missing Person', value: IncidentType.MISSING_PERSON },
  { label: 'Kidnapping', value: IncidentType.KIDNAPPING },
  { label: 'Stolen Vehicle', value: IncidentType.STOLEN_VEHICLE },
  { label: 'Natural Disaster', value: IncidentType.NATURAL_DISASTER },
];

const DATE_RANGE_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Most Relevant', value: 'relevance' },
];

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
});

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...Typography.h3,
    color: colors.textPrimary,
  },
  closeButton: {
    fontSize: 24,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.label,
    color: colors.textPrimary,
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  optionTextActive: {
    color: colors.textInverse,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}) => {
  const { colors } = useTheme();
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const dynamicStyles = createStyles(colors);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {};
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.header}>
            <Text style={dynamicStyles.title}>Filter Alerts</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
            {/* Status Filter */}
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Status</Text>
              <View style={dynamicStyles.optionsContainer}>
                {STATUS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      dynamicStyles.optionButton,
                      filters.status === option.value && dynamicStyles.optionButtonActive,
                    ]}
                    onPress={() =>
                      setFilters({ ...filters, status: option.value })
                    }
                  >
                    <Text
                      style={[
                        dynamicStyles.optionText,
                        filters.status === option.value && dynamicStyles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Type Filter */}
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Incident Type</Text>
              <View style={dynamicStyles.optionsContainer}>
                {TYPE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      dynamicStyles.optionButton,
                      filters.type === option.value && dynamicStyles.optionButtonActive,
                    ]}
                    onPress={() =>
                      setFilters({ ...filters, type: option.value })
                    }
                  >
                    <Text
                      style={[
                        dynamicStyles.optionText,
                        filters.type === option.value && dynamicStyles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Range */}
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Date Range</Text>
              <View style={dynamicStyles.optionsContainer}>
                {DATE_RANGE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      dynamicStyles.optionButton,
                      filters.dateRange === option.value && dynamicStyles.optionButtonActive,
                    ]}
                    onPress={() =>
                      setFilters({ ...filters, dateRange: option.value as any })
                    }
                  >
                    <Text
                      style={[
                        dynamicStyles.optionText,
                        filters.dateRange === option.value && dynamicStyles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Sort By</Text>
              <View style={dynamicStyles.optionsContainer}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      dynamicStyles.optionButton,
                      filters.sortBy === option.value && dynamicStyles.optionButtonActive,
                    ]}
                    onPress={() =>
                      setFilters({ ...filters, sortBy: option.value as any })
                    }
                  >
                    <Text
                      style={[
                        dynamicStyles.optionText,
                        filters.sortBy === option.value && dynamicStyles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={dynamicStyles.footer}>
            <Button
              title="Reset"
              onPress={handleReset}
              variant="outline"
              style={dynamicStyles.resetButton}
            />
            <Button
              title="Apply Filters"
              onPress={handleApply}
              style={dynamicStyles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
