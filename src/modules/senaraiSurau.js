import { Ionicons, Octicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../config/AuthContext';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('window').width;
const titleSize = parseInt((windowWidth * 5) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

const Item = ({ data }) => (
  <View style={[styles.item, { backgroundColor: data.gender === 1 ? 'lightblue' : 'pink' }]}>
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
      {data.gender === 1 ? (
        <Ionicons name="man-sharp" size={titleSize} color="blue" />
      ) : (
        <Ionicons name="woman-sharp" size={titleSize} color="deeppink" />
      )}
      <Text style={styles.title}>Surau {data.name} </Text>
      <Text style={styles.title}> - </Text>
      <Text style={styles.desc}>
        {data.building} Tingkat {data.floor}
      </Text>
    </View>
  </View>
);

export default function SenaraiSurauScreen({ navigation }) {
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);
  const { fixtureMode } = useContext(AuthContext);

  useFocusEffect(() => {
    if (fixtureMode) {
      setLoading(false);
      setList(require('../constants/a.json'));
    } else {
      const fetchData = async () => {
        const { data: dataFetch, error: errorFetch } = await Supabase.from('service_area')
          .select()
          .eq('is_surau', true)
          .order('order', { ascending: true });
        setList(dataFetch);
        setLoading(false);
      };

      fetchData().catch(console.error);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
      <View style={{ backgroundColor: 'white', height: Platform.OS === 'ios' ? '93%' : '90%' }}>
        {!list ||
          (list.length === 0 && (
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '600' }}>
              {' '}
              - Tiada Surau -{' '}
            </Text>
          ))}
        <FlatList
          data={list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreateEditQR', {
                  data: item,
                  info: { screenType: 1, serviceAreaType: 2 },
                })
              }
            >
              <Item data={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          style={{
            minWidth: '70%',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#2a908f',
          }}
          onPress={() =>
            navigation.navigate('CreateEditQR', {
              info: { screenType: 0, serviceAreaType: 2 },
            })
          }
        >
          <Octicons name="diff-added" size={24} color="white" />
          <Text style={{ paddingLeft: 10, color: 'white', fontWeight: '700' }}>Tambah</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#254252',
  },
  item: {
    backgroundColor: 'lightgreen',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: titleSize,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  desc: {
    fontSize: fontSize,
    textTransform: 'capitalize',
  },
});
