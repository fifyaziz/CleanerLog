import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CameraScreen({ navigation, route }) {
  const refCamera = useRef();
  const routeData = route?.params;
  const [permission, requestPermission] = useState();
  const [type, setType] = useState(CameraType.back);

  const onPictureSaved = async (photo) => {
    navigation.navigate('Name', { ...routeData, ...photo });
  };

  const takePicture = () => {
    if (refCamera.current) {
      refCamera.current.takePictureAsync({ onPictureSaved: onPictureSaved });
    }
  };

  const toggleCameraType = () => {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  useEffect(() => {
    try {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        requestPermission(status);
      })();
    } catch (e) {
      console.error('euc', e);
    }
  }, []);

  return (
    <Camera ref={refCamera} style={styles.camera} type={type}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: 'deepskyblue',
            }}
            onPress={toggleCameraType}
          >
            <MaterialCommunityIcons name="camera-flip-outline" size={30} color="deepskyblue" />
          </TouchableOpacity>
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
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    maxWidth: '65%',
    paddingLeft: 20,
  },
  camera: {
    flex: 1,
    width: windowWidth,
    height: windowHeight - 100,
    paddingBottom: 30,
  },
});
