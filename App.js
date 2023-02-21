import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import 'react-native-gesture-handler';
import CleaningScreen from './src/container/cleaning';
import DashboardScreen from './src/container/dashboard';
import EditQRScreen from './src/container/editQr';
import EntryScreen from './src/container/entry';
import HistoryScreen from './src/container/history';
import HomeScreen from './src/container/home';
import LoginScreen from './src/container/login';
import NameScreen from './src/container/name';
import QRGeneratorScreen from './src/container/qrGenerator';
import ScannerScreen from './src/container/qrScanner';
import ReportDetailScreen from './src/container/reportDetails';
import ReportStaffScreen from './src/container/reportStaff';
import RoomScreen from './src/container/room';
import TabNavigator from './src/navigation/tab';
const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TabNav">
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="TabNav" component={TabNavigator} />
        </Stack.Group>
        <Stack.Screen
          name="Entry"
          component={EntryScreen}
          options={{
            title: 'Borang',
          }}
        />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen
          name="Name"
          component={NameScreen}
          options={{
            title: 'Nama Pekerja',
          }}
        />
        <Stack.Screen name="QR_Scanner" component={ScannerScreen} />
        <Stack.Screen name="QRGenerator" component={QRGeneratorScreen} />
        <Stack.Screen
          name="Room"
          component={RoomScreen}
          options={{
            title: 'Bilik',
          }}
        />
        <Stack.Screen
          name="ReportDetails"
          component={ReportDetailScreen}
          options={{
            title: 'Maklumat Laporan',
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: true,
            title: 'Dashboard',
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: true,
            title: 'Login',
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerShown: true,
            title: 'Dashboard',
          }}
        />
        <Stack.Screen
          name="EditQR"
          component={EditQRScreen}
          options={{
            headerShown: true,
            title: 'Kemaskini Maklumat Tandas',
          }}
        />
        <Stack.Screen
          name="Cleaning"
          component={CleaningScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReportStaff"
          component={ReportStaffScreen}
          options={{
            headerShown: true,
            title: 'Laporan Semasa',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
