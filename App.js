import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import 'react-native-gesture-handler';
import CameraScreen from './src/component/camera';
import CaptureImageScreen from './src/container/captureImage';
import CleaningScreen from './src/container/cleaning';
import CreatePekerjaScreen from './src/container/createPekerja';
import CreateQRSurauScreen from './src/container/createQrSurau';
import CreateQRTandasScreen from './src/container/createQrTandas';
import DashboardScreen from './src/container/dashboard';
import EditQRScreen from './src/container/editQr';
import EditReportScreen from './src/container/editReport';
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
  const navigationRef = React.useRef();
  const [isLogin, setIsLogin] = React.useState(false);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const getName = await AsyncStorage.getItem('@storage_checkin');
        setIsLogin(Boolean(getName));
      } catch (e) {
        console.error('ufa', e);
      }
    };
    getData();
  }, [navigationRef]);

  return (
    <NavigationContainer ref={navigationRef}>
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
            title: 'Log Masuk/Keluar',
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
            title: 'Kemaskini Maklumat',
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
            headerShown: false,
            title: 'Sinopsis Laporan',
          }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            headerShown: true,
            title: 'Kamera',
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
          name="CaptureImage"
          component={CaptureImageScreen}
          options={{
            headerShown: true,
            title: 'Gambar',
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
          name="EditReport"
          component={EditReportScreen}
          options={{
            headerShown: true,
            title: 'Kemaskini Log Masuk/Keluar',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
