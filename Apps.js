import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import CameraScreen from './src/component/camera';
import CaptureImageScreen from './src/container/captureImage';
import CleaningScreen from './src/container/cleaning';
import CreatePekerjaScreen from './src/container/createPekerja';
import CreateQROfficeScreen from './src/container/createQrOffice';
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
import ReportDailyScreen from './src/container/reportDaily';
import ReportDetailScreen from './src/container/reportDetails';
import ReportStaffScreen from './src/container/reportStaff';
import RoomScreen from './src/container/room';
import NewRoomScreen from './src/container/roomNew';
import DrawerRightScreen from './src/navigation/drawerRight';
import TabNavigator, { DrawerScreen } from './src/navigation/tab';

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

function App() {
  const navigationRef = React.useRef();
  const [isLogin, setIsLogin] = React.useState(false);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const getPass = await AsyncStorage.getItem('@MySuperPass');
        setIsLogin(Boolean(getPass));
      } catch (e) {
        console.error('ufa', e);
      }
    };
    getData();
  }, [navigationRef]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="QR_Scanner">
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
            headerShown: true,
            headerTintColor: 'white',
            headerStyle: { ...styles.subHeader },
            headerTitleStyle: {
              color: '#f9982f',
            },
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            headerStyle: { ...styles.header },
          }}
          name="QR_Scanner"
          component={ScannerScreen}
        />
        <Stack.Screen name="QRGenerator" component={QRGeneratorScreen} />
        <Stack.Screen
          name="NewRoom"
          options={{
            headerShown: true,
            title: 'Senarai Tempat Pembersihan',
            headerTintColor: 'white',
            headerStyle: { ...styles.subHeader },
            headerTitleStyle: {
              color: '#f9982f',
            },
            headerBackTitleVisible: false,
            // headerBackVisible: false
          }}
          component={NewRoomScreen}
        />
        <Stack.Screen
          name="Room"
          component={RoomScreen}
          options={{
            title: 'Tempat Pembersihan',
            headerTintColor: 'white',
            headerStyle: { ...styles.subHeader },
            headerTitleStyle: {
              color: '#f9982f',
            },
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Drawer"
          component={DrawerScreen}
          options={{
            // headerShown: false,
            title: 'Borang Harian',
          }}
        />
        <Stack.Screen
          name="DrawerRight"
          component={DrawerRightScreen}
          options={({ route, navigation }) => ({
            // headerShown: false,
            title: 'Laporan Harian',
            headerTintColor: 'white',
            headerStyle: { ...styles.subHeader },
            headerTitleStyle: {
              color: '#f9982f',
            },
            headerBackTitleVisible: false,
            headerRight: () =>
              isLogin ? (
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                  <Entypo name="menu" size={24} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ paddingHorizontal: 5 }}
                  onPress={() => {
                    navigation.navigate('Login');
                  }}
                >
                  <Entypo name="login" size={24} color="white" />
                </TouchableOpacity>
              ),
          })}
        />
        <Stack.Screen
          name="ReportDaily"
          component={ReportDailyScreen}
          options={{
            headerShown: false,
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
            headerShown: false,
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
            headerTintColor: 'white',
            headerStyle: { ...styles.subHeader },
            headerTitleStyle: {
              color: '#f9982f',
            },
            headerBackTitleVisible: false,
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
          name="CreateQROffice"
          component={CreateQROfficeScreen}
          options={{
            headerShown: true,
            title: 'Cipta Kod QR Office',
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

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#254252',
  },
  subHeader: {
    backgroundColor: '#254252',
  },
});

export default App;
