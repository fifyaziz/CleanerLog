import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import HomeScreen from '../container/home';
import QRGeneratorScreen from '../container/qrGenerator';
import ReportScreen from '../container/report';
import SelectScreen from '../container/select';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function DrawerScreen() {
  return (
    <Drawer.Navigator initialRouteName="Report" drawerPosition="right">
      <Drawer.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Laporan',
          headerStyle: { ...styles.header },
        }}
      />
      <Drawer.Screen name="Dashboard" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
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
          } else if (route.name === 'Report') {
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
        name="Report"
        component={DrawerScreen}
        options={{
          headerShown: false,
          title: 'Laporan',
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
