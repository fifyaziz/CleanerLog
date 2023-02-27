import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('window').width;
const titleSize = parseInt((windowWidth * 5) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

const Item = ({ data, i }) => (
  <View style={[styles.item, { borderBottomWidth: 1, borderColor: 'black' }]}>
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
      <Text style={styles.desc}>{`${i + 1} - (${data.staff_id}) ${data.staff_name}`} </Text>
    </View>
  </View>
);

export default function SenaraiPekerjaScreen({ navigation }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(() => {
    const fetchData = async () => {
      const { data: dataFetch, error: errorFetch } = await Supabase.from('staff').select();
      setList(dataFetch);
      setLoading(false);
    };

    fetchData().catch(console.error);
  });

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator color={'black'} size={50} />}
      {list.length > 0 ? (
        <FlatList
          data={list}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreatePekerja', {
                  type: 'edit',
                  ...item,
                })
              }
            >
              <Item data={item} i={index} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View>
          <Text style={{ textAlign: 'center', fontWeight: '500', color: 'red', fontSize: 16 }}>
            - Tiada Pekerja -
          </Text>
          <Text style={{ textAlign: 'center', fontWeight: '500', color: 'red', fontSize: 16 }}>
            Sila Tambah Pekerja
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  item: {
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
