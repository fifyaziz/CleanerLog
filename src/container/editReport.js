import { Picker } from '@react-native-picker/picker';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { dateFormat, dateTimeAPIFormat, timeFormat } from '../config';
import Supabase from '../config/initSupabase';

export default function EditReportScreen({ route = {}, navigation }) {
  const routeData =
    route && typeof route?.params === 'string' ? JSON.parse(route?.params) : route?.params;

  const [inputId, setInputID] = useState();
  const [pickerStaff, setPickerStaff] = useState(routeData?.name);
  const [listPickerStaff, setListPickerStaff] = useState([]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(0);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(0);
  const [dateIn, setDateIn] = useState(routeData?.check_in);
  const [dateOut, setDateOut] = useState(routeData?.check_out);
  const [timeIn, setTimeIn] = useState();
  const [timeOut, setTimeOut] = useState();

  const handleConfirmDatePicker = useCallback(
    (date) => {
      setIsDatePickerVisible(0);

      const temp = dateTimeAPIFormat(new Date(date));
      if (isDatePickerVisible === 1) {
        setDateIn(temp);
      } else if (isDatePickerVisible === 2) {
        setDateOut(temp);
      }
    },
    [isDatePickerVisible]
  );

  const handleConfirmTimePicker = useCallback(
    (date) => {
      setIsTimePickerVisible(0);

      const temp = dateTimeAPIFormat(new Date(date));
      if (isTimePickerVisible === 1) {
        setTimeIn(temp);
      } else if (isTimePickerVisible === 2) {
        setTimeOut(temp);
      }
    },
    [isTimePickerVisible]
  );

  const handleSave = async () => {
    const dIn = dateIn.split('T');
    const tIn = timeIn.split('T');
    const dOut = dateOut.split('T');
    const tOut = timeOut.split('T');

    const payload = {
      id_staff: `${inputId}`,
      name: pickerStaff,
      check_in: `${dIn[0]}T${tIn[1]}`,
      check_out: `${dOut[0]}T${tOut[1]}`,
    };

    const { status, error } = await Supabase.from('check_in_out')
      .update(payload)
      .eq('id', routeData.id);
    if (status === 204) {
      navigation.pop();
    }
    if (error) {
      console.error('error', error);
    }
  };

  useEffect(() => {
    setTimeIn(routeData.check_in);
    setTimeOut(routeData.check_out);
    try {
      (async () => {
        const { data: dataFetch, error: errorFetch } = await Supabase.from('staff').select();
        if (dataFetch?.length > 0) {
          setListPickerStaff(dataFetch);
          dataFetch.map(
            (a) => a.staff_name === routeData.name && setInputID(a.staff_id)
          );
        }
      })();
    } catch (e) {
      console.error('euengd', e);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <View style={[styles.container, { padding: 30 }]}>
          {routeData && (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>
                {`${routeData.is_surau ? 'Surau' : 'Tandas'} ${routeData?.name}${
                  routeData?.gender == 1 ? ' (L)' : ' (P)'
                }`}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>
                <Text style={{ textTransform: 'capitalize' }}>{routeData?.building}</Text> Tingkat{' '}
                {routeData?.floor}
              </Text>
              <View style={{ width: 50, height: 10, borderBottomWidth: 1 }}></View>
            </View>
          )}
          <View style={styles.container}>
            <View style={{ paddingTop: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                }}
              >
                Nama Pekerja
              </Text>
              <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 10, marginBottom: 20 }}>
                <Picker
                  selectedValue={pickerStaff}
                  onValueChange={(itemValue, itemIndex) => {
                    listPickerStaff.map(
                      (a) => a.staff_name === itemValue && setInputID(a.staff_id)
                    );
                    setPickerStaff(itemValue);
                  }}
                >
                  <Picker.Item label="Pilih Nama" value="" />
                  {listPickerStaff?.map((a, i) => (
                    <Picker.Item
                      key={i}
                      label={a.staff_id+ ' - ' + a.staff_name}
                      value={a.staff_name}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  marginHorizontal: 5,
                }}
              >
                <Text>Tarikh Mula</Text>
                <TouchableOpacity onPress={() => setIsDatePickerVisible(1)}>
                  <Text style={[styles.textInput]}>{dateIn ? dateFormat(dateIn) : ''}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginHorizontal: 5,
                }}
              >
                <Text>Masa Mula</Text>
                <TouchableOpacity onPress={() => setIsTimePickerVisible(1)}>
                  <Text style={[styles.textInput]}>{timeIn ? timeFormat(timeIn) : ''}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View
                style={{
                  marginHorizontal: 5,
                }}
              >
                <Text>Tarikh Keluar</Text>
                <TouchableOpacity onPress={() => setIsDatePickerVisible(2)}>
                  <Text style={[styles.textInput]}>{dateOut ? dateFormat(dateOut) : ''}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginHorizontal: 5,
                }}
              >
                <Text>Masa Keluar</Text>
                <TouchableOpacity onPress={() => setIsTimePickerVisible(2)}>
                  <Text style={[styles.textInput]}>{timeOut ? timeFormat(timeOut) : ''}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: 30 }}>
              <TouchableOpacity
                disabled={!pickerStaff}
                style={{
                  backgroundColor: !pickerStaff ? 'lightgrey' : 'deepskyblue',
                  borderRadius: 10,
                  paddingVertical: 15,
                  marginVertical: 20,
                }}
                onPress={() => handleSave()}
              >
                <Text
                  style={{
                    color: !pickerStaff ? 'grey' : '#fff',
                    fontWeight: '500',
                    textAlign: 'center',
                  }}
                >
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>

            <DateTimePickerModal
              isVisible={isDatePickerVisible > 0}
              mode="date"
              onConfirm={handleConfirmDatePicker}
              onCancel={() => setIsDatePickerVisible(0)}
              backdropStyleIOS={{ backgroundColor: 'grey' }}
              pickerStyleIOS={{ backgroundColor: 'grey' }}
            />
            <DateTimePickerModal
              isVisible={isTimePickerVisible > 0}
              mode="time"
              onConfirm={handleConfirmTimePicker}
              onCancel={() => setIsTimePickerVisible(0)}
              backdropStyleIOS={{ backgroundColor: 'grey' }}
              pickerStyleIOS={{ backgroundColor: 'grey' }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
