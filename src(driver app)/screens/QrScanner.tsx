import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const QrScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState();
  const onSuccess = (dataOutput: any) => {
    const {bounds, data, rawData, target, type} = dataOutput;
    setScannedData(data);
    setScanned(true);
  };
  if (scanned) {
    console.log(scannedData);
  }
  return (
    <QRCodeScanner
      onRead={onSuccess}
      reactivate={true}
      cameraStyle={{width: 100, height: 100, left: 40}}
    />
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default QrScanner;
