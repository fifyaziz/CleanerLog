import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import CameraScreen from './src/component/camera';
import AuthContext from './src/config/AuthContext';
import CheckInOutScreen from './src/container/checkInOut';
import CheckInSummaryScreen from './src/container/checkInSummary';
import CheckOutSummaryScreen from './src/container/checkOutSummary';
import CreateEditQRScreen from './src/container/createEditQR';
import ListRoomScreen from './src/container/listRoom';
import LoginScreen from './src/container/login';
import LogoutScreen from './src/container/logout';
import QRScannerScreen from './src/container/qrScanner';
import CaptureImageScreen from './src/modules/captureImage';
import CreatePekerjaScreen from './src/modules/createPekerja';
import CreateQROfficeScreen from './src/modules/createQrOffice';
import CreateQRSurauScreen from './src/modules/createQrSurau';
import CreateQRTandasScreen from './src/modules/createQrTandas';
import DashboardScreen from './src/modules/dashboard';
import EditQRScreen from './src/modules/editQr';
import EditReportScreen from './src/modules/editReport';
import EntryScreen from './src/modules/entry';
import HistoryScreen from './src/modules/history';
import HomeScreen from './src/modules/home';
import QRGeneratorScreen from './src/modules/qrGenerator';
import ReportDailyScreen from './src/modules/reportDaily';
import ReportDetailScreen from './src/modules/reportDetails';
import RoomScreen from './src/modules/room';
import DrawerRightScreen from './src/navigation/drawerRight';
import TabNavigator, { DrawerScreen } from './src/navigation/tab';

const Stack = createNativeStackNavigator();

function App() {
  const navigationRef = React.useRef();
  const fixtureMode = false;

  return (
    <AuthContext.Provider value={{ fixtureMode }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="QRScanner">
          <Stack.Group
            screenOptions={{
              headerTintColor: 'white',
              headerStyle: { ...styles.subHeader },
              headerTitleStyle: { ...styles.titleSubHeader },
              headerBackTitleVisible: false,
            }}
          >
            <Stack.Screen
              name="ListRoom"
              component={ListRoomScreen}
              options={{ title: 'Senarai Tempat Pembersihan' }}
            />
            <Stack.Screen
              name="Room"
              component={RoomScreen}
              options={{ title: 'Tempat Pembersihan' }}
            />
            <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Kamera' }} />
            <Stack.Screen name="CheckInOut" component={CheckInOutScreen} />
            <Stack.Screen name="CreateEditQR" component={CreateEditQRScreen} />
          </Stack.Group>

          <Stack.Screen
            name="ReportDetails"
            component={ReportDetailScreen}
            options={{
              title: 'Maklumat Laporan',
            }}
          />
          <Stack.Screen
            name="CreatePekerja"
            component={CreatePekerjaScreen}
            options={{
              headerShown: true,
              title: 'Cipta Pekerja',
            }}
          />
          <Stack.Screen
            name="CreateQRTandas"
            component={CreateQRTandasScreen}
            options={{
              headerShown: true,
              title: 'Cipta Kod QR Tandas',
            }}
          />
          <Stack.Screen
            name="CreateQRSurau"
            component={CreateQRSurauScreen}
            options={{
              headerShown: true,
              title: 'Cipta Kod QR Surau',
            }}
          />
          <Stack.Screen
            name="CreateQROffice"
            component={CreateQROfficeScreen}
            options={{
              headerShown: true,
              title: 'Cipta Kod QR Office',
            }}
          />
          <Stack.Screen
            name="EditQR"
            component={EditQRScreen}
            options={{
              headerShown: true,
              title: 'Kemaskini Maklumat',
            }}
          />
          <Stack.Screen
            name="EditReport"
            component={EditReportScreen}
            options={{
              headerShown: true,
              title: 'Kemaskini Log Masuk/Keluar',
            }}
          />
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Logout" component={LogoutScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen name="DrawerRight" component={DrawerRightScreen} />
            <Stack.Screen name="CheckInSummary" component={CheckInSummaryScreen} />
            <Stack.Screen name="CheckOutSummary" component={CheckOutSummaryScreen} />
          </Stack.Group>

          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TabNav" component={TabNavigator} />
            <Stack.Screen name="Entry" component={EntryScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="ReportDaily" component={ReportDailyScreen} />
            <Stack.Screen name="QRGenerator" component={QRGeneratorScreen} />
            <Stack.Screen name="Drawer" component={DrawerScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="CaptureImage" component={CaptureImageScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#254252',
  },
  subHeader: {
    backgroundColor: '#254252',
  },
  titleSubHeader: {
    color: '#f9982f',
  },
});

export default App;
