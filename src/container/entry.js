import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('window').width;
const minTitleBox = parseInt((windowWidth * 40) / 100);
const maxTitleBox = parseInt((windowWidth * 42) / 100);
const headerSize = parseInt((windowWidth * 6) / 100);
const titleSize = parseInt((windowWidth * 5) / 100);
const title2Size = parseInt((windowWidth * 4) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

const RadioButton = ({ type, value }) => {
  return (
    <View
      key={type}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 30,
      }}
    >
      <View
        style={[
          {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#000',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        {value === type ? (
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#000',
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

const convertText = (value) => {
  const final = value.replace(/ /g, '_');
  return final;
};

export default function EntryScreen({ route, navigation }) {
  const [remarks, setRemarks] = useState();
  const [listKemudahan, setListKemudahan] = useState();
  const [loading, setLoading] = useState(true);
  const routeData = route?.params;

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const [today, setToday] = useState(
    `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} ${
      hours < 10 ? '0' + hours : hours
    }:${minutes < 10 ? '0' + minutes : minutes}`
  );
  const [currentDate, setCurrentDate] = useState(date);

  const handleSubmit = async () => {
    const { status, statusText, data, error } = await Supabase.from('entry').insert({
      name: routeData.name,
      floor: routeData?.data?.floor,
      gender: routeData?.data?.gender,
      remarks: remarks,
      datetime_created: currentDate,
      lantai: listKemudahan.find((o) => o.name === 'lantai')?.value,
      dinding: listKemudahan.find((o) => o.name === 'dinding')?.value,
      siling: listKemudahan.find((o) => o.name === 'siling')?.value,
      bau: listKemudahan.find((o) => o.name === 'bau')?.value,
      cermin: listKemudahan.find((o) => o.name === 'cermin')?.value,
      singki: listKemudahan.find((o) => o.name === 'singki')?.value,
      tap_air: listKemudahan.find((o) => o.name === 'tap air')?.value,
      tong_sampah: listKemudahan.find((o) => o.name === 'tong sampah')?.value,
      mangkuk_tandas: listKemudahan.find((o) => o.name === 'mangkuk tandas')?.value,
      sabun: listKemudahan.find((o) => o.name === 'sabun')?.value,
    });
    if (status === 201) {
      console.log('success');
      ToastAndroid.show('Borang telah berjaya dihantar.', ToastAndroid.BOTTOM);
      navigation.navigate('TabNav');
    }
  };

  const handleRadioButton = async (value, type) => {
    console.log(value);
    console.log(type);
    const final = listKemudahan.map((a, i) => {
      if (i === value) {
        return { ...a, value: type };
      } else {
        return a;
      }
    });
    setListKemudahan(final);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataFetch } = await Supabase.from('kemudahan').select();

      const final = dataFetch?.map((a, i) => ({ ...a, value: 2 }));
      setListKemudahan(final);
      setLoading(false)
    };

    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Maklumat Tingkat {routeData?.data?.floor}</Text>
        <Text style={styles.title}>
          Bilik {routeData?.data?.gender === '1' ? 'Lelaki' : 'Perempuan'}
        </Text>
        <Text style={styles.title2}>Tarikh & Masa</Text>
        <Text style={styles.desc}>{today}</Text>

        {loading && <ActivityIndicator style={{marginTop: 40}} color={"black"} size={50}/>}
        <View style={{ marginTop: 10 }}>
          <View style={{ borderBottomWidth: 1,  marginTop: 10  }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    minWidth: minTitleBox,
                    maxWidth: maxTitleBox,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <Text style={{ textAlign: 'center', fontWeight: '700' }}>Kemudahan</Text>
                </View>
                <View style={{ maxWidth: 70, minWidth: 70, paddingHorizontal:10 }}>
                <Text>Bersih</Text>
                <Text>/Baik</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>Kerosakan</Text>
                </View>
              </View>
            </View>
          {listKemudahan?.map((a, i) => (
            <View key={i} style={{ borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    minWidth: minTitleBox,
                    maxWidth: maxTitleBox,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <Text>{a.name}</Text>
                </View>
                <View style={{ maxWidth: 70, minWidth: 70, paddingHorizontal:10 }}>
                  <TouchableOpacity onPress={() => handleRadioButton(i, 0)}>
                    <RadioButton type={0} value={a.value} />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity onPress={() => handleRadioButton(i, 1)}>
                    <RadioButton type={1} value={a.value} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TextInput
          placeholder="Remarks"
          style={styles.input}
          onChangeText={setRemarks}
          value={remarks}
          multiline
        />

        <TouchableOpacity style={styles.newButton} onPress={handleSubmit}>
          <Text style={[styles.sectionDescription, { color: '#fff', fontWeight: '900' }]}>
            Hantar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  input: {
    minWidth: '80%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 35,
  },
  header: {
    fontSize: headerSize,
    fontWeight: '600',
  },
  title: { marginTop: 0, fontSize: titleSize, fontWeight: '600' },
  title2: {
    marginTop: 30,
    fontSize: title2Size,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  desc: {
    marginTop: 2,
    fontSize: fontSize,
  },
  sectionDescription: {
    fontSize: fontSize,
    fontWeight: '400',
  },
  newButton: {
    marginTop: 20,
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 20,
  },
});
