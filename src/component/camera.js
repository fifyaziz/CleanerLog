import { FontAwesome } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { useRef } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CameraScreen({ navigation, route }) {
  const refCamera = useRef();
  const routeData = route?.params;

  const onPictureSaved = async (photo) => {
    navigation.navigate('Name', { ...routeData, ...photo });
  };

  const takePicture = () => {
    if (refCamera.current) {
      refCamera.current.takePictureAsync({ onPictureSaved: onPictureSaved });
    }
  };

  return (
    <Camera ref={refCamera} style={styles.camera}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: 'deepskyblue',
          }}
          onPress={takePicture}
        >
          <FontAwesome name="dot-circle-o" size={40} color="deepskyblue" />
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: windowWidth,
    height: windowHeight - 100,
    paddingBottom: 30,
  },
});
