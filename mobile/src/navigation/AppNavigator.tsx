/**
 * App Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

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

// Simple Tab Icon Component
const TabIcon: React.FC<{ emoji: string; color: string }> = ({ emoji }) => {
  return <Text style={{ fontSize: 24 }}>{emoji}</Text>;
};

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color }) => <TabIcon emoji="⚠️" color={color} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapViewScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color }) => <TabIcon emoji="📍" color={color} />,
        }}
      />
      <Tab.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          tabBarLabel: 'My Reports',
          tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
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
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFF',
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
