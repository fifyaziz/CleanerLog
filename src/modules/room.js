import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../config/AuthContext';
import Supabase from '../config/initSupabase';

const Item = ({ data, label }) => (
  <View
    style={{
      backgroundColor: data.gender === 1 ? 'lightblue' : data.gender === 0 ? 'white' : 'pink',
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 15,
      marginVertical: 5,
    }}
  >
    <View style={{ flex: 4, flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
      {data.gender === 0 ? (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Ionicons name="man-sharp" size={20} color="blue" />
          <Ionicons name="woman-sharp" size={18} color="deeppink" />
        </View>
      ) : data.gender === 1 ? (
        <Ionicons name="man-sharp" size={20} color="blue" />
      ) : (
        <Ionicons name="woman-sharp" size={18} color="deeppink" />
      )}
      <Text style={{ fontWeight: '500', flexShrink: 1 }}>
        {label} {data.name}
        {data.gender === 1 ? ' (L)' : data.gender === 0 ? '' : ' (P)'}
      </Text>
      <Text> - </Text>
      <Text style={{ textTransform: 'capitalize', fontWeight: '500' }}>{data.building}</Text>
      <Text
        style={{ fontWeight: '500', flexWrap: 'wrap', flexShrink: 1 }}
      >{` Tingkat ${data.floor}`}</Text>
    </View>
  </View>
);

export default function RoomScreen({ navigation }) {
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);

  const { fixtureMode } = useContext(AuthContext);

  const handleSelect = (item) => {
    navigation.navigate('Name', JSON.stringify(item));
  };

  useFocusEffect(
    useCallback(async () => {
      if (fixtureMode) {
        setLoading(false);

        const dataFetch = require('../constants/room.json');
        const filterSurau = dataFetch?.surau;
        const filterTandas = dataFetch?.tandas;
        const filterOffice = dataFetch?.office;

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
          const finalOffice = filterOffice?.filter(
            (a) =>
              a.name === temp.name &&
              a.building === temp.building &&
              a.floor === temp.floor &&
              a.gender === temp.gender
          );
          setList({ tandas: final, surau: finalSurau, office: finalOffice });
        }
      } else {
        const fetchData = async () => {
          const { data: dataFetch } = await Supabase.from('service_area')
            .select()
            .order('order', { ascending: true });
          const filterSurau = dataFetch?.filter((a) => a.is_surau);
          const filterTandas = dataFetch?.filter((a) => !a.is_surau && !a.is_office);
          const filterOffice = dataFetch?.filter((a) => a.is_office);
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
              const finalOffice = filterOffice?.filter(
                (a) =>
                  a.name === temp.name &&
                  a.building === temp.building &&
                  a.floor === temp.floor &&
                  a.gender === temp.gender
              );
              setList({ tandas: final, surau: finalSurau, office: finalOffice });
            } else {
              setList({ tandas: filterTandas, surau: filterSurau, office: filterOffice });
            }
          } catch (e) {
            console.error('ehci', e);
          }
          setLoading(false);
        };

        fetchData().catch(console.error);
      }
    }, [])
  );

  useEffect(() => {
    (async () => {
      const getDate = await AsyncStorage.getItem('@storage_checkin_date');
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{ padding: 20 }}>
        {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
        {list?.surau?.length > 0 && (
          <View style={{ maxHeight: list?.tandas?.length > 0 ? '50%' : '100%' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Senarai Surau
            </Text>
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
          <View style={{ maxHeight: list?.office?.length > 0 ? '60%' : '100%' }}>
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
        {list?.office?.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 10,
                marginTop: list?.surau?.length > 0 ? 20 : 0,
              }}
            >
              Senarai Office
            </Text>
            <FlatList
              data={list?.office}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Item data={item} label="Pejabat" />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
