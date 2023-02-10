import { StyleSheet, Text, View } from 'react-native';

import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { setupURLPolyfill } from 'react-native-url-polyfill';

if (Platform.OS !== 'web') {
  setupURLPolyfill();
}
const supabase = createClient(
  'https://uvgdkqwsibvgccljipaf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2Z2RrcXdzaWJ2Z2NjbGppcGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MTQ5ODAsImV4cCI6MTk5MTE5MDk4MH0.1ebImfXhDwZwUQRn2ZavBwuaB2Y4lakQstrxETNj8M4'
);

export default function LoginScreen() {
  // useEffect(()=>{
  //   const getLogin = async () => {
  //     const {data,error} = await supabase
  //     .from("profile").select();
  //     if(data){
  //       console.log('data', data)
  //     }
  //     if(error){
  //       console.log('error', error)
  //     }
  //   }
  //   getLogin()
  // },[])

  return (
    <View>
      <Text>Login</Text>
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
