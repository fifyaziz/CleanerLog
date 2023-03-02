import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { dateAPIFormat, dateFormat, dateTimeFormat } from '../config';
import Supabase from '../config/initSupabase';

export default function ReportWeeklyScreen() {
  const [lastFriday, setLastFriday] = useState();
  const [nextThursday, setNextThursday] = useState();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(0);
  const [pickerBuilding, setPickerBuilding] = useState('mall');

  const handleKongsi = useCallback(async () => {
    const before = `${dateAPIFormat(lastFriday)} 00:00`;
    const after = `${dateAPIFormat(nextThursday)} 23:59`;
    console.log(`${before} - ${after}`);

    const { data: dataFetch } =
      pickerBuilding === 'all'
        ? await Supabase.from('check_in_out')
            .select()
            .gte('check_in', before)
            .lte('check_out', after)
        : await Supabase.from('check_in_out')
            .select()
            .eq('building', pickerBuilding)
            .gte('check_in', before)
            .lte('check_out', after);

    const html =
      dataFetch &&
      `<html>
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
            ${dataFetch
              ?.map(
                (a, i) => `<tr>
            <td style="text-align: center;">${i + 1}</td>
            <td>${a.name}</td>
            <td>${a.id_staff}</td>
            <td>
            ${a.toilet_name} LEVEL ${a.floor} ${a.gender === 1 ? '(L)' : '(P)'}
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
  }, [pickerBuilding, lastFriday, nextThursday]);

  const handleConfirmDatePicker = useCallback(
    (date) => {
      setIsDatePickerVisible(0);
      if (isDatePickerVisible === 1) {
        setLastFriday(date);
      } else if (isDatePickerVisible === 2) {
        setNextThursday(date);
      }
    },
    [isDatePickerVisible]
  );

  useEffect(() => {
    const temp = new Date().getDate() + (6 - new Date().getDay() - 1) - 7;
    const valFri = new Date();
    valFri.setDate(temp);
    setLastFriday(valFri);

    const temp1 = new Date().getDate() + (6 - new Date().getDay() + 5) - 7;
    const valThurs = new Date();
    valThurs.setDate(temp1);
    setNextThursday(valThurs);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: 'white' }}>
        <Text>Bangunan</Text>
        <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 5, marginBottom: 20 }}>
          <Picker
            selectedValue={pickerBuilding}
            onValueChange={(itemValue, itemIndex) => setPickerBuilding(itemValue)}
          >
            <Picker.Item label="Semua Bangunan" value="all" />
            <Picker.Item label="Mall" value="mall" />
            <Picker.Item label="Tower 1" value="t1" />
            <Picker.Item label="Tower 2" value="t2" />
            <Picker.Item label="Tower 3" value="t3" />
          </Picker>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              marginHorizontal: 5,
            }}
          >
            <Text>Tarikh Mula</Text>
            <TouchableOpacity onPress={() => setIsDatePickerVisible(1)}>
              <Text style={[styles.textInput]}>{lastFriday ? dateFormat(lastFriday) : ''}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginHorizontal: 5,
            }}
          >
            <Text>Tarikh Akhir</Text>
            <TouchableOpacity onPress={() => setIsDatePickerVisible(2)}>
              <Text style={[styles.textInput]}>{nextThursday ? dateFormat(nextThursday) : ''}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible > 0}
          mode="date"
          onConfirm={handleConfirmDatePicker}
          onCancel={() => setIsDatePickerVisible(0)}
        />

        <View style={{ justifyContent: 'center', alignItems: 'center', margin: 30 }}>
          <TouchableOpacity style={styles.button} onPress={() => handleKongsi()}>
            <Text style={{ color: 'white', fontWeight: '600' }}>Jana PDF Mingguan</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});
