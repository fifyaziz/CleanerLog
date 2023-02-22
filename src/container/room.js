import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Supabase from '../config/initSupabase';

const Item = ({ data }) => (
  <View
    style={{
      backgroundColor: data.gender === 1 ? 'lightblue' : 'pink',
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 15,
      marginVertical: 5,
    }}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
      {data.gender === 1 ? (
        <Ionicons name="man-sharp" size={20} color="blue" />
      ) : (
        <Ionicons name="woman-sharp" size={18} color="deeppink" />
      )}
      <Text style={{ textTransform: 'capitalize', fontWeight: '500' }}> Tandas {data.name}</Text>
      <Text> - </Text>
      <Text style={{ textTransform: 'capitalize', fontWeight: '500' }}>
        {data.building} Tingkat {data.floor}
      </Text>
    </View>
  </View>
);

export default function RoomScreen({ navigation }) {
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const handleSelect = (item) => {
    if (isLogin) {
      // navigation.navigate('ReportStaff', JSON.stringify(item))
      navigation.navigate('Name', JSON.stringify(item));
    } else {
      navigation.navigate('Name', JSON.stringify(item));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataFetch, error: errorFetch } = await Supabase.from('tandas').select();
      try {
        const storageData = await AsyncStorage.getItem('@storage_data');
        console.log(storageData);
        setIsLogin(storageData);
        if (storageData) {
          const temp = JSON.parse(storageData);
          const final = dataFetch?.filter((a) => a.name === temp.name && a.gender === temp.gender);
          setList(final);
        } else {
          setList(dataFetch);
        }
      } catch (e) {
        console.error('ehci', e);
      }
      setLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { padding: 20 }]}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Senarai Tandas</Text>

      {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}

      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <Item data={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
