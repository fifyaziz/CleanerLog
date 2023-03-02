import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import Supabase from '../config/initSupabase';

export default function LoginScreen({ onClose, navigation, route }) {
  const [pass, setPassword] = useState();
  const [error, setError] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  const handleOnChangeText = (e) => {
    setError();
    setPassword(e);
  };

  // const handleClose = () => {
  //   navigation.navigate('Report');
  // };
  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (e) => {
    const { data: dataFetch } = await Supabase.from('password')
      .select('pass')
      .eq('pass', pass.toString());
    if (dataFetch.length === 1) {
      try {
        await AsyncStorage.setItem('@MySuperPass', pass);
      } catch (error) {
        console.error(error);
      }
      ToastAndroid.show('Menu telah dibuka', ToastAndroid.BOTTOM);
      navigation.pop();
    } else {
      setError('Password salah.');
      try {
        return await AsyncStorage.removeItem('@MySuperPass');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // useEffect(() => {
  //   const getAsync = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('@MySuperPass');
  //       const routes = navigation.getState()?.routes;
  //       const prevRoute = routes;

  //       // if(value ){
  //       //   navigation.navigate('Dashboard');
  //       // }else{
  //       //   navigation.navigate('Report');
  //       // }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   getAsync();
  // }, [isFocused]);

  return (
    // <View style={styles.centeredView}>
    <Modal animationType="fade" transparent>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Masukkan Password</Text>
          <TextInput
            secureTextEntry
            keyboardType="numeric"
            style={styles.input}
            placeholder="Password"
            value={pass}
            onChangeText={(e) => {
              handleOnChangeText(e);
            }}
          ></TextInput>
          <Text style={{ color: 'red' }}>{error}</Text>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Pressable
              style={[styles.button, styles.buttonClose, { marginRight: 10 }]}
              onPress={() => navigation.pop()}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Tutup</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonClose]} onPress={() => handleSubmit()}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Hantar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333aa',
  },
  modalView: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    minWidth: '80%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 0,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'deepskyblue',
  },
});
