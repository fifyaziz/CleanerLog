import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { dateAPIFormat, dayDateFormat, timeFormat } from '../config';
import AuthContext from '../config/AuthContext';
import Supabase from '../config/initSupabase';

const windowHeight = Dimensions.get('window').height - 189;
const windowWidth = Dimensions.get('window').width;
const minTitleBox = parseInt((windowWidth * 50) / 100);

export default function ReportDailyScreen({ navigation }) {
  const [listTop3, setListTop3] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState(false);

  const [listDropdownBuilding, setListDropdownBuilding] = useState([]);
  const [listDropdownFloor, setListDropdownFloor] = useState([]);
  const [modalFilter, setModalFilter] = useState(false);
  const [selectMale, setSelectMale] = useState(true);
  const [selectFemale, setSelectFemale] = useState(true);
  const [titlePickerBuilding, setTitlePickerBuilding] = useState('');
  const [pickerBuilding, setPickerBuilding] = useState();
  const [modalBuildingVisible, setModalBuildingVisible] = useState(false);
  const [titlePickerFloor, setTitlePickerFloor] = useState('');
  const [pickerFloor, setPickerFloor] = useState();
  const [modalFloorVisible, setModalFloorVisible] = useState(false);

  const { fixtureMode } = useContext(AuthContext);

  const before = `${dateAPIFormat(new Date())} 00:00`;
  const after = `${dateAPIFormat(new Date())} 23:59`;

  const fetchData = async () => {
    setLoading(true);
    // const { data: dataFetch } = await Supabase.from('check_in_out')
    //   .select()
    //   .gte('check_out', before)
    //   .lte('check_out', after)
    //   .order('id', { ascending: false });

    console.log(titlePickerBuilding);
    console.log(titlePickerFloor);

    let query = Supabase.from('check_in_out').select();

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

    console.log(query);

    const { data: dataFetch, error } = await query
      .gte('check_out', before)
      .lte('check_out', after)
      .order('id', { ascending: false });

    setListTop3(dataFetch);
    setLoading(false);
  };

  const handleApplyBuilding = useCallback(() => {
    setTitlePickerBuilding(pickerBuilding);
    setModalBuildingVisible(!modalBuildingVisible);
    fetchData();
  }, [pickerBuilding, modalBuildingVisible]);

  const handleApplyFloor = useCallback(() => {
    setTitlePickerFloor(pickerFloor);
    setModalFloorVisible(!modalFloorVisible);
    fetchData();
  }, [pickerFloor, modalFloorVisible]);

  useEffect(() => {
    if (fixtureMode) {
      setLoading(false);
      setListTop3(require('../constants/reportDaily.json'));
    } else {
      fetchData().catch(console.error);
    }
  }, [titlePickerBuilding, titlePickerFloor, selectMale, selectFemale]);

  useEffect(() => {
    const fetchDataDropdown = async () => {
      let data = {};
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

        query = query.order('order', { ascending: true });

        const { data: dataFetch, error } = await query;

        const filterFloor = [...new Set(dataFetch?.map((a) => a.floor?.toUpperCase()))];
        const filterBuilding = [
          ...new Set(
            dataFetch?.map((a) => a.building?.charAt(0).toUpperCase() + a.building.slice(1))
          ),
        ];

        data = {
          building: filterBuilding,
          floor: filterFloor,
        };

        if (listDropdownBuilding?.length === 0 || setListDropdownFloor?.length === 0) {
          setListDropdownBuilding(data?.building);
          setListDropdownFloor(data?.floor);
        }
      }

      setLoading(false);
    };

    fetchDataDropdown().catch(console.error);
  }, []);

  const onRefresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          { display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: '8%' },
        ]}
      >
        <View style={{}}>
          <Text style={styles.title}>Senarai Log Hari Ini</Text>
          <Text style={styles.subTitle}>{dayDateFormat(new Date())}</Text>
        </View>
        {/* <TouchableOpacity style={{marginTop:-12}} onPress={ ()=>{ setModalInfo(!modalInfo);}  }>
          <MaterialIcons
            name="info"
            size={24}
            color={'black'}
          />
        </TouchableOpacity> */}
        <View
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setModalFilter(!modalFilter);
            }}
          >
            <MaterialIcons name="tune" size={34} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>

      {modalFilter && (
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            borderBottomWidth: 1,
            width: '80%',
          }}
        ></View>
      )}

      {modalFilter && (
        <View style={{ width: '80%' }}>
          <View
            style={[
              {
                paddingTop: 10,
                paddingBottom: 6,
                flexDirection: 'row',
              },
            ]}
          >
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 7,
                marginRight: 3,
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
                padding: 7,
                marginHorizontal: 3,
                borderColor: selectFemale ? 'deeppink' : 'pink',
                backgroundColor: selectFemale ? 'pink' : 'white',
              }}
              onPress={() => setSelectFemale(!selectFemale)}
            >
              <Ionicons
                name="woman-sharp"
                size={18}
                color={selectFemale ? 'deeppink' : 'deeppink'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              {
                paddingTop: 6,
                paddingBottom: 10,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              },
            ]}
          >
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={{
                  marginHorizontal: 8,
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: '#254252',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: titlePickerBuilding ? '#254252' : 'white',
                  marginHorizontal: 3,
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
              <View style={{ borderWidth: 1, borderRadius: 10, width: 150, marginHorizontal: 3 }}>
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
            )}
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={{
                  marginHorizontal: 3,
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: '#254252',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: titlePickerFloor ? '#254252' : 'white',
                  marginHorizontal: 3,
                }}
                onPress={() => setModalFloorVisible(true)}
              >
                <Text style={{ color: titlePickerFloor ? 'white' : '#254252', fontWeight: '700' }}>
                  {titlePickerFloor || 'Tingkat'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ borderWidth: 1, borderRadius: 10, width: 150, marginHorizontal: 3 }}>
                <Picker
                  mode="dropdown"
                  selectedValue={titlePickerFloor}
                  onValueChange={(itemValue, itemIndex) => {
                    setTitlePickerFloor(itemValue);
                    fetchData();
                  }}
                >
                  <Picker.Item label="Tingkat" value="" />
                  {listDropdownFloor?.map((a, i) => (
                    <Picker.Item key={i} label={a} value={a} />
                  ))}
                </Picker>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={{ width: 888, height: 1, borderWidth: 1 }}></View>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
        {listTop3?.length > 0 ? (
          listTop3?.map((a, i) => {
            const countObject = Object.keys(a).length - 7;

            const convert = Object.keys(a).map(function (key) {
              return a[key];
            });
            const count = convert.filter((a) => a === false)?.length;
            const final = (count / countObject) * 5;

            const aa = { ...a, photo_in: '', photo_out: '' };

            return (
              <View key={i} style={styles.boxContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('ReportDetails', a)}>
                  <View
                    style={{
                      width: windowWidth * 0.85,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ maxWidth: windowWidth * 0.70 }}>
                      <Text style={{ fontWeight: '800', fontSize: 16 }}>{a.name}</Text>
                      <Text style={{ fontWeight: '500', fontSize: 15 }}>
                        {a.is_office ? 'Pejabat' : a.is_surau ? 'Surau' : 'Tandas'} {a.toilet_name}{' '}
                        {a.gender === 1 ? '(L)' : a.gender === 0 ? '' : '(P)'} -{' '}
                        <Text style={{ textTransform: 'capitalize' }}>{a.building} </Text>
                        Tingkat <Text style={{ textTransform: 'uppercase' }}>{a.floor}</Text>
                      </Text>
                      <Text style={{ fontSize: 13 }}>{`${timeFormat(a.check_in)} - ${timeFormat(
                        a.check_out
                      )}`}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexGrow: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <MaterialIcons
                        name="filter-1"
                        size={24}
                        color={a.photo_in ? 'black' : 'lightgrey'}
                      />
                      <MaterialIcons
                        name="filter-2"
                        size={24}
                        color={a.photo_out ? 'black' : 'lightgrey'}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View style={[styles.container, { paddingTop: '10%', paddingBottom: windowHeight }]}>
            <Text style={{ fontWeight: '600', color: 'red', textAlign: 'center' }}>
              {' '}
              - Tiada borang terbaru -{'\n'}- untuk hari ini -
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalInfo}
        onRequestClose={() => {
          setModalInfo(!modalInfo);
        }}
      >
        <View style={styles.containerModal}>
          <View style={styles.modalView}>
            <Text style={{ fontWeight: '800', fontSize: 16, textDecorationLine: 'underline' }}>
              Informasi Tambahan
            </Text>
            <View
              style={{
                width: '100%',
                padding: 10,
                marginTop: 10,
                marginBottom: 25,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <View
                style={{
                  padding: 3,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <Text style={{ fontWeight: '800', fontSize: 14 }}>Keseluruhan Tandas : </Text>
                <Text style={{ fontWeight: '600', fontSize: 14, textAlign: 'center' }}>
                  {listTop3?.length || 0}
                </Text>
              </View>
              <View style={{ padding: 3, display: 'flex', flexDirection: 'row' }}>
                <Text style={{ fontWeight: '800', fontSize: 14 }}>Tandas Lelaki : </Text>
                <Text style={{ fontWeight: '600', fontSize: 14, textAlign: 'center' }}>
                  {listTop3?.length || 0}
                </Text>
              </View>
              <View style={{ padding: 3, display: 'flex', flexDirection: 'row' }}>
                <Text style={{ fontWeight: '800', fontSize: 14 }}>Tandas Perempuan : </Text>
                <Text style={{ fontWeight: '600', fontSize: 14, textAlign: 'center' }}>
                  {listTop3?.length || 0}
                </Text>
              </View>
              <View style={{ padding: 3, display: 'flex', flexDirection: 'row' }}>
                <Text style={{ fontWeight: '800', fontSize: 14 }}>Staff : </Text>
                <Text style={{ fontWeight: '600', fontSize: 14, textAlign: 'center' }}>
                  {listTop3?.length || 0}
                </Text>
              </View>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalInfo(!modalInfo)}
            >
              <Text style={styles.textStyle}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
          <View style={styles.centeredViewFilter}>
            <View style={styles.modalViewFilter}>
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
          <View style={styles.centeredViewFilter}>
            <View style={styles.modalViewFilter}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  maintenance: {
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderColor: 'red',
    backgroundColor: 'yellow',
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  boxContainer: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: '8%',
    width: windowWidth,
    alignItems: 'flex-start',
  },
  login: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  centeredViewFilter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(204, 204, 204, 0.9)',
  },
  modalViewFilter: {
    width: windowWidth,
    backgroundColor: 'white',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderWidth: 1,
    borderColor: 'lightgrey',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    padding: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  containerModal: {
    flex: 1,
    backgroundColor: 'rgba(204, 204, 204, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: windowWidth * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'lightgrey',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    padding: 10,
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
