import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
import Supabase from '../config/initSupabase';

const windowHeight = Dimensions.get('screen').height - 189;
const windowWidth = Dimensions.get('window').width;
const minTitleBox = parseInt((windowWidth * 50) / 100);

export default function ListSubmittedFormPage({ activeTab }) {
  const navigation = useNavigation();
  const [listTop3, setListTop3] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    let final = [];
    if (activeTab === 1) {
      const { data: dataApproved } = await Supabase.from('entry')
        .select()
        .eq('approved', true)
        .order('id', { ascending: false });
      final = dataApproved;
    } else if (activeTab === 0) {
      const { data: dataSubmit } = await Supabase.from('entry')
        .select()
        .order('id', { ascending: false });
      final = dataSubmit;
    }

    setListTop3(final);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const onRefresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, []);

  return (
    <ScrollView
      style={{ height: windowHeight }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
    >
      <View style={styles.container}>
        {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
        {activeTab === 0 && listTop3.length > 0 && (
          <Text
            style={{
              width: windowWidth,
              textAlign: 'center',
              color: 'black',
              fontWeight: '700',
              paddingTop: 20,
              paddingBottom: 20,
              paddingHorizontal: 10,
              backgroundColor: 'lightpink',
            }}
          >
            Sebanyak {listTop3.length} borang belum disemak.
          </Text>
        )}

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
              <TouchableOpacity
                onPress={() => navigation.navigate('ReportDetails', { ...a, activeTab })}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ minWidth: minTitleBox }}>
                    <Text>{a.name}</Text>
                    <Text>
                      Tingkat {a.floor} - Tandas {a.gender === 1 ? '(L)' : '(P)'}
                    </Text>
                    <Text>{`${day < 10 ? '0' + day : day}/${
                      month < 10 ? '0' + month : month
                    }/${year} ${hours < 10 ? '0' + hours : hours}:${
                      minutes < 10 ? '0' + minutes : minutes
                    }`}</Text>
                  </View>

                  {activeTab === 0 && (
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
                  )}

                  {activeTab === 1 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {Array(Math.round(final))
                        .fill()
                        .map((item, i) => (
                          // <Ionicons key={i} name="md-star-sharp" size={24} color="gold" />
                          <Ionicons key={i} name="md-star" size={24} color="gold" />
                        ))}
                      {Array(5 - Math.round(final))
                        .fill()
                        .map((item, i) => (
                          <Ionicons key={i} name="md-star-outline" size={24} color="black" />
                        ))}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingTop: 20,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  boxContainer: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
