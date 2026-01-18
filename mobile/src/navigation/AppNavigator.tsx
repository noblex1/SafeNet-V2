/**
 * App Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
const TabIcon: React.FC<{ name: keyof typeof Ionicons.glyphMap; color: string; focused?: boolean }> = ({
  name,
  color,
  focused,
}) => {
  return <Ionicons name={name} size={focused ? 26 : 22} color={color} />;
};

// Dummy component for Report tab (button handles navigation)
const ReportTabScreen = () => {
  return null;
};

const styles = StyleSheet.create({
  reportButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
  },
});

// Report Tab Button (Special highlighted button)
const ReportTabButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { colors } = useTheme();
  const dynamicStyles = createReportButtonStyles(colors);
  
  return (
    <TouchableOpacity style={styles.reportButton} onPress={onPress}>
      <View style={dynamicStyles.reportButtonInner}>
        <Ionicons name="add" size={28} color="#0a0a0a" />
      </View>
      <Text style={dynamicStyles.reportLabel}>Report</Text>
    </TouchableOpacity>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  const { colors, theme } = useTheme();
  const tabBarBackgroundColor = theme === 'dark' ? colors.surfaceElevated : colors.surface;
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.neonCyan,
        tabBarInactiveTintColor: colors.textTertiary,
        sceneContainerStyle: {
          backgroundColor: colors.background,
        },
        tabBarStyle: {
          paddingBottom: Spacing.sm,
          paddingTop: Spacing.xs,
          height: 68,
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          elevation: 10,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
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
            <TabIcon name="home-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapViewScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="map-outline" color={color} focused={focused} />
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
            <TabIcon name="people-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="settings-outline" color={color} focused={focused} />
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
    backgroundColor: colors.neonCyan,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  reportLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});

// Root Navigator
export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors, theme } = useTheme();

  const navigationTheme = React.useMemo(
    () => ({
      dark: theme === 'dark',
      colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.neonCyan,
      },
    }),
    [colors, theme]
  );

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render navigation
  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
