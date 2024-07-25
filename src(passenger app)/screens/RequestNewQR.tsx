import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {SelectList} from 'react-native-dropdown-select-list';
import NavigationBar from '../components/navigationBar';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {db3} from '../../firebase/firebaseinitPassengers';

const RequestNewQr = (a: any) => {
  const stack = a.navigation;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'never'}>
          <GetANewQRCodeHeader />
          <Body />
        </KeyboardAwareScrollView>
      </View>
      <NavigationBar routeName={a.route.name} stack={stack} />
    </View>
  );
};

const GetANewQRCodeHeader = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: '2%',
        paddingBottom: '4%',
        alignItems: 'center',
        marginTop: '2%',
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
      }}>
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 100,
          paddingTop: '3%',
        }}>
        <Icon size={20} name={'arrow-back'} />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: 'Montserrat-Bold',
            color: '#747FFD',
            paddingTop: '4%',
          }}>
          Get a New QR Code
        </Text>
      </View>

      <View
        style={{
          width: 30,
          height: 30,
          alignSelf: 'flex-start',
        }}>
        <Icon color={'#747FFD'} size={35} name={'menu'} />
      </View>
    </View>
  );
};

const Body = () => {
  const [userID, setUserID] = useState('');
  const [selected, setSelected] = useState('');

  const data = [{key: '1', value: 'I Lost My QR Pass'}];

  const fetchData = async () => {
    const snapshot = await getDocs(
      query(collection(db3, 'Users'), where('user_id', '==', userID)),
    );
    if (!snapshot.empty) {
      if (snapshot.docs.length == 1) {
        const docId = snapshot.docs[0].id;
        await setDoc(
          doc(db3, 'Users', docId),
          {account_state: 'Deactive'},
          {merge: true},
        );
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
      }}>
      <View>
        <View
          style={{
            height: 50,
            marginHorizontal: 30,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>
            Enter your user ID{' '}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            height: 40,
            marginHorizontal: 30,
            justifyContent: 'center',
            paddingLeft: 20,
            borderWidth: 1,
            borderColor: '#E8E8E8',
          }}>
          <TextInput
            placeholderTextColor={'#989193'}
            placeholder="XXX0000000"
            value={userID}
            onChangeText={setUserID}
            style={{
              fontSize: 10,
              fontFamily: 'Poppins-Regular',
              color: 'black',
              borderColor: 'black',
            }}
          />
        </View>
      </View>

      <View>
        <View
          style={{
            height: 50,
            marginHorizontal: 30,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>
            Why You need a new QR Code{' '}
          </Text>
        </View>
        <View>
          <SelectList
            setSelected={(val: any) => setSelected(val)}
            data={data}
            save="value"
            boxStyles={{
              height: 40,
              borderRadius: 20,
              marginHorizontal: 30,
              borderWidth: 1,
              borderColor: '#E8E8E8',
            }}
            inputStyles={{
              color: '#989193',
              fontSize: 10,
              fontFamily: 'Poppins-Regular',
            }}
            dropdownStyles={{
              marginHorizontal: 30,
              borderWidth: 1,
              borderColor: '#E8E8E8',
            }}
            dropdownTextStyles={{
              color: '#989193',
              fontSize: 10,
              fontFamily: 'Poppins-Regular',
            }}
          />
        </View>
      </View>

      <View>
        <View
          style={{
            height: 50,
            marginHorizontal: 30,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>
            Other{' '}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            height: 80,
            marginHorizontal: 30,
            justifyContent: 'center',
            paddingLeft: 20,
            borderWidth: 1,
            borderColor: '#E8E8E8',
          }}>
          <TextInput
            placeholderTextColor={'#989193'}
            style={{
              fontSize: 15,
              color: 'black',
              borderColor: 'black',
              fontFamily: 'Poppins-Regular',
            }}
          />
        </View>
      </View>

      <View
        style={{
          height: 50,
          marginHorizontal: 30,
          alignItems: 'center',
          marginTop: '5%',
          marginBottom: '2%',
        }}>
        <Button
          title={'GET A NEW QR CODE'}
          color={'rgba(58, 64, 240,1)'}
          onPress={fetchData}
        />
      </View>
    </View>
  );
};

export default RequestNewQr;

const styles = StyleSheet.create({});
