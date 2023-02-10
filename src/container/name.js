import { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 6) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

export default function NameScreen({ route, navigation }) {
  const [name, setName] = useState();
  const routeData = route?.params?.data;
  console.log('routeData name : ', routeData);

  const handleNext = () => {
    if (name) {
      navigation.navigate('Entry', { data: routeData, name });
    } else {
      ToastAndroid.show('Sila masukkan nama', ToastAndroid.TOP);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sila Isikan Nama</Text>
      <TextInput placeholder="Nama" style={styles.input} onChangeText={setName} value={name} />

      <TouchableOpacity style={styles.newButton} onPress={() => handleNext()}>
        <Text style={[styles.sectionDescription, { color: '#fff', fontWeight: '900' }]}>
          Seterusnya
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: headerSize,
    fontWeight: '600',
    padding: 10,
    marginHorizontal: 10,
  },
  input: {
    minWidth: '80%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionDescription: {
    fontSize: fontSize,
    fontWeight: '400',
  },
  newButton: {
    marginTop: 20,
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 20,
  },
});
