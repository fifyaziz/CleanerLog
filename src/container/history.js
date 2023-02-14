import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Supabase from '../config/initSupabase';

export default function HistoryScreen() {
  const [list, setList] = useState();

  const getDate = (item) => {
    const date = new Date(item);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const getList = async () => {
      const { data, error } = await Supabase.from('entry').select();
      if (data) {
        setList(data);
      }
      if (error) {
        console.error('error', error);
      }
    };
    getList();
  }, []);

  return (
    <View>
      {list?.map((a) => (
        <View style={{ padding: 2, borderWidth: 1, borderRadius: 5 }}>
          <Text>{getDate(a.datetime_created)}</Text>
          <Text>{a.remarks}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
