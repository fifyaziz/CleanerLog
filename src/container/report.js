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
import { dateAPIFormat, dayDateFormat, timeFormat } from '../config';
import Supabase from '../config/initSupabase';

const windowHeight = Dimensions.get('window').height - 189;
const windowWidth = Dimensions.get('window').width;
const minTitleBox = parseInt((windowWidth * 50) / 100);

export default function ReportScreen({ navigation }) {
  const [listTop3, setListTop3] = useState([]);
  const [loading, setLoading] = useState(true);

  const before = `${dateAPIFormat(new Date())} 00:00`;
  const after = `${dateAPIFormat(new Date())} 23:59`;

  const fetchData = async () => {
    const { data: dataFetch } = await Supabase.from('check_in_out')
      .select()
      .gte('check_out', before)
      .lte('check_out', after)
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
        <Text style={styles.subTitle}>{dayDateFormat(new Date())}</Text>

        {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
        {listTop3?.length > 0 ? (
          listTop3?.map((a, i) => {
            const countObject = Object.keys(a).length - 7;

            const convert = Object.keys(a).map(function (key) {
              return a[key];
            });
            const count = convert.filter((a) => a === false)?.length;
            const final = (count / countObject) * 5;

            return (
              <View key={i} style={styles.boxContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('ReportDetails', a)}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ minWidth: minTitleBox }}>
                      <Text>{a.name}</Text>
                      <Text>
                        {a.is_surau ? 'Surau' : 'Tandas'} {a.toilet_name}{' '}
                        {a.gender === 1 ? '(L)' : '(P)'} -{' '}
                        <Text style={{ textTransform: 'capitalize' }}>{a.building} </Text>
                        Tingkat <Text style={{ textTransform: 'uppercase' }}>{a.floor}</Text>
                      </Text>
                      <Text>{`${timeFormat(a.check_in)} - ${timeFormat(a.check_out)}`}</Text>
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
    paddingHorizontal: '10%',
    width: windowWidth,
    alignItems: 'flex-start',
  },
  login: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
