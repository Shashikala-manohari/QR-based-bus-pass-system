import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {db3} from '../../firebase/firebaseinitPassengers';
import HandlePay from '../globleVariables/RouteCharges';
import {auth, db} from '../../firebase/firebaseInitUsers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {Getgreeting} from './Greeting';
import {Speak} from './Voice';

const Scanner = (a: any) => {
  const [isScannerOn, setIsScannerOn] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scannedData, setScannedData] = useState(a.dataName);
  const [scannedAmount, setScannedAmount] = useState(a.dataValue);
  const [busNumber, setBusNumber] = useState('');
  const [busDocId, setBusDocId] = useState('');
  const [busAmount, setBusAmount] = useState(0);
  let location = a.location;

  const getBusDetails = async () => {
    const getRef = await getDocs(
      query(
        collection(db, 'Users'),
        where('email', '==', auth.currentUser?.email),
      ),
    );
    if (!getRef.empty) {
      setBusNumber(getRef.docs[0].data()?.registation_no);
      setBusAmount(getRef.docs[0].data()?.amount);
      setBusDocId(getRef.docs[0].id);
    }
  };

  const onSuccess = async (dataOutput: any) => {
    let date = new Date();
    let {bounds, data, rawData, target, type} = dataOutput;
    let id: string = data;
    let currentDate =
      date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    let currentTime =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    let storedIdArray = await AsyncStorage.getItem('idArray');
    let array: {onBoaredId: string; pickupPoint: string}[] = [];
    if (storedIdArray) {
      array = JSON.parse(storedIdArray);
    } else {
      await AsyncStorage.setItem('idArray', JSON.stringify(array));
      let storedIds = await AsyncStorage.getItem('idArray');
      if (storedIds) {
        array = JSON.parse(storedIds);
      }
    }

    try {
      let getRefPassenger = await getDoc(doc(db3, 'Users', id));
      if (getRefPassenger.exists()) {
        let userName: string = getRefPassenger.data()?.nick_name;
        let tripCount: number = getRefPassenger.data()?.trip_count;
        let userAmount: number = getRefPassenger.data()?.amount;
        let tripId: string = 'Trip-' + tripCount;
        let greating = Getgreeting();
        let charge = 0;

        if (array.some(item => item.onBoaredId == id)) {
          await getBusDetails();
          let pickupPoint =
            array.find(item => item.onBoaredId == id)?.pickupPoint ?? '';
          charge = await HandlePay(pickupPoint, location, userAmount);
          let updatedArray = array.filter(
            (item: {onBoaredId: string; pickupPoint: string}) =>
              item.onBoaredId != id,
          );
          await AsyncStorage.setItem('idArray', JSON.stringify(updatedArray));
          a.pickUp(pickupPoint.split('_')[1]);
          a.drop(location.split('_')[1]);
          a.charge(charge);
          a.count(updatedArray.length);
          await setDoc(
            doc(db3, 'Users', id, 'Trips', tripId),
            {
              dropDown: {location, time: currentTime, date: currentDate},
              charge: charge,
            },
            {merge: true},
          );
          if (charge >= 0) {
            let farewellMessage =
              'Thank you for traveling with us. Your total fare is ' +
              charge +
              ' rupees. Have a nice day!';
            Speak(farewellMessage);
            await setDoc(
              doc(db3, 'Users', id),
              {
                amount: userAmount - charge,
                trip_count: tripCount + 1,
              },
              {merge: true},
            );
            await setDoc(
              doc(db, 'Users', busDocId),
              {
                amount: busAmount + charge,
              },
              {merge: true},
            );
          } else {
            let farewellMessage =
              'Your total fare is ' +
              charge +
              ' rupees, which is insufficient. Please contact the bus driver for further assistance.';
            Speak(farewellMessage);
            await setDoc(
              doc(db3, 'Users', id),
              {
                amount: -charge,
                trip_count: tripCount + 1,
              },
              {merge: true},
            );
          }
        } else {
          array.push({onBoaredId: id, pickupPoint: location});
          await AsyncStorage.setItem('idArray', JSON.stringify(array));
          a.count(array.length);
          if (userAmount >= 30) {
            let greatingMessage = greating + userName + '! Take a sit';
            Speak(greatingMessage);
          } else {
            let greatingMessage =
              greating +
              userName +
              '! Your remaining balance is less than minimum charge, Please recharge it.';
            Speak(greatingMessage);
          }

          await setDoc(doc(db3, 'Users', id, 'Trips', tripId), {
            pickUp: {location, time: currentTime, date: currentDate},
            charge: 0,
            bus_registation_no: busNumber,
          });
        }

        setScannedData([userName, ...scannedData]);
        setScannedAmount([charge, ...scannedAmount]);
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Try again');
    }
  };

  return (
    <View
      style={{
        height: 80,
        width: 80,
        top: 40,
        backgroundColor: 'rgba(255,255,255,1)',
        borderRadius: 50,
      }}>
      {isScannerOn ? (
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity onPress={() => setIsScannerOn(false)}>
              <Icon name="close-circle" size={30} color="#3f6bd1" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            {isFlashOn ? (
              <QRCodeScanner
                onRead={onSuccess}
                reactivate={true}
                reactivateTimeout={2000}
                flashMode={'torch'}
                cameraStyle={{width: 30, height: 30}}
              />
            ) : (
              <QRCodeScanner
                onRead={onSuccess}
                reactivate={true}
                reactivateTimeout={2000}
                cameraStyle={{width: 30, height: 30}}
              />
            )}
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity onPress={() => setIsFlashOn(!isFlashOn)}>
              {isFlashOn ? (
                <Icon name="flash-off" size={30} color="#3f6bd1" />
              ) : (
                <Icon name="flash" size={30} color="#3f6bd1" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => setIsScannerOn(true)}>
            <Icon1 name="qr-code-scanner" size={45} color="#3f6bd1" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({});
