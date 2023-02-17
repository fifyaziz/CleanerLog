import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { AppState, StyleSheet, TouchableOpacity } from 'react-native';
import DashboardScreen from '../container/dashboard';
import QRGeneratorScreen from '../container/qrGenerator';
import ReportScreen from '../container/report';
import SelectScreen from '../container/select';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function DrawerScreen({ navigation }) {
  const clearData = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@storage_key');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Select' }],
        })
      );
    } catch (e) {
      console.error('erroe', e);
    }
  }, [navigation]);

  return (
    <Drawer.Navigator initialRouteName="Report" drawerPosition="right">
      <Drawer.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Borang Harian',
          headerStyle: { ...styles.header },
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerStyle: { ...styles.header },
          headerRight: () => (
            <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={clearData}>
              <Ionicons name="enter-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function TapNav({ navigation }) {
  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        try {
          await AsyncStorage.removeItem('@storage_key');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Select' }],
            })
          );
        } catch (e) {
          console.error('err', e);
        }
      }
    });
    return () => {
      appStateListener?.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Select"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Select') {
            iconName = focused ? 'md-home' : 'md-home-outline';
          } else if (route.name === 'QR') {
            iconName = focused ? 'md-qr-code' : 'md-qr-code-outline';
          } else if (route.name === 'Drawer') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="QR"
        component={QRGeneratorScreen}
        options={{
          headerShown: true,
          title: 'Menjana Kod QR',
          headerStyle: { ...styles.header },
        }}
      />
      <Tab.Screen
        name="Select"
        component={SelectScreen}
        options={{
          headerShown: true,
          title: 'Home',
          headerStyle: { ...styles.header },
        }}
      />
      <Tab.Screen
        name="Drawer"
        component={DrawerScreen}
        options={{
          headerShown: false,
          title: 'Borang Harian',
          headerStyle: { ...styles.header },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 2,
  },
});
