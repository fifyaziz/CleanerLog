import { AntDesign, Entypo } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { dateAPIFormat, dateSlashFormat, dateTimeFormat, timeFormat } from '../config';
import Supabase from '../config/initSupabase';

const listBuilding = [
  { id: 1, label: 'Mall', value: 'mall' },
  { id: 2, label: 'Tower 1', value: 't1' },
  { id: 3, label: 'Tower 2', value: 't2' },
  { id: 4, label: 'Tower 3', value: 't3' },
];

export default function ReportWeeklyScreen({ navigation }) {
  const [lastFriday, setLastFriday] = useState();
  const [nextThursday, setNextThursday] = useState();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(0);
  const [pickerBuilding, setPickerBuilding] = useState('mall');

  const [listTop3, setListTop3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisibleFilter, setIsVisibleFilter] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const before = `${dateAPIFormat(lastFriday)}T00:00:00.000`;
    const after = `${dateAPIFormat(nextThursday)}T23:59:00.000`;

    try {
      const { data: dataFetch, error } =
        pickerBuilding === 'all'
          ? await Supabase.from('check_in_out')
              .select()
              .gte('check_in', before)
              .lte('check_out', after)
              .order('id', { ascending: false })
          : await Supabase.from('check_in_out')
              .select()
              .eq('building', pickerBuilding)
              .gte('check_in', before)
              .lte('check_out', after)
              .order('id', { ascending: false });

      setLoading(false);

      if (dataFetch) {
        setListTop3(dataFetch);
      }
    } catch (e) {
      console.error('erer', e);
    }
  }, [lastFriday, nextThursday, pickerBuilding]);

  const handleKongsi = useCallback(async () => {
    setLoading(true);
    const before = `${dateAPIFormat(lastFriday)}T00:00:00.000`;
    const after = `${dateAPIFormat(nextThursday)}T23:59:00.000`;

    var temp = listTop3;
    if (temp?.length === 0) {
      try {
        const { data: dataFetch, error } =
          pickerBuilding === 'all'
            ? await Supabase.from('check_in_out')
                .select()
                .gte('check_in', before)
                .lte('check_out', after)
                .order('id', { ascending: false })
            : await Supabase.from('check_in_out')
                .select()
                .eq('building', pickerBuilding)
                .gte('check_in', before)
                .lte('check_out', after)
                .order('id', { ascending: false });

        if (dataFetch) {
          temp = dataFetch;
        }
      } catch (e) {
        console.error('erer', e);
      }
    }

    if (temp.length > 0) {
      const html = `<html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <style>
              table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
              }
              td, th {
                border: 1px solid #dddddd;
                padding: 8px;
                font-size: 14px;
              }
              </style>
              <body>
              
              <h2><b><u> MTC Report - Detailed Clock Report </u></b></h2>
  
              <table>
              <tr>
                <th>No.</th>
                <th style="text-align: left;">Name</th>
                <th style="text-align: left;">ID</th>
                <th style="text-align: left;">Service Area</th>
                <th>Check-In</th>
                <th>Check-Out</th>
              </tr>
              ${temp
                ?.map(
                  (a, i) => `<tr>
              <td style="text-align: center;">${i + 1}</td>
              <td>${a.name}</td>
              <td>${a.id_staff}</td>
              <td> <span style="text-transform: capitalize;">${a.building} - </span>
              ${a.is_office ? 'Office' : a.is_surau ? 'Surau' : 'Toilet'} ${a.toilet_name} LEVEL ${
                    a.floor
                  } ${a.gender == 0 ? '' : a.gender === 1 ? '(L)' : '(P)'}
              </td>
              <td style="text-align: center;">${dateTimeFormat(a.check_in)}</td>
              <td style="text-align: center;">${dateTimeFormat(a.check_out)}</td>
              </tr>`
                )
                .join(' ')}
  
            </table>
  
              </body>
            </html>`;

      const { uri } = await Print.printToFileAsync({ html, base64: true });

      const pdfName = `${FileSystem.documentDirectory}Laporan_Mingguan.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: pdfName,
      });

      Sharing.shareAsync(pdfName, { UTI: '.pdf', mimeType: 'application/pdf' });
    }

    setLoading(false);
  }, [listTop3, pickerBuilding, lastFriday, nextThursday]);

  const handleConfirmDatePicker = useCallback(
    (date) => {
      setIsDatePickerVisible(0);

      const temp = `${dateAPIFormat(new Date(date))}${
        isDatePickerVisible === 1 ? 'T00:00:00.000' : 'T23:59:00.000'
      }`;
      if (isDatePickerVisible === 1) {
        setLastFriday(temp);
      } else if (isDatePickerVisible === 2) {
        setNextThursday(temp);
      }
    },
    [isDatePickerVisible]
  );

  useEffect(() => {
    const temp = new Date().getDate() + (6 - new Date().getDay() - 1) - 7;
    const valFri = new Date();
    valFri.setDate(temp);
    setLastFriday(`${dateAPIFormat(valFri)}T00:00:00.000`);

    const temp1 = new Date().getDate() + (6 - new Date().getDay() + 5) - 7;
    const valThurs = new Date();
    valThurs.setDate(temp1);
    setNextThursday(`${dateAPIFormat(valThurs)}T23:59:00.000`);

    setListTop3([]);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
          }}
          onPress={() => {
            handleKongsi();
          }}
        >
          <Entypo name="share" size={24} color="green" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, lastFriday, nextThursday, listTop3, pickerBuilding]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      {isVisibleFilter ? (
        <View
          style={{
            borderBottomWidth: 1,
            width: '100%',
            paddingHorizontal: 20,
            paddingVertical: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'aliceblue',
          }}
        >
          <Text style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
            {pickerBuilding}, {dateSlashFormat(lastFriday)} - {dateSlashFormat(nextThursday)}
          </Text>
          <TouchableOpacity onPress={() => setIsVisibleFilter(false)}>
            <AntDesign name="downcircleo" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={[
            {
              paddingTop: 20,
              width: '100%',
              paddingHorizontal: '10%',
              backgroundColor: 'aliceblue',
            },
          ]}
        >
          <Text>Bangunan</Text>
          <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 5, marginBottom: 20 }}>
            <Picker
              selectedValue={pickerBuilding}
              onValueChange={(itemValue, itemIndex) => setPickerBuilding(itemValue)}
              style={{ height: 150, padding: 0 }}
              itemStyle={{ height: 130, padding: 0 }}
            >
              <Picker.Item label="Semua Bangunan" value="all" />
              {listBuilding.map((a) => (
                <Picker.Item key={a.id} label={a.label} value={a.value} />
              ))}
            </Picker>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                marginHorizontal: 5,
              }}
            >
              <Text>Tarikh Mula</Text>
              <TouchableOpacity onPress={() => setIsDatePickerVisible(1)}>
                <Text style={[styles.textInput]}>
                  {lastFriday ? dateSlashFormat(lastFriday) : ''}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginHorizontal: 5,
              }}
            >
              <Text>Tarikh Akhir</Text>
              <TouchableOpacity onPress={() => setIsDatePickerVisible(2)}>
                <Text style={[styles.textInput]}>
                  {nextThursday ? dateSlashFormat(nextThursday) : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible > 0}
            mode="date"
            onConfirm={handleConfirmDatePicker}
            onCancel={() => setIsDatePickerVisible(0)}
            backdropStyleIOS={{ backgroundColor: 'grey' }}
            pickerStyleIOS={{ backgroundColor: 'grey' }}
          />

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
              marginBottom: listTop3?.length > 0 ? 10 : 30,
            }}
          >
            <TouchableOpacity style={styles.button} onPress={() => fetchData()}>
              <Text style={{ color: 'white', fontWeight: '600' }}>Jana Laporan</Text>
            </TouchableOpacity>
            {listTop3?.length > 0 && (
              <TouchableOpacity style={{ marginTop: 30 }} onPress={() => setIsVisibleFilter(true)}>
                <AntDesign name="upcircleo" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {listTop3?.length > 0 && (
        <View style={{ minWidth: '100%', borderWidth: 1, marginBottom: 10 }}></View>
      )}

      <ScrollView>
        <View style={{ minWidth: '100%' }}>
          {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
          {listTop3?.length > 0 &&
            listTop3?.map((a, i) => {
              const countObject = Object.keys(a).length - 7;

              const convert = Object.keys(a).map(function (key) {
                return a[key];
              });
              const count = convert.filter((a) => a === false)?.length;
              const final = (count / countObject) * 5;

              const payload = { ...a, photo_in: '', photo_out: '' };

              return (
                <View key={i} style={styles.boxContainer}>
                  <View style={{ paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditReport', payload)}>
                      <View style={{ flexDirection: 'row' }}>
                        <View>
                          <Text>{a.name}</Text>
                          <Text>
                            {a.is_office ? 'Pejabat' : a.is_surau ? 'Surau' : 'Tandas'}{' '}
                            {a.toilet_name} {a.gender == 0 ? '' : a.gender === 1 ? '(L)' : '(P)'} -{' '}
                            <Text style={{ textTransform: 'capitalize' }}>{a.building} </Text>
                            Tingkat <Text style={{ textTransform: 'uppercase' }}>{a.floor}</Text>
                          </Text>
                          <Text>{`${timeFormat(a.check_in)} - ${timeFormat(a.check_out)}`}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
  },
  button: {
    shadowColor: 'darkblue', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: 'deepskyblue',
    elevation: 5, // Android
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: 'center',
    overflow: 'hidden',
    minWidth: 75,
  },
  boxContainer: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
