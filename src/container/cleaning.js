import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;
const iconSize = parseInt((windowWidth * 10) / 100);
const color = 'grey';

export default function CleaningScreen({ navigation }) {
  const [snackbarMessage, setSnackbarMessage] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Selamat Mencuci</Text>

      <View style={{ flexDirection: 'row' }}>
        <MaterialCommunityIcons name="broom" size={iconSize} color={color} />
        <Entypo name="bucket" size={iconSize} color={color} />
        <MaterialIcons name="clean-hands" size={iconSize} color={color} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <FontAwesome5 name="toilet-paper" size={iconSize} color={color} />
        <Ionicons name="hourglass-outline" size={iconSize} color={color} />
        <FontAwesome5 name="toilet" size={iconSize} color={color} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <MaterialIcons name="cleaning-services" size={iconSize} color={color} />
        <Entypo name="trash" size={iconSize} color={color} />
        <Ionicons name="md-trash-sharp" size={iconSize} color={color} />
      </View>

      <TouchableOpacity style={styles.newButton} onPress={() => navigation.navigate('Scanner')}>
        <Text style={[styles.sectionDescription, { color: '#fff', fontWeight: '900' }]}>
          Kembali ke Imbas Kamera
        </Text>
      </TouchableOpacity>

      <Snackbar
        visible={snackbarMessage}
        onDismiss={() => setSnackbarMessage(false)}
        duration={1000}
        style={{ backgroundColor: '#00000000', opacity: 0.6 }}
      >
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000' }}
        >
          <View
            style={{
              borderRadius: 50,
              backgroundColor: 'palegreen',
              paddingVertical: 10,
              paddingHorizontal: 30,
            }}
          >
            <Text>Log Masuk Telah Berjaya.</Text>
          </View>
        </View>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 10,
    margin: 20,
  },
  newButton: {
    marginTop: 40,
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 10,
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
  },
});
