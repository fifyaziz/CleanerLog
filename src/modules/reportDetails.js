import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import { dateTimeFormat } from '../config';
import Supabase from '../config/initSupabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 6) / 100);
const titleSize = parseInt((windowWidth * 5) / 100);
const title2Size = parseInt((windowWidth * 4) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

export default function ReportDetailScreen({ route, navigation }) {
  const routeData = route?.params;

  const [loading, setLoading] = useState(true);
  const [listKemudahanBaik, setListKemudahanBaik] = useState();
  const [listKemudahanRosak, setListKemudahanRosak] = useState();

  const [approval, setApproval] = useState();

  const handleSubmit = useCallback(async () => {
    if (approval) {
      const { status, error } = await Supabase.from('entry')
        .update({ approval_remarks: approval, approved: true })
        .eq('id', routeData.id);
      console.error(error);
      if (status === 204) {
        setApproval();
        ToastAndroid.show('Borang telah berjaya dihantar.', ToastAndroid.BOTTOM);
        navigation.navigate('Dashboard');
      }
    } else {
      Alert.alert('Sila isi pengesahan');
    }
  }, [approval]);

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
        <Text style={styles.header}>
          Maklumat {routeData.is_surau ? 'Surau' : routeData.is_office ? 'Pejabat' : 'Tandas'}
          {routeData?.gender == '1' ? ' (L)' : routeData?.gender == '0' ? '' : ' (P)'}
        </Text>
        <Text style={styles.header}>
          {routeData?.toilet_name} {routeData?.building}
        </Text>
        {routeData?.floor && <Text style={styles.title}>Tingkat {routeData?.floor}</Text>}

        {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              minWidth: '40%',
              paddingHorizontal: 15,
              alignItems: routeData.activeTab === 1 ? 'flex-start' : 'center',
            }}
          >
            <Text style={styles.title2}>Tarikh & Masa{'\n'}Dicuci</Text>
            <Text style={styles.desc}>{dateTimeFormat(routeData.datetime_created)}</Text>
          </View>
          {routeData.activeTab === 1 && (
            <View>
              <Text style={styles.title2}>Tarikh & Masa{'\n'}Pengesahan</Text>
              <Text style={styles.desc}>{dateTimeFormat(routeData.datetime_approval)}</Text>
            </View>
          )}
        </View> */}

        <Text style={styles.title2}>Dicuci Oleh</Text>
        <Text style={styles.desc}>{routeData.name}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              minWidth: '40%',
              paddingHorizontal: 15,
              alignItems: routeData.activeTab === 1 ? 'flex-start' : 'center',
            }}
          >
            <Text style={styles.title2}>Tarikh & Masa{'\n'}Log Masuk</Text>
            <Text style={styles.desc}>{dateTimeFormat(routeData.check_in)}</Text>
          </View>
        </View>

        {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
        {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={{ minWidth: '45%', paddingHorizontal: 15 }}>
            <Text style={styles.headerTable}>Bersin/Baik</Text>
            {listKemudahanBaik?.length > 0 ? (
              listKemudahanBaik?.map((a, i) => (
                <View key={i} style={{ alignItems: 'flex-start' }}>
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
                <View key={i} style={{ alignItems: 'flex-start' }}>
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
        </View> */}

        {/* <Text style={styles.title2}>Komen</Text>
        <Text style={styles.desc}>{routeData.remarks}</Text> */}

        {routeData.photo_in ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${routeData.photo_in}` }}
            style={{ height: 200, width: 250 }}
          />
        ) : (
          <Text
            style={{
              color: 'grey',
              marginTop: 10,
              paddingHorizontal: 30,
              paddingVertical: 20,
              borderWidth: 1,
              borderColor: 'lightgrey',
              borderRadius: 10,
            }}
          >
            - Tiada Gambar -{' '}
          </Text>
        )}

        <View>
          <Text style={styles.title2}>Tarikh &amp; Masa{'\n'}Mencuci</Text>
          <Text style={styles.desc}>{dateTimeFormat(routeData.check_out)}</Text>
        </View>
        {routeData.photo_out ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${routeData.photo_out}` }}
            style={{ height: 200, width: 250 }}
          />
        ) : (
          <Text
            style={{
              color: 'grey',
              marginTop: 10,
              paddingHorizontal: 30,
              paddingVertical: 20,
              borderWidth: 1,
              borderColor: 'lightgrey',
              borderRadius: 10,
            }}
          >
            - Tiada Gambar -{' '}
          </Text>
        )}

        {routeData.activeTab === 0 && (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title2}>Pengesahan</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Pengesahan"
              value={approval}
              onChangeText={setApproval}
              multiline
            />

            <Button title="Hantar" onPress={handleSubmit} />
          </View>
        )}

        {routeData.activeTab === 1 && (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title2}>Pengesahan</Text>
            <Text style={styles.desc}>{routeData.approval_remarks}</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: windowHeight,
  },
  header: {
    fontSize: headerSize,
    fontWeight: '600',
    textTransform: 'capitalize',
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
    textAlign: 'center',
  },
  desc: {
    marginTop: 2,
    fontSize: fontSize,
    textAlign: 'center',
    alignItems: 'flex-start',
  },
  textInput: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    width: windowWidth - 50,
    minHeight: 60,
  },
});
