import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {sendPasswordResetEmail} from 'firebase/auth';
import {auth} from '../../firebase/firebaseInitUsers';

const ForgetPassScreen = (a: any) => {
  const stack = a.navigation;
  return (
    <View style={sty.container}>
      <Image
        style={sty.login_img}
        source={require('../../assets/img/bus1.jpg')}
        resizeMode="cover"
      />
       <KeyboardAwareScrollView keyboardShouldPersistTaps={'never'}>
      <Text style={sty.header}>{'Forget\nPassword'}</Text>
     
        <SignUpSection stack={stack} />
      </KeyboardAwareScrollView>
    </View>
  );
};

function SignUpSection(p: any) {
  const stack = p.stack;

  const [userEmail, setUserEmail] = useState('');

  function PasswordReset() {
    sendPasswordResetEmail(auth, userEmail)
      .then(() => {
        // Password reset email sent!
        Alert.alert('Alert', 'The password reset link was send to your email');
        // ..
      })
      .catch(error => {
        const errorCode = error.code;
        const alert = 'Error code : ' + errorCode.split('/')[1];
        Alert.alert('Error', alert);
        // ..
      });
  }

  return (
    <View style={sty.login_view}>
      <View style={sty.login_field_mail}>
        <TextInput
          style={sty.text_input}
          placeholder="Your Email"
          placeholderTextColor={'#7d7d85'}
          onChangeText={v => setUserEmail(v)}
        />
      </View>

     <View style={sty.buttonContainer}>
     <View style={sty.btnLeftView}></View>
     <View style={sty.button}>
        <Button
          title="Send verification Email"
          onPress={() => PasswordReset()}
        />
      </View>
      
     </View>
      <BottomSection stack={stack} />
    </View>
  );
}

function BottomSection(p: any) {
  const stack = p.stack;
  function GoToSignin() {
    stack.navigate('Login');
  }

  return (
    <TouchableOpacity onPress={GoToSignin}>
      <View style={{flexDirection: 'row', marginTop:'45%'}}>
        <View style={sty.bottom_view02}>
          <Text style={sty.bottom_text02}>Sign In</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const sty = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  login_img: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    fontSize: 45,
    color: 'white',
    fontWeight: '700',
    marginTop: 100,
    marginLeft: 20,
  },
  login_field_uname: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    height: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 10,
  },
  login_field_mail: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    height: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 20,
  },
  login_field_pass: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 20,
  },
  text_input: {
    fontSize: 16,
    color: 'black',
  },
  login_view: {
    marginTop: 100,
  },
  sign_in_view01: {
    flex: 1,
    height: 70,
    justifyContent: 'center',
  },
  sign_in_text: {
    fontSize: 25,
    fontWeight: '700',
    color: 'black',
    marginLeft: 40,
  },
  sign_in_view02: {
    height: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  bottom_view01: {
    flex: 1,
    height: 70,
    justifyContent: 'center',
  },
  bottom_text01: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginLeft: 40,
  },
  bottom_text02: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginRight: 40,
  },
  bottom_view02: {
    flex: 1,
    height: 70,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  sign_in_icon: {
    width: 30,
    height: 10,
    backgroundColor: '#367cfe',
    marginRight: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: 40,
  },
  buttonContainer:{
flexDirection:'row',
  },
  button: {
flex:1,
marginRight:35,
    marginTop: 30,
    width: 200,
  },
  btnLeftView:{
    flex:1
  },
});

export default ForgetPassScreen;
