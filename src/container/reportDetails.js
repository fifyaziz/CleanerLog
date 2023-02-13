import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 6) / 100);
const titleSize = parseInt((windowWidth * 5) / 100);
const title2Size = parseInt((windowWidth * 4) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

export default function ReportDetailScreen({ route }) {
  const routeData = route?.params;

  const [loading, setLoading] = useState(true);
  const [listKemudahanBaik, setListKemudahanBaik] = useState();
  const [listKemudahanRosak, setListKemudahanRosak] = useState();

  const date = new Date(routeData.datetime_created);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataFetch } = await Supabase.from('kemudahan').select();

      const filter = dataFetch?.map((a, i) => a.ref_name);
      const finalBaik = filter?.filter((a, i) => !routeData[a]);
      const finalRosak = filter?.filter((a, i) => routeData[a]);
      setListKemudahanBaik(finalBaik);
      setListKemudahanRosak(finalRosak);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Maklumat Tingkat {routeData?.floor}</Text>
        <Text style={styles.title}>Bilik {routeData?.gender === '1' ? 'Lelaki' : 'Perempuan'}</Text>

        <Text style={styles.title2}>Tarikh & Masa</Text>
        <Text style={styles.desc}>{`${day < 10 ? '0' + day : day}/${
          month < 10 ? '0' + month : month
        }/${year} ${hours < 10 ? '0' + hours : hours}:${
          minutes < 10 ? '0' + minutes : minutes
        }`}</Text>

        <Text style={styles.title2}>Dicuci Oleh</Text>
        <Text style={styles.desc}>{routeData.name}</Text>

        {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={{ minWidth: '45%', paddingHorizontal: 15 }}>
            <Text style={styles.headerTable}>Bersin/Baik</Text>
            {listKemudahanBaik?.length > 0 ? (
              listKemudahanBaik?.map((a, i) => (
                <View>
                  <Text style={styles.desc}>
                    {`${i + 1})`}
                    {a}
                  </Text>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text>-</Text>
              </View>
            )}
          </View>
          <View>
            <Text style={styles.headerTable}>Kerosakan</Text>
            {listKemudahanRosak?.length > 0 ? (
              listKemudahanRosak?.map((a, i) => (
                <View>
                  <Text style={styles.desc}>
                    {`${i + 1})`}
                    {a}
                  </Text>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text>-</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.title2}>Remarks</Text>
        <Text style={styles.desc}>{routeData.remarks}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: headerSize,
    fontWeight: '600',
  },
  headerTable: {
    fontSize: title2Size,
    fontWeight: '600',
    textDecorationLine: 'underline',
    paddingBottom: 10,
  },
  title: { marginTop: 0, fontSize: titleSize, fontWeight: '600' },
  title2: {
    marginTop: 20,
    fontSize: title2Size,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  desc: {
    marginTop: 2,
    fontSize: fontSize,
  },
});
