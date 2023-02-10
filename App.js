import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import EntryScreen from './src/container/entry';
import HistoryScreen from './src/container/history';
import NameScreen from './src/container/name';
import QRGeneratorScreen from './src/container/qrGenerator';
import ScannerScreen from './src/container/qrScanner';
import RoomScreen from './src/container/room';
import TabNavigator from './src/navigation/tab';

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
            headerShown: true,
            title: 'Borang',
          }}
        />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen
          name="Name"
          component={NameScreen}
          options={{
            headerShown: true,
            title: 'Nama',
          }}
        />
        <Stack.Screen name="QR_Scanner" component={ScannerScreen} />
        <Stack.Screen name="QRGenerator" component={QRGeneratorScreen} />
        <Stack.Screen
          name="Room"
          component={RoomScreen}
          options={{
            headerShown: true,
            title: 'Bilik',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
