import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useContext, useEffect, useState } from 'react';
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

const Tab = createMaterialTopTabNavigator();

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

function TabScreen({ route, navigation }) {
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);

  const { fixtureMode } = useContext(AuthContext);

  const handleSelect = (item) => {
    navigation.navigate('Name', JSON.stringify(item));
  };

  useEffect(() => {
    if (fixtureMode) {
      setLoading(false);
      setList(require('../constants/room.json'));
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
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{ padding: 20 }}>
        {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
        {route.name === 'Surau' && list?.surau?.length > 0 && (
          <View>
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
        {route.name === 'Tandas' && list?.tandas?.length > 0 && (
          <View>
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
        {route.name === 'Pejabat' && list?.office?.length > 0 && (
          <View>
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

export default function NewRoomScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e37239',
        tabBarInactiveTintColor: 'lightgrey',
        tabBarIndicatorStyle: {
          backgroundColor: '#e37239',
        },
        tabBarStyle: {
          // height: 55,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 14,
          margin: 0,
        },
      }}
    >
      <Tab.Screen name="Tandas" component={TabScreen} />
      <Tab.Screen name="Surau" component={TabScreen} />
      <Tab.Screen name="Pejabat" component={TabScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
