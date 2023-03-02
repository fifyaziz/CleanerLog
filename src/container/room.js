import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Supabase from '../config/initSupabase';

const Item = ({ data, label }) => (
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
      <Text style={{ fontWeight: '500' }}>
        {' '}
        {label} {data.name}
        {data.gender === 1 ? ' (L)' : ' (P)'}
      </Text>
      <Text> - </Text>
      <Text style={{ textTransform: 'capitalize', fontWeight: '500' }}>{data.building}</Text>
      <Text style={{ fontWeight: '500' }}>{` Tingkat ${data.floor}`}</Text>
    </View>
  </View>
);

export default function RoomScreen({ navigation }) {
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);

  const handleSelect = (item) => {
    navigation.navigate('Name', JSON.stringify(item));
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const { data: dataFetch } = await Supabase.from('service_area').select()
        .order('order', { ascending: true });
        const filterSurau = dataFetch?.filter((a) => a.is_surau);
        const filterTandas = dataFetch?.filter((a) => !a.is_surau);
        try {
          const storageData = await AsyncStorage.getItem('@storage_data');
          if (storageData) {
            const temp = JSON.parse(storageData);
            const final = filterTandas?.filter(
              (a) =>
                a.name === temp.name &&
                a.building === temp.building &&
                a.floor === temp.floor &&
                a.gender === temp.gender
            );
            const finalSurau = filterSurau?.filter(
              (a) =>
                a.name === temp.name &&
                a.building === temp.building &&
                a.floor === temp.floor &&
                a.gender === temp.gender
            );
            setList({ tandas: final, surau: finalSurau });
          } else {
            setList({ tandas: filterTandas, surau: filterSurau });
          }
        } catch (e) {
          console.error('ehci', e);
        }
        setLoading(false);
      };

      fetchData().catch(console.error);
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { padding: 20 }]}>
      <View></View>
      {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
      {list?.surau?.length > 0 && (
        <View style={{ maxHeight: '50%' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Senarai Surau</Text>
          <FlatList
            data={list?.surau}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Item data={item} label="Surau" />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
      {list?.tandas?.length > 0 && (
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 10,
              marginTop: list?.surau?.length > 0 ? 20 : 0,
            }}
          >
            Senarai Tandas
          </Text>
          <FlatList
            data={list?.tandas}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Item data={item} label="Tandas" />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
