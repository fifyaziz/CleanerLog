import { Button, StyleSheet, Text, View } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
          <View style={{ backgroundColor: 'red', flex: 2, padding: 10 }}>
            <Button title="Entry" onPress={() => navigation.navigate('Entry')} />
          </View>
          <View style={{ flex: 0.1 }} />
          <View style={{ backgroundColor: 'blue', flex: 2, padding: 10 }}>
            <Button title="History" onPress={() => navigation.navigate('History')} />
          </View>
        </View>

        <View
          style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}
        >
          <View style={{ backgroundColor: 'white', flex: 2, padding: 10 }}>
            <Button title="Scanner" onPress={() => navigation.navigate('Scanner')} />
          </View>
          <View style={{ flex: 0.1 }} />
          <View style={{ backgroundColor: 'black', flex: 2, padding: 10 }}>
            <Button title="Report" onPress={() => navigation.navigate('Report')} />
          </View>
        </View>
        <View
          style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}
        >
          <View style={{ backgroundColor: 'gray', flex: 1, padding: 10 }}></View>
          <View style={{ flex: 0.1 }} />
          <View style={{ backgroundColor: 'yellow', flex: 1, padding: 10 }}></View>
        </View>
      </View>
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

export default HomeScreen;
