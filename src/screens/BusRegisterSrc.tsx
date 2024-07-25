import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Button, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {auth, db} from '../../firebase/firebaseInitUsers';
import {addDoc, collection, doc, getDoc, setDoc} from 'firebase/firestore';
import {db4} from '../../firebase/firebaseinitLocation';

const BusRegister = (a: any) => {
  const stack = a.navigation;

  return (
    <View style={sty.container}>
      <Text style={sty.headerText}>{'Bus\nRegistation'}</Text>
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'never'}>
        <RegisterSection stack={stack} />
      </KeyboardAwareScrollView>
    </View>
  );
};

function RegisterSection(p: any) {
  const stack = p.stack;
  const [busName, setBusName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [regId, setRegId] = useState('');
  const [tpNumber, setTpNumber] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={{marginTop: 50}}>
      <Modal
        visible={isLoading}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <ActivityIndicator size={80} color="#0000ff" />
        </View>
      </Modal>
      <InputFieldSection
        setText={'Bus Name'}
        cursorColor={'#606066'}
        placeholderTextColor={'black'}
        setPlaceholder={'Enter name of the bus'}
        setOnChange={(v: React.SetStateAction<string>) => setBusName(v)}
      />

      <InputFieldSection
        setText={'Bus Registation ID'}
        cursorColor={'#606066'}
        placeholderTextColor={'black'}
        setPlaceholder={'Enter registation id of the bus'}
        setOnChange={(v: React.SetStateAction<string>) => setRegId(v)}
      />

      <InputFieldSection
        setText={"Driver's Name"}
        cursorColor={'#606066'}
        placeholderTextColor={'black'}
        setPlaceholder={"Enter driver's name of the bus"}
        setOnChange={(v: React.SetStateAction<string>) => setDriverName(v)}
      />

      <InputFieldSection
        setText={"Driver's telephone Number"}
        cursorColor={'#606066'}
        placeholderTextColor={'black'}
        setPlaceholder={'+94110000000'}
        setOnChange={(v: React.SetStateAction<string>) => setTpNumber(v)}
      />

      <InputFieldSection
        setText={'WhatsApp Number'}
        cursorColor={'#606066'}
        placeholderTextColor={'black'}
        setPlaceholder={'+94110000000 (optional)'}
        setOnChange={(v: React.SetStateAction<string>) => setWaNumber(v)}
      />

      <Button style={sty.submitButton} onPress={UploadToDatabase}>
        <Text style={sty.buttonText}>Submit</Text>
      </Button>
      <View style={{marginBottom: 150}}></View>
    </View>
  );

  function DisplayAccInMain() {
    stack.navigate('Main', {
      scannerOn: false,
      flashOn: false,
      dataName: [],
      dataValue: [],
    });
  }

  async function UploadToDatabase() {
    if (busName && regId && driverName && tpNumber) {
      setIsLoading(true);
      console.log(regId);
      const getsnapshot = await getDoc(doc(db, 'Users', regId));
      console.log(getsnapshot);
      if (getsnapshot.exists()) {
        await setDoc(
          doc(db, 'Users', regId),
          {
            email: auth.currentUser?.email,
            bus_name: busName,
            driverName: driverName,
            driver_telephone_no: tpNumber,
            whatsapp_no: waNumber,
            amount: 0,
            stopped_location: '',
            status: 'Registered',
          },
          {merge: true},
        );
        await setDoc(doc(db4, 'Buses', getsnapshot.data().registation_no), {
          registation_no: getsnapshot.data().registation_no,
          stopped_location: '',
          route: '',
        });
        setIsLoading(false);
        DisplayAccInMain();
      } else {
        setIsLoading(false);
        Alert.alert('Error', 'Invalid input!');
      }
    } else {
      Alert.alert('Error', 'Missing field Values!');
    }
  }
}

function InputFieldSection(p: any) {
  const text = p.setText;
  const placeholder = p.setPlaceholder;
  const onChange = p.setOnChange;

  return (
    <View style={{marginBottom: 10}}>
      <Text style={sty.inputTextid}>{text}</Text>
      <View style={sty.inputField}>
        <TextInput
          style={sty.textInput}
          placeholder={placeholder}
          underlineColor="white"
          activeUnderlineColor="white"
          placeholderTextColor={'#90a6a5'}
          onChangeText={onChange}
        />
      </View>
    </View>
  );
}

const sty = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 45,
    color: 'blue',
    fontWeight: '700',
    marginTop: 80,
    marginLeft: 20,
  },
  inputTextid: {
    fontSize: 18,
    color: 'black',
    left: 30,
    fontWeight: '500',
  },
  inputField: {
    borderRadius: 30,
    height: 50,
    width: 350,
    marginHorizontal: 30,
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: '#afc7c7',
  },
  textInput: {
    fontSize: 15,
    fontWeight: '100',
    width: 320,
    left: 10,
    height: 40,
    backgroundColor: 'white',
  },
  submitButton: {
    borderRadius: 30,
    height: 50,
    width: 350,
    marginHorizontal: 30,
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
  },
});

export default BusRegister;
