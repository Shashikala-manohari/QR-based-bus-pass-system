import {View, Text, StyleSheet, Alert} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {signOut} from 'firebase/auth';
import { auth } from '../../firebase/firebaseinitPassengers';

const MenuScreen = (a: any) => {
  const stack = a.navigation;

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
  }

  return (
    <View style={sty.button}>
<TouchableOpacity>
        <View style={{flexDirection: 'row', marginBottom: 30,}}>
          <View style={{flex: 1, alignItems:'center',}}>
            <Icon name="globe-outline" size={30} color="black" />
          </View>
          <Text style={{flex: 3, color: 'black', fontSize: 18, marginTop:0, }}>
            Terms and Conditions
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={SignOutUser}>
        <View style={{flexDirection: 'row', marginBottom: 30}}>
          <View style={{flex: 1,alignItems:'center'}}>
            <Icon name="log-out-outline" size={30} color="black" />
          </View>
          <Text style={{flex: 3, color: 'black', fontSize: 18, marginTop: 0}}>
            Sign Out
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const sty = StyleSheet.create({
  button: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 50,
  },
});

export default MenuScreen;
