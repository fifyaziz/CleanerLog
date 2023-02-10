import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 8) / 100);
const titleSize = parseInt((windowWidth * 6) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

const Item = ({ data }) => (
  <View style={[styles.item, { backgroundColor: data.gender === 1 ? 'lightblue' : 'pink' }]}>
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.title}>Tingkat {data.floor}</Text>
      <Text style={styles.title}> - </Text>
      <Text style={styles.desc}>Bilik {data.gender === 1 ? 'Lelaki' : 'Perempuan'}</Text>
      {data.gender === 1 ? (
        <Ionicons name="man-sharp" size={18} color="blue" />
      ) : (
        <Ionicons name="woman-sharp" size={18} color="deeppink" />
      )}
    </View>
  </View>
);

export default function RoomScreen({ navigation }) {
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataFetch, error: errorFetch } = await Supabase.from('room').select();
      setList(dataFetch);
      setLoading(false)
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Senarai Bilik</Text>
        {loading && <ActivityIndicator style={{marginTop: 40}} color={"black"} size={50}/>}
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Name', {
                data: item,
              })
            }
          >
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
    marginTop: StatusBar.currentHeight || 0,
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
  },
  desc: {
    fontSize: fontSize,
  },
  text: {
    fontSize: headerSize,
    fontWeight: '600',
    padding: 10,
    marginHorizontal: 10,
  },
});
