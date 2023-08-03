import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ListSubmittedFormPage from '../component/listSubmittedForm';
import ModalLogin from '../component/modal';

export default function DashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={[
            styles.tabView,
            {
              borderBottomColor: activeTab === 0 ? 'deepskyblue' : 'transparent',
            },
          ]}
          onPress={() => setActiveTab(0)}
        >
          <Text
            style={{
              color: activeTab === 0 ? 'deepskyblue' : 'black',
              fontWeight: activeTab === 0 ? '900' : '400',
            }}
          >
            Belum Disemak
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabView,
            {
              borderBottomColor: activeTab === 1 ? 'deepskyblue' : 'transparent',
            },
          ]}
          onPress={() => setActiveTab(1)}
        >
          <Text
            style={{
              color: activeTab === 1 ? 'deepskyblue' : 'black',
              fontWeight: activeTab === 1 ? '900' : '400',
            }}
          >
            Sudah Disemak
          </Text>
        </TouchableOpacity>
      </View>

      <ModalLogin />

      <ListSubmittedFormPage activeTab={activeTab} />
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
  tabView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 50,
    borderBottomWidth: 4,
  },
});
