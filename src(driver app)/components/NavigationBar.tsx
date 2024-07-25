import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {auth, db} from '../../firebase/firebaseInitUsers';
import {db3} from '../../firebase/firebaseinitPassengers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HandlePay from '../globleVariables/RouteCharges';

const NavigationBar = (a: any) => {
  const stack = a.stack;
  const [isScannerOn, setIsScannerOn] = useState(a.scannerOn);
  const [isFlashOn, setIsFlashOn] = useState(a.flashOn);
  const [scannedData, setScannedData] = useState(a.dataName);
  const [scannedAmount, setScannedAmount] = useState(a.dataValue);
  const [location, setLocation] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [busDocId, setBusDocId] = useState('');
  const [busAmount, setBusAmount] = useState(0);

  useEffect(() => {
    const getLocation = async () => {
      const getRef = await getDocs(
        query(
          collection(db, 'Users'),
          where('email', '==', auth.currentUser?.email),
        ),
      );
      setLocation(getRef.docs[0].data()?.stopped_location);
      setBusNumber(getRef.docs[0].data()?.registation_no);
      setBusAmount(getRef.docs[0].data()?.amount);
      setBusDocId(getRef.docs[0].id);
    };
    getLocation();
  });
  const onSuccess = async (dataOutput: any) => {
    const date = new Date();
    const {bounds, data, rawData, target, type} = dataOutput;
    const id: string = data;
    const currentDate =
      date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    const currentTime =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    const storedIdArray = await AsyncStorage.getItem('idArray');
    let array: {onBoaredId: string; pickupPoint: string}[] = [];
    if (storedIdArray) {
      array = JSON.parse(storedIdArray);
    } else {
      await AsyncStorage.setItem('idArray', JSON.stringify(array));
      const storedIds = await AsyncStorage.getItem('idArray');
      if (storedIds) {
        array = JSON.parse(storedIds);
      }
    }

    const getRefPassenger = await getDoc(doc(db3, 'Users', id));
    const userName = getRefPassenger.data()?.name ?? '';
    const tripCount = getRefPassenger.data()?.trip_count ?? 0;
    const userAmount = getRefPassenger.data()?.amount ?? 0;
    const tripId = 'Trip-' + tripCount;
    let charge = 0;

    if (array.some(item => item.onBoaredId == id)) {
      const pickupPoint =
        array.find(item => item.onBoaredId == id)?.pickupPoint ?? '';
      charge = await HandlePay(pickupPoint, location, userAmount);
      const updatedArray = array.filter(
        (item: {onBoaredId: string; pickupPoint: string}) =>
          item.onBoaredId != id,
      );
      await AsyncStorage.setItem('idArray', JSON.stringify(updatedArray));

      await setDoc(
        doc(db3, 'Users', id, 'Trips', tripId),
        {
          dropDown: {location, time: currentTime, date: currentDate},
          charge: charge,
        },
        {merge: true},
      );
      if (charge >= 0) {
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

      await setDoc(doc(db3, 'Users', id, 'Trips', tripId), {
        pickUp: {location, time: currentTime, date: currentDate},
        charge: 0,
        bus_registation_no: busNumber,
      });
    }

    setScannedData([userName, ...scannedData]);
    setScannedAmount([charge, ...scannedAmount]);

    if (a.routeName == 'Main') {
      GoToHome();
    }
  };

  function GoToHome() {
    stack.navigate('Main', {
      scannerOn: isScannerOn,
      flashOn: isFlashOn,
      dataName: scannedData,
      dataValue: scannedAmount,
    });
  }
  function GoToLocationSelector() {
    stack.navigate('LocSelector', {
      scannerOn: isScannerOn,
      flashOn: isFlashOn,
      dataName: scannedData,
      dataValue: scannedAmount,
    });
  }

  function GetScannerON() {
    setIsScannerOn(true);
  }

  function GetScannerOFF() {
    setIsScannerOn(false);
  }

  function GetFlash() {
    setIsFlashOn(!isFlashOn);
  }

  return (
    <View
      style={{
        height: 85,
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255,255 , 0.8)',
        borderRadius: 15,
        elevation: 5,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {a.routeName == 'Main' ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToHome}>
            <Icon name="home" size={25} color="#a297a6" />
            <Text style={{color: '#a297a6', right: '14%', fontSize: 14}}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToHome}>
            <Icon name="home" size={25} color="#b449de" />
            <Text style={{color: '#b449de', right: '14%', fontSize: 14}}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isScannerOn ? (
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity onPress={GetScannerOFF}>
              <Icon name="close-circle" size={35} color="#3f6bd1" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.8}}>
            {isFlashOn ? (
              <QRCodeScanner
                onRead={onSuccess}
                reactivate={true}
                reactivateTimeout={2000}
                flashMode="torch"
                cameraStyle={{width: 40, height: 30}}
              />
            ) : (
              <QRCodeScanner
                onRead={onSuccess}
                reactivate={true}
                reactivateTimeout={2000}
                cameraStyle={{width: 40, height: 30}}
              />
            )}
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity onPress={GetFlash}>
              {isFlashOn ? (
                <Icon name="flash-off" size={35} color="#3f6bd1" />
              ) : (
                <Icon name="flash" size={35} color="#3f6bd1" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GetScannerON}>
            <Icon name="scan-circle" size={55} color="#3f6bd1" />
          </TouchableOpacity>
        </View>
      )}
      {a.routeName == 'LocSelector' ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToLocationSelector}>
            <Icon name="location" size={25} color="#a297a6" />
            <Text style={{color: '#a297a6', right: '22%', fontSize: 14}}>
              Location
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToLocationSelector}>
            <Icon name="location" size={25} color="#b449de" />
            <Text style={{color: '#b449de', right: '22%', fontSize: 14}}>
              Location
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default NavigationBar;
