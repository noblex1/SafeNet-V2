/**
 * App Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Spacing, BorderRadius } from '../theme/spacing';

// Auth Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

// Main Screens
import { HomeScreen } from '../screens/HomeScreen';
import { ReportIncidentScreen } from '../screens/ReportIncidentScreen';
import { IncidentDetailScreen } from '../screens/IncidentDetailScreen';
import { MyReportsScreen } from '../screens/MyReportsScreen';
import MapViewScreen from '../screens/MapViewScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Tab Icon Component
const TabIcon: React.FC<{ emoji: string; color: string; focused?: boolean }> = ({
  emoji,
  color,
  focused,
}) => {
  return <Text style={{ fontSize: focused ? 26 : 22 }}>{emoji}</Text>;
};

// Dummy component for Report tab (button handles navigation)
const ReportTabScreen = () => {
  return null;
};

// Report Tab Button (Special highlighted button)
const ReportTabButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { colors } = useTheme();
  const dynamicStyles = createReportButtonStyles(colors);
  
  return (
    <TouchableOpacity style={styles.reportButton} onPress={onPress}>
      <View style={dynamicStyles.reportButtonInner}>
        <Text style={styles.reportIcon}>📍</Text>
      </View>
      <Text style={dynamicStyles.reportLabel}>Report</Text>
    </TouchableOpacity>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          paddingBottom: Spacing.sm,
          paddingTop: Spacing.sm,
          height: 70,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="📶" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapViewScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="🗺️" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ReportIncidentTab"
        component={ReportTabScreen}
        options={({ navigation }) => ({
          tabBarLabel: '',
          tabBarButton: (props) => (
            <ReportTabButton
              onPress={() => navigation.getParent()?.navigate('ReportIncident')}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="👥" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="⚙️" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator (includes tabs and detail screens)
const MainStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.textInverse,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportIncident"
        component={ReportIncidentScreen}
        options={{
          title: 'Report Incident',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="IncidentDetail"
        component={IncidentDetailScreen}
        options={{
          title: 'Incident Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          title: 'My Reports',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

const createReportButtonStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  reportButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  reportLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});

const styles = StyleSheet.create({
  reportButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
  },
  reportIcon: {
    fontSize: 24,
  },
});

// Root Navigator
export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render navigation
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
