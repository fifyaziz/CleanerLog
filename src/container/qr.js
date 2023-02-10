// import * as Sharing from 'expo-sharing';
import { useRef } from 'react';
import { Button, Share, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const data = {
  name: 'QR Data',
  url: 'google.com',
  image: 'base 64',
};

export default function QRScreen() {
  let refQR = useRef();

  const callback = (dataURL) => {
    console.log('data url', dataURL);
    console.log('---');

    let shareImageBase64 = {
      title: 'QR Code Title',
      url: 'data:image/jpg;base64,' + dataURL,
      type: 'image/jpg',
      message: `Share Message QR Code`, //  for email
    };
    Share.share(shareImageBase64).catch((error) => console.log(error));
    //   Sharing.shareAsync(shareImageBase64);
  };

  const handleShare = () => {
    refQR.current.toDataURL(callback);
  };

  return (
    <View style={styles.container}>
      <QRCode value={JSON.stringify(data)} getRef={(c) => (refQR.current = c)} />
      <Button title="Share QR" onPress={handleShare} />
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
});
