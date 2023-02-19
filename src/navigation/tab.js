import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { AppState, StyleSheet, Text, TouchableOpacity } from 'react-native';
import CreateQRScreen from '../container/createQr';
import DashboardScreen from '../container/dashboard';
import ReportScreen from '../container/report';
import SelectScreen from '../container/select';
import SenaraiTandasScreen from '../container/senaraiTandas';

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
      <Drawer.Screen
        name="CreateQr"
        component={CreateQRScreen}
        options={{
          title: 'Cipta Kod QR',
          headerStyle: { ...styles.header },
        }}
      />
      <Drawer.Screen
        name="SenaraiTandas"
        component={SenaraiTandasScreen}
        options={{
          title: 'Senarai Tandas',
          headerStyle: { ...styles.header },
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
        headerTitleStyle: {
          fontSize: 25,
          fontWeight: '700',
          height: 90,
          paddingTop: 30,
        },
        tabBarStyle: {
          height: 60,
        },
        tabBarLabel: ({ focused, color }) => {
          let screenName = '';
          let result = '';
          if (route.name === 'Select') {
            screenName = 'Home';
          } else if (route.name === 'Drawer') {
            screenName = 'Borang Harian';
          }
          return (
            <Text
              style={{
                fontSize: focused ? 20 : 18,
                fontWeight: focused ? '900' : 'normal',
                paddingHorizontal: 10,
                marginBottom: 10,
                color: color,
              }}
            >
              {screenName}
            </Text>
          );
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Select') {
            iconName = focused ? 'md-home' : 'md-home-outline';
          } else if (route.name === 'QR') {
            iconName = focused ? 'md-qr-code' : 'md-qr-code-outline';
          } else if (route.name === 'Drawer') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          return (
            <Ionicons
              name={iconName}
              style={{ position: focused ? 'absolute' : 'relative', top: focused ? -20 : 0 }}
              size={focused ? size + 20 : size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Select"
        component={SelectScreen}
        options={{
          headerShown: true,
          title: 'MTC Cleaner Monitoring',
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
  headerHome: {
    fontSize: 80,
    fontWeight: '700',
    borderBottomWidth: 2,
    height: 120,
  },
});
