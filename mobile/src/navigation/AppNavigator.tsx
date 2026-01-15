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
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';

// Auth Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

// Main Screens
import { HomeScreen } from '../screens/HomeScreen';
import { ReportIncidentScreen } from '../screens/ReportIncidentScreen';
import { IncidentDetailScreen } from '../screens/IncidentDetailScreen';
import { MyReportsScreen } from '../screens/MyReportsScreen';
import { MapViewScreen } from '../screens/MapViewScreen';

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
  return (
    <TouchableOpacity style={styles.reportButton} onPress={onPress}>
      <View style={styles.reportButtonInner}>
        <Text style={styles.reportIcon}>📍</Text>
      </View>
      <Text style={styles.reportLabel}>Report</Text>
    </TouchableOpacity>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          paddingBottom: Spacing.sm,
          paddingTop: Spacing.sm,
          height: 70,
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
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
        component={HomeScreen}
        options={{
          tabBarLabel: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="👥" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={MyReportsScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="👤" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator (includes tabs and detail screens)
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.textInverse,
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
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  reportButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
  },
  reportButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  reportIcon: {
    fontSize: 24,
  },
  reportLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
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
