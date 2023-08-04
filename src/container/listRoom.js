import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../config/AuthContext';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('window').width;

const Tab = createMaterialTopTabNavigator();

const Item = ({ data, label }) => (
  <View
    style={{
      backgroundColor: data.gender === 1 ? 'lightblue' : data.gender === 0 ? 'white' : 'pink',
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 15,
      marginVertical: 5,
    }}
  >
    <View style={{ flex: 4, flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
      {data.gender === 0 ? (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Ionicons name="man-sharp" size={20} color="blue" />
          <Ionicons name="woman-sharp" size={18} color="deeppink" />
        </View>
      ) : data.gender === 1 ? (
        <Ionicons name="man-sharp" size={20} color="blue" />
      ) : (
        <Ionicons name="woman-sharp" size={18} color="deeppink" />
      )}
      <Text style={{ fontWeight: '500', flexShrink: 1 }}>
        {label} {data.name}
        {data.gender === 1 ? ' (L)' : data.gender === 0 ? '' : ' (P)'}
      </Text>
      <Text> - </Text>
      <Text style={{ textTransform: 'capitalize', fontWeight: '500' }}>{data.building}</Text>
      <Text
        style={{ fontWeight: '500', flexWrap: 'wrap', flexShrink: 1 }}
      >{` Tingkat ${data.floor}`}</Text>
    </View>
  </View>
);

function TabScreen({ route, navigation }) {
  const isFocused = useIsFocused();

  const [list, setList] = useState();
  const [listDropdownBuilding, setListDropdownBuilding] = useState([]);
  const [listDropdownFloor, setListDropdownFloor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectMale, setSelectMale] = useState(true);
  const [selectFemale, setSelectFemale] = useState(true);
  const [titlePickerBuilding, setTitlePickerBuilding] = useState('');
  const [pickerBuilding, setPickerBuilding] = useState();
  const [modalBuildingVisible, setModalBuildingVisible] = useState(false);
  const [titlePickerFloor, setTitlePickerFloor] = useState('');
  const [pickerFloor, setPickerFloor] = useState();
  const [modalFloorVisible, setModalFloorVisible] = useState(false);

  const { fixtureMode } = useContext(AuthContext);

  const handleSelect = (item) => {
    navigation.navigate('CheckInOut', JSON.stringify(item));
  };

  const handleApplyBuilding = useCallback(() => {
    setTitlePickerBuilding(pickerBuilding);
    setModalBuildingVisible(!modalBuildingVisible);
  }, [pickerBuilding, modalBuildingVisible]);

  const handleApplyFloor = useCallback(() => {
    setTitlePickerFloor(pickerFloor);
    setModalFloorVisible(!modalFloorVisible);
  }, [pickerFloor, modalFloorVisible]);

  useEffect(() => {
    const fetchData = async () => {
      let data = {};
      const storageData = await AsyncStorage.getItem('@store_data');
      if (fixtureMode) {
        data = require('../constants/room.json');
      } else {
        let query = Supabase.from('service_area').select();

        if (titlePickerBuilding) {
          query = query.eq('building', titlePickerBuilding.toLowerCase());
        }
        if (titlePickerFloor) {
          query = query.eq('floor', titlePickerFloor.toUpperCase());
        }
        if (selectMale && selectFemale) {
          query = query.gte('gender', 0);
        } else if (selectMale) {
          query = query.eq('gender', 1);
        } else if (selectFemale) {
          query = query.eq('gender', 2);
        } else {
          query = query.lt('gender', 0);
        }

        query = query.order('order', { ascending: true });

        const { data: dataFetch, error } = await query;

        // const { data: dataFetch } = await Supabase.from('service_area')
        //   .select()
        //   .or((selectMale && selectFemale) ?'gender.gte.0': selectMale? 'gender.eq.1': selectFemale? 'gender.eq.2':"gender.lt.0")
        //   .order('order', { ascending: true });

        const filterFloor = [...new Set(dataFetch?.map((a) => a.floor?.toUpperCase()))];
        const filterBuilding = [
          ...new Set(
            dataFetch?.map((a) => a.building?.charAt(0).toUpperCase() + a.building.slice(1))
          ),
        ];
        const filterSurau = dataFetch?.filter((a) => a.is_surau);
        const filterTandas = dataFetch?.filter((a) => !a.is_surau && !a.is_office);
        const filterOffice = dataFetch?.filter((a) => a.is_office);

        data = {
          tandas: filterTandas,
          surau: filterSurau,
          office: filterOffice,
          building: filterBuilding,
          floor: filterFloor,
        };
      }

      setLoading(false);
      if (storageData) {
        const temp = JSON.parse(storageData);
        const final = data?.tandas?.filter(
          (a) =>
            a.name === temp.name &&
            a.building === temp.building &&
            a.floor === temp.floor &&
            a.gender === temp.gender
        );
        const finalSurau = data?.surau?.filter(
          (a) =>
            a.name === temp.name &&
            a.building === temp.building &&
            a.floor === temp.floor &&
            a.gender === temp.gender
        );
        const finalOffice = data?.office?.filter(
          (a) =>
            a.name === temp.name &&
            a.building === temp.building &&
            a.floor === temp.floor &&
            a.gender === temp.gender
        );
        setList({
          tandas: final,
          surau: finalSurau,
          office: finalOffice,
          building: data?.building,
          floor: data?.floor,
        });
      } else {
        setList(data);
      }

      if (titlePickerBuilding == '' && titlePickerFloor == '') {
        setListDropdownBuilding(data?.building);
        setListDropdownFloor(data?.floor);
      }
    };

    if (isFocused) {
      fetchData().catch(console.error);
    }
  }, [isFocused, selectMale, selectFemale, titlePickerBuilding, titlePickerFloor]);

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{ padding: 20 }}>
        {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginHorizontal: 3,
              borderColor: selectMale ? 'blue' : 'lightblue',
              backgroundColor: selectMale ? 'lightblue' : 'white',
            }}
            onPress={() => setSelectMale(!selectMale)}
          >
            <Ionicons name="man-sharp" size={20} color={selectMale ? 'blue' : 'blue'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginHorizontal: 3,
              borderColor: selectFemale ? 'deeppink' : 'pink',
              backgroundColor: selectFemale ? 'pink' : 'white',
            }}
            onPress={() => setSelectFemale(!selectFemale)}
          >
            <Ionicons name="woman-sharp" size={18} color={selectFemale ? 'deeppink' : 'deeppink'} />
          </TouchableOpacity>
          {route.name === 'Tandas' ? (
            Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={{
                  marginHorizontal: 8,
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: '#254252',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: titlePickerBuilding ? '#254252' : 'white',
                }}
                onPress={() => setModalBuildingVisible(!modalBuildingVisible)}
              >
                <Text
                  style={{ color: titlePickerBuilding ? 'white' : '#254252', fontWeight: '700' }}
                >
                  {titlePickerBuilding || 'Bangunan'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ borderWidth: 1, borderRadius: 10, width: 150 }}>
                <Picker
                  mode="dialog"
                  selectedValue={titlePickerBuilding}
                  onValueChange={(itemValue, itemIndex) => {
                    setTitlePickerBuilding(itemValue);
                  }}
                  size="small"
                >
                  <Picker.Item label="Bangunan" value="" />
                  {listDropdownBuilding?.map((a, i) => (
                    <Picker.Item key={i} label={a} value={a} />
                  ))}
                </Picker>
              </View>
            )
          ) : null}
          {route.name === 'Tandas' ? (
            Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={{
                  marginHorizontal: 3,
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: '#254252',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: titlePickerFloor ? '#254252' : 'white',
                }}
                onPress={() => setModalFloorVisible(true)}
              >
                <Text style={{ color: titlePickerFloor ? 'white' : '#254252', fontWeight: '700' }}>
                  {titlePickerFloor || 'Tingkat'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ borderWidth: 1, borderRadius: 10, width: 150 }}>
                <Picker
                  mode="dropdown"
                  selectedValue={titlePickerFloor}
                  onValueChange={(itemValue, itemIndex) => {
                    setTitlePickerFloor(itemValue);
                  }}
                >
                  <Picker.Item label="Tingkat" value="" />
                  {listDropdownFloor?.map((a, i) => (
                    <Picker.Item key={i} label={a} value={a} />
                  ))}
                </Picker>
              </View>
            )
          ) : null}
        </View>
        {route.name === 'Surau' && list?.surau?.length > 0 && (
          <View>
            <FlatList
              data={list?.surau}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Item data={item} label="Surau" />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
        {route.name === 'Tandas' && list?.tandas?.length > 0 && (
          <View>
            <FlatList
              data={list?.tandas}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Item data={item} label="Tandas" />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
        {route.name === 'Pejabat' && list?.office?.length > 0 && (
          <View>
            <FlatList
              data={list?.office}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Item data={item} label="Pejabat" />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalBuildingVisible}
          onRequestClose={() => {
            setModalBuildingVisible(!modalBuildingVisible);
            setPickerBuilding(titlePickerBuilding);
          }}
        >
          <View style={{ backgroundColor: 'transparent', flex: 1 }}>
            <TouchableOpacity
              style={{ backgroundColor: 'transparent', flex: 2 }}
              onPress={() => {
                setModalBuildingVisible(!modalBuildingVisible);
                setPickerBuilding(titlePickerBuilding);
              }}
            ></TouchableOpacity>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Picker
                  selectedValue={pickerBuilding}
                  style={{ width: windowWidth }}
                  onValueChange={(itemValue, itemIndex) => {
                    setPickerBuilding(itemValue);
                  }}
                >
                  <Picker.Item label="Bangunan" value="" />
                  {listDropdownBuilding?.map((a, i) => (
                    <Picker.Item key={i} label={a} value={a} />
                  ))}
                </Picker>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => handleApplyBuilding()}
                >
                  <Text style={styles.textStyle}>Pilih</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalFloorVisible}
          onRequestClose={() => {
            setModalFloorVisible(!modalFloorVisible);
            setPickerFloor(titlePickerFloor);
          }}
        >
          <View style={{ backgroundColor: 'transparent', flex: 1 }}>
            <TouchableOpacity
              style={{ backgroundColor: 'transparent', flex: 2 }}
              onPress={() => {
                setModalFloorVisible(!modalFloorVisible);
                setPickerFloor(titlePickerFloor);
              }}
            ></TouchableOpacity>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Picker
                  selectedValue={pickerFloor}
                  style={{ width: windowWidth }}
                  onValueChange={(itemValue, itemIndex) => {
                    setPickerFloor(itemValue);
                  }}
                >
                  <Picker.Item label="Tingkat" value="" />
                  {listDropdownFloor?.map((a, i) => (
                    <Picker.Item key={i} label={a} value={a} />
                  ))}
                </Picker>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => handleApplyFloor()}
                >
                  <Text style={styles.textStyle}>Pilih</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

export default function ListRoomScreen() {
  const isFocused = useIsFocused();

  const [roomType, setRoomType] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const storageData = await AsyncStorage.getItem('@store_data');
      const data = JSON.parse(storageData);
      setRoomType(!data ? 0 : data?.is_surau ? 2 : data?.is_office ? 3 : 1);
    };

    if (isFocused) {
      fetchData().catch(console.error);
    }
  }, [isFocused]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e37239',
        tabBarInactiveTintColor: 'lightgrey',
        tabBarIndicatorStyle: {
          backgroundColor: '#e37239',
        },
        tabBarStyle: {
          // height: 55,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 14,
          margin: 0,
        },
      }}
    >
      {(roomType === 1 || roomType === 0) && <Tab.Screen name="Tandas" component={TabScreen} />}
      {(roomType === 2 || roomType === 0) && <Tab.Screen name="Surau" component={TabScreen} />}
      {(roomType === 3 || roomType === 0) && <Tab.Screen name="Pejabat" component={TabScreen} />}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    width: windowWidth,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'lightgrey',
    paddingTop: 5,
    paddingBottom: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#254252',
    paddingHorizontal: 35,
    paddingVertical: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#254252',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
