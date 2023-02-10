import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Supabase from '../config/initSupabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const minTitleBox = parseInt((windowWidth * 50) / 100);

export default function ReportScreen() {
  const [listTop3, setListTop3] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: dataFetch } = await Supabase.from('entry').select()
    .order('id', { ascending: false });

    setListTop3(dataFetch);
    setLoading(false)
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, []);


  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={loading} onRefresh={onRefresh} />
    }>
      <View style={styles.container}>
        <Text style={styles.title}>Senarai Borang Terbaru</Text>
        {loading && <ActivityIndicator style={{marginTop: 40}} color={"black"} size={50}/>}
        {listTop3?.map((a, i) => {
          const countObject = Object.keys(a).length - 7;

          const convert = Object.keys(a).map(function (key) {
            return a[key];
          });

          const count = convert.filter((a) => a === false)?.length;

          const final = (count / countObject) * 5;

          const date = new Date(a.datetime_created);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const hours = date.getHours();
          const minutes = date.getMinutes();

          return (
            <View key={i} style={styles.boxContainer}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ minWidth: minTitleBox }}>
                  <Text>{a.name}</Text>
                  <Text>
                    Tingkat {a.floor} - Bilik {a.gender === 1 ? 'Lelaki' : 'Perempuan'}
                  </Text>
                  <Text>{`${day < 10 ? '0' + day : day}/${
                    month < 10 ? '0' + month : month
                  }/${year} ${hours < 10 ? '0' + hours : hours}:${
                    minutes < 10 ? '0' + minutes : minutes
                  }`}</Text>
                </View>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                >
                  {Array(parseInt(final))
                    .fill()
                    .map((item, i) => (
                      // <Ionicons key={i} name="md-star-sharp" size={24} color="gold" />
                      <Ionicons key={i} name="md-star" size={24} color="gold" />
                    ))}
                  {Array(5 - parseInt(final))
                    .fill()
                    .map((item, i) => (
                      <Ionicons key={i} name="md-star-outline" size={24} color="black" />
                    ))}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height:windowHeight
  },
  maintenance: {
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderColor: 'red',
    backgroundColor: 'yellow',
  },
  title: {
    marginTop:20,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  boxContainer: {
    borderBottomWidth: 1,
    paddingVertical: 10
  },
});
