import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from '@react-navigation/native';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.removeItem('@MySuperPass');
        navigation.pop();
        navigation.dispatch(DrawerActions.toggleDrawer());
        navigation.navigate('DrawerRight');
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return <View></View>;
}
