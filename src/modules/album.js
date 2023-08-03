import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AlbumScreen() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={{ backgroundColor: 'deepskyblue', borderRadius: 10, padding: 10 }}
        onPress={pickImage}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '500' }}>Buka Galeri</Text>
      </TouchableOpacity>

      <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textButton: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
  },
});
