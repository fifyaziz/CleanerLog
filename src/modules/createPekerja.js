import { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Supabase from '../config/initSupabase';

export default function CreatePekerjaScreen({ route, navigation }) {
  const routeData = route?.params;
  const [idPekerja, setIdPekerja] = useState(routeData?.staff_id);
  const [namaPekerja, setNamaPekerja] = useState(routeData?.staff_name);

  const handleSubmit = useCallback(async () => {
    if (routeData?.type === 'edit') {
      const { status, error } = await Supabase.from('staff')
        .update({
          staff_id: idPekerja,
          staff_name: namaPekerja,
        })
        .eq('id', routeData.id);
      if (status === 204) {
        ToastAndroid.show('Maklumat pekerja berjaya dikemaskini.!', ToastAndroid.BOTTOM);
        navigation.pop();
      }
      if (error) {
        console.error('error', error);
      }
    } else {
      const { data: dataFetch, error: errorFetch } = await Supabase.from('staff')
        .select('staff_id, staff_name')
        .eq('staff_id', idPekerja)
        .eq('staff_name', namaPekerja);

      if (dataFetch?.length > 0) {
        ToastAndroid.show('Maklumat pekerja ini telah wujud.!', ToastAndroid.TOP);
      } else if (dataFetch?.length === 0) {
        const { status, error } = await Supabase.from('staff').insert({
          staff_id: idPekerja,
          staff_name: namaPekerja,
        });
        if (status === 201) {
          ToastAndroid.show('Maklumat pekerja berjaya disimpan.!', ToastAndroid.BOTTOM);
          navigation.pop();
        }
        if (error) {
          console.error('error', error);
        }
      }

      if (errorFetch) {
        console.error('errorFetch', errorFetch);
      }
    }
  }, [idPekerja, namaPekerja]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
      <Text>ID Pekerja</Text>

      <TextInput
        placeholder="ID Pekerja"
        style={{
          padding: 10,
          borderRadius: 10,
          borderWidth: 1,
          marginTop: 10,
          marginBottom: 20,
        }}
        value={idPekerja}
        onChangeText={(e) => {
          setIdPekerja(e);
        }}
      />

      <Text>Nama Pekerja</Text>

      <TextInput
        placeholder="Nama Pekerja"
        style={{
          padding: 10,
          borderRadius: 10,
          borderWidth: 1,
          marginTop: 10,
          marginBottom: 20,
        }}
        value={namaPekerja}
        onChangeText={(e) => {
          setNamaPekerja(e);
        }}
      />

      {routeData?.type === 'edit' ? (
        <TouchableOpacity
          style={[styles.customButtton, { marginVertical: 20 }]}
          onPress={handleSubmit}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Kemaskini</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.customButtton, { marginVertical: 20 }]}
          onPress={handleSubmit}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Simpan</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  customButtton: {
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
});
