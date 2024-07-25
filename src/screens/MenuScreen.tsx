import {View, Text, StyleSheet, Alert} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {auth, db} from '../../firebase/firebaseInitUsers';
import {signOut} from 'firebase/auth';
import {collection, getDocs, query, where} from 'firebase/firestore';
import { auth3 } from '../../firebase/firebaseinitPassengers';

const MenuScreen = (a: any) => {
  const stack = a.navigation;

  async function GoToBusRegister() {
    const getRef = await getDocs(
      query(
        collection(db, 'Users'),
        where('email', '==', auth.currentUser?.email),
      ),
    );
    if (getRef.docs[0].data().status == 'Pending') {
      stack.navigate('BusReg');
    } else {
      const busName = getRef.docs.map(doc => doc.data().bus_name);
      const message =
        'Your already registered a bus' + '\n(Bus Name: ' + busName[0] + ')';
      Alert.alert('Remainder', message);
    }
  }

  function SignOutUser() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        stack.navigate('Login');
      })
      .catch(error => {
        // An error happened.
        const errorCode = error.code;
        const alert = 'Error code : ' + errorCode.split('/')[1];
        Alert.alert('Error', alert);
      });
      signOut(auth3)
      .then(() => {
        // Sign-out successful.
        stack.navigate('Login');
      })
      .catch(error => {
        // An error happened.
        const errorCode = error.code;
        const alert = 'Error code : ' + errorCode.split('/')[1];
        Alert.alert('Error', alert);
      });
  }

  return (
    <View style={sty.button}>
      <TouchableOpacity onPress={GoToBusRegister}>
        <View style={{flexDirection: 'row', marginBottom: 30}}>
          <View style={{flex: 1, right: 20}}>
            <Icon name="bus-outline" size={35} color="black" />
          </View>
          <Text style={{flex: 3, color: 'black', fontSize: 18, marginTop: 5}}>
            Bus Registation
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={SignOutUser}>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <View style={{flex: 1, right: 20}}>
            <Icon name="log-out-outline" size={40} color="black" />
          </View>
          <Text style={{flex: 3, color: 'black', fontSize: 18, marginTop: 5}}>
            Sign Out
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>stack.navigate("Balance")}>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <View style={{flex: 1, right: 20}}>
            <Icon name="cash-outline" size={40} color="black" />
          </View>
          <Text style={{flex: 3, color: 'black', fontSize: 18, marginTop: 5}}>
            My Balance
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const sty = StyleSheet.create({
  button: {
    marginLeft: 50,
    marginRight: 50,
    marginTop: 50,
  },
});

export default MenuScreen;
