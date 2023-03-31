import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
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
      <Text style={styles.title}>Tandas {data.name} </Text>
      <Text style={styles.title}> - </Text>
      <Text style={styles.desc}>
        {data.building} Tingkat {data.floor}
      </Text>
    </View>
  </View>
);

export default function SenaraiTandasScreen({ navigation }) {
  const [list, setList] = useState();
  const [loading, setLoading] = useState(true);

  useFocusEffect(() => {
    const fetchData = async () => {
      const { data: dataFetch, error: errorFetch } = await Supabase.from('service_area')
        .select()
        .eq('is_surau', false)
        .order('order', { ascending: true });
      setList(dataFetch);
      setLoading(false);
    };

    fetchData().catch(console.error);
  });

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditQR', {
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
    textTransform: 'capitalize',
  },
  desc: {
    fontSize: fontSize,
    textTransform: 'capitalize',
  },
});
