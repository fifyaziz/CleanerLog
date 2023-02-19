import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { dayDateFormat } from '../config';
import Supabase from '../config/initSupabase';

const windowHeight = Dimensions.get('window').height - 189;
const windowWidth = Dimensions.get('window').width;
const minTitleBox = parseInt((windowWidth * 50) / 100);

export default function ReportScreen({ navigation }) {
  const [listTop3, setListTop3] = useState([]);
  const [loading, setLoading] = useState(true);

  var start = new Date();
  // start.setDate(start.getDate() - 4);
  start.setUTCHours(0, 0, 0, 0);

  var end = new Date();
  // end.setDate(end.getDate() - 4);
  end.setUTCHours(23, 59, 59, 999);

  const fetchData = async () => {
    const { data: dataFetch } = await Supabase.from('entry')
      .select()
      .gte('datetime_created', start.toISOString())
      .lte('datetime_created', end.toISOString())
      .order('id', { ascending: false });

    setListTop3(dataFetch);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <Text style={styles.title}>Senarai Log Hari Ini</Text>
        <Text style={styles.subTitle}>{dayDateFormat(start)}</Text>

        {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
        {listTop3?.length > 0 ? (
          listTop3?.map((a, i) => {
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
                <TouchableOpacity onPress={() => navigation.navigate('ReportDetails', a)}>
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
                      style={{
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        paddingLeft: 20,
                      }}
                    >
                      {count > 0 && (
                        <Text>
                          <Ionicons name="thumbs-up-outline" size={24} color="green" /> - {count}{' '}
                        </Text>
                      )}
                      {countObject - count > 0 && (
                        <Text>
                          <Ionicons name="thumbs-down-outline" size={24} color="red" /> -{' '}
                          {countObject - count}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View style={[styles.container, { paddingTop: '10%', paddingBottom: windowHeight }]}>
            <Text style={{ fontWeight: '600', color: 'red', textAlign: 'center' }}>
              {' '}
              - Tiada borang terbaru -{'\n'}- untuk hari ini -
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  boxContainer: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    width: windowWidth,
    alignItems: 'center',
  },
  login: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
