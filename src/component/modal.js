import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Supabase from '../config/initSupabase';

export default function ModalLogin() {
  const [input, setInput] = useState();
  const [error, setError] = useState(false);
  const [openModal, setOpenModal] = useState(true);
  const navigation = useNavigation();

  const handleClose = () => {
    setOpenModal(!openModal);
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: 'Report' }],
    //   })
    // );
  };

  const handlePress = useCallback(async () => {
    const { data: dataFetch } = await Supabase.from('password').select('pass').eq('pass', input);
    if (dataFetch?.length > 0) {
      try {
        await AsyncStorage.setItem('@storage_key', input);
        setOpenModal(false);
        setInput();
      } catch (e) {
        console.error('ehs', e);
      }
    } else {
      setError('Kata laluan tidak sah');
    }
  }, [input]);

  useFocusEffect(() => {
    const storeData = async () => {
      try {
        const getValue = await AsyncStorage.getItem('@storage_key');
        setOpenModal(!getValue);
      } catch (e) {
        console.error('euff', e);
      }
    };
    storeData();
  });

  return (
    <Modal animationType="slide" transparent={true} visible={openModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Masukkan kata laluan</Text>
          <TextInput
            placeholder="Kata Laluan"
            keyboardType="numeric"
            secureTextEntry={true}
            style={styles.textInput}
            value={input}
            onChangeText={(e) => {
              setError();
              setInput(e);
            }}
          />
          <Text style={{ color: 'red', paddingTop: 5, textAlign: 'left' }}>{error}</Text>

          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: 'grey',
                },
              ]}
              onPress={() => handleClose()}
            >
              <Text style={styles.textStyle}>Batal</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: 'deepskyblue',
                },
              ]}
              onPress={() => handlePress(input)}
            >
              <Text style={styles.textStyle}>Hantar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    paddingTop: 10,
    paddingHorizontal: 35,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: '800',
    textAlign: 'center',
  },
  textInput: {
    textAlign: 'left',
    paddingTop: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'black',
  },
});
