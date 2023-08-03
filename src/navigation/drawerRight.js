import { Entypo, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReportDailyScreen from '../modules/reportDaily';
import ReportWeeklyScreen from '../modules/reportWeekly';
import SenaraiOfficeScreen from '../modules/senaraiOffice';
import SenaraiPekerjaScreen from '../modules/senaraiPekerja';
import SenaraiSurauScreen from '../modules/senaraiSurau';
import SenaraiTandasScreen from '../modules/senaraiTandas';

const Drawer = createDrawerNavigator();

export default function DrawerRightScreen({ navigation, route }) {
  const isFocused = useIsFocused();

  const [isLogin, setIsLogin] = React.useState(false);

  const CustomDrawerContent = (props) => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <View style={styles.customItem}>
          <Entypo name="log-out" size={24} color="red" />
          <Text
            style={{ marginLeft: 10, fontWeight: '600' }}
            onPress={() => {
              props.navigation.navigate('Logout');
            }}
          >
            Logout
          </Text>
        </View>
        {/* <DrawerItem
          label="Logout"
          options={{
            drawerIcon: ({ color }) => <Entypo name="log-out" size={24} color="red" />,
          }}
        /> */}
      </SafeAreaView>
    );
  };

  React.useEffect(() => {
    (async () => {
      try {
        const getVal = await AsyncStorage.getItem('@MySuperPass');
        setIsLogin(Boolean(getVal));
      } catch (e) {
        console.error('erroe', e);
      }
    })();
  }, [isFocused]);

  return (
    <Drawer.Navigator
      initialRouteName="DrawerReportDaily"
      drawerPosition="right"
      screenOptions={{
        drawerPosition: 'right',
        swipeEnabled: isLogin,
        headerStyle: { ...styles.subHeader },
        headerTitleStyle: { ...styles.titleSubHeader },
        headerLeftLabelVisible: false,
        headerLeft: () => (
          <View style={{ paddingLeft: Platform.OS === 'ios' ? 3 : 18 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === 'ios' ? (
                <Ionicons name="chevron-back" size={30} color="white" />
              ) : (
                <Ionicons name="arrow-back" size={25} color="white" />
              )}
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingRight: 15 }}>
            {isLogin ? (
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                <Ionicons name="menu" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Entypo name="login" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        ),
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Group
        screenOptions={{
          headerShown: true,
        }}
      >
        <Drawer.Screen
          name="DrawerReportDaily"
          component={ReportDailyScreen}
          options={{
            title: 'Laporan Harian',
          }}
        />
        <Drawer.Screen
          name="DrawerListStaff"
          component={SenaraiPekerjaScreen}
          options={{
            title: 'Senarai Pekerja',
          }}
        />
        <Drawer.Screen
          name="DrawerListToilet"
          component={SenaraiTandasScreen}
          options={{
            title: 'Senarai Tandas',
          }}
        />
        <Drawer.Screen
          name="DrawerListSurau"
          component={SenaraiSurauScreen}
          options={{
            title: 'Senarai Surau',
          }}
        />
        <Drawer.Screen
          name="DrawerListOffice"
          component={SenaraiOfficeScreen}
          options={{
            title: 'Senarai Pejabat',
          }}
        />
        <Drawer.Screen
          name="ReportWeekly"
          component={ReportWeeklyScreen}
          options={{
            title: 'Laporan Mingguan',
          }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e9edc9',
    borderBottomWidth: 0,
  },
  subHeader: {
    backgroundColor: '#254252',
  },
  titleSubHeader: {
    color: '#f9982f',
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    fontWeight: '600',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
  },
});
