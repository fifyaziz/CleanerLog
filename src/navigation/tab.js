import { AntDesign, Entypo, Ionicons, Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { useEffect } from 'react';
import {
  AppState,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import ScannerScreen from '../modules/qrScanner';
import ReportScreen from '../modules/report';
import ReportWeeklyScreen from '../modules/reportWeekly';
import RoomScreen from '../modules/room';
import SenaraiOfficeScreen from '../modules/senaraiOffice';
import SenaraiPekerjaScreen from '../modules/senaraiPekerja';
import SenaraiSurauScreen from '../modules/senaraiSurau';
import SenaraiTandasScreen from '../modules/senaraiTandas';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const windowWidth = Dimensions.get('window').width;
const textSize = parseInt((windowWidth * 4) / 100);

export function DrawerScreen({ navigation }) {
  const [isLogin, setIsLogin] = React.useState();

  const handleClearData = async () => {
    try {
      await AsyncStorage.removeItem('@MySuperPass');
      setIsLogin();
      ToastAndroid.show('Menu telah ditutup', ToastAndroid.BOTTOM);
    } catch (e) {
      console.error('erroe', e);
    }
  };

  useFocusEffect(() => {
    const handleFetch = async () => {
      try {
        const getVal = await AsyncStorage.getItem('@MySuperPass');
        setIsLogin(getVal);
      } catch (e) {
        console.error('erroe', e);
      }
    };
    handleFetch();
  });

  return (
    <Drawer.Navigator initialRouteName="Report" drawerPosition="right">
      <Drawer.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Borang Harian',
          headerStyle: { ...styles.header },
          headerRight: () =>
            isLogin ? (
              <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={handleClearData}>
                <Entypo name="log-out" size={24} color="red" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ paddingHorizontal: 20 }}
                onPress={() => {
                  navigation.navigate('Login');
                }}
              >
                <Entypo name="login" size={24} color="black" />
              </TouchableOpacity>
            ),
        }}
      />
      {/* <Drawer.Screen
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
      /> */}
      {isLogin && (
        <Drawer.Screen
          name="SenaraiTandas"
          component={SenaraiTandasScreen}
          options={{
            title: 'Senarai Tandas',
            headerStyle: { ...styles.header },
            headerRight: () => (
              <TouchableOpacity
                style={{ paddingHorizontal: 20 }}
                onPress={() => {
                  navigation.navigate('CreateQRTandas');
                }}
              >
                <Octicons name="diff-added" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      {isLogin && (
        <Drawer.Screen
          name="SenaraiSurau"
          component={SenaraiSurauScreen}
          options={{
            title: 'Senarai Surau',
            headerStyle: { ...styles.header },
            headerRight: () => (
              <TouchableOpacity
                style={{ paddingHorizontal: 20 }}
                onPress={() => {
                  navigation.navigate('CreateQRSurau');
                }}
              >
                <Octicons name="diff-added" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      {isLogin && (
        <Drawer.Screen
          name="SenaraiOffice"
          component={SenaraiOfficeScreen}
          options={{
            title: 'Senarai Pejabat',
            headerStyle: { ...styles.header },
            headerRight: () => (
              <TouchableOpacity
                style={{ paddingHorizontal: 20 }}
                onPress={() => {
                  navigation.navigate('CreateQROffice');
                }}
              >
                <Octicons name="diff-added" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      {isLogin && (
        <Drawer.Screen
          name="SenaraiPekerja"
          component={SenaraiPekerjaScreen}
          options={{
            title: 'Senarai Pekerja',
            headerStyle: { ...styles.header },
            headerRight: () => (
              <TouchableOpacity
                style={{ paddingHorizontal: 20 }}
                onPress={() => {
                  navigation.navigate('CreatePekerja');
                }}
              >
                <AntDesign name="adduser" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      {isLogin && (
        <Drawer.Screen
          name="ReportWeekly"
          component={ReportWeeklyScreen}
          options={{
            title: 'Laporan Mingguan',
            headerStyle: { ...styles.header },
          }}
        />
      )}
    </Drawer.Navigator>
  );
}

export default function TapNav({ navigation }) {
  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        try {
          await AsyncStorage.removeItem('@storage_key');
          // navigation.dispatch(
          //   CommonActions.reset({
          //     index: 0,
          //     routes: [{ name: 'Select' }],
          //   })
          // );
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
      initialRouteName="Scanner"
      screenOptions={({ route }) => ({
        headerShown: false,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '600',
          height: 90,
          paddingTop: 30,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? (Platform.isPad == true ? 120 : 80) : 60,
          // backgroundColor:'black',
          borderTopWidth: 1,
          borderTopColor: 'ligthgrey',
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabel: ({ focused, color }) => {
          let screenName = '';
          let result = '';
          if (route.name === 'Select') {
            screenName = 'Home';
          } else if (route.name === 'TabRoom') {
            screenName = 'Manual';
          } else if (route.name === 'Scanner') {
            screenName = 'Imbas Kamera';
          } else if (route.name === 'Drawer') {
            screenName = 'Borang Harian';
          }
          return (
            <Text
              style={{
                fontSize: focused
                  ? textSize - 1
                  : route.name === 'Scanner'
                  ? textSize - 3
                  : textSize - 4,
                fontWeight: focused ? '900' : '500',
                color: focused ? 'white' : color,
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
          } else if (route.name === 'TabRoom') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'QR') {
            iconName = focused ? 'md-qr-code' : 'md-qr-code-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'md-camera' : 'md-camera-outline';
          } else if (route.name === 'Drawer') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          }

          return (
            <View
              style={{
                position: 'absolute',
                top: route.name === 'Scanner' ? -20 : 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: 'white',
                borderTopRightRadius: route.name === 'Scanner' ? 20 : 0,
                borderTopLeftRadius: route.name === 'Scanner' ? 20 : 0,
                borderTopWidth:
                  focused && route.name === 'Scanner' ? 0 : route.name !== 'Scanner' ? 0 : 1,
                borderLeftWidth:
                  focused && route.name === 'Scanner' ? 0 : route.name !== 'Scanner' ? 0 : 1,
                borderRightWidth:
                  focused && route.name === 'Scanner' ? 0 : route.name !== 'Scanner' ? 0 : 1,
                backgroundColor: focused ? color : 'white',
              }}
            >
              {focused ? (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: color,
                    bottom: -25,
                    width: '100%',
                    height: 30,
                  }}
                ></View>
              ) : route.name === 'Scanner' ? (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -25,
                    width: '101%',
                    height: 25,
                    borderBottomWidth: 1,
                    borderRightWidth: 1,
                    borderLeftWidth: 1,
                  }}
                ></View>
              ) : (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    width: '100%',
                    height: 20,
                    borderBottomWidth: 1,
                  }}
                ></View>
              )}
              <Ionicons
                style={{
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                }}
                name={iconName}
                size={
                  route.name === 'Scanner'
                    ? Platform.isPad == true
                      ? size + 60
                      : focused
                      ? size + 20
                      : size + 15
                    : size - 5
                }
                color={focused ? 'white' : color}
              />
            </View>
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="TabRoom"
        component={RoomScreen}
        options={{
          headerShown: true,
          title: '',
          headerStyle: { ...styles.header },
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          headerShown: true,
          title: '',
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
    backgroundColor: '#e9edc9',
    borderBottomWidth: 0,
  },
});
