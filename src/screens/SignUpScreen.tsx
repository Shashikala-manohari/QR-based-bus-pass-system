import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  Button,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {auth, db} from '../../firebase/firebaseInitUsers';
import {
  applyActionCode,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth3 } from '../../firebase/firebaseinitPassengers';

const SignUpScreen = (a: any) => {
  const stack = a.navigation;
  return (
    <View style={sty.container}>
      <Image
        style={sty.login_img}
        source={require('../../assets/img/bus1.jpg')}
        resizeMode="cover"
      />
       <KeyboardAwareScrollView keyboardShouldPersistTaps={'never'}>
      <Text style={sty.header}>{'Create\nAccount'}</Text>
     
        <SignUpSection stack={stack} />
      </KeyboardAwareScrollView>
    </View>
  );
};

function BottomSection(p: any) {
  const stack = p.stack;
  function GoToSignin() {
    stack.navigate('Login');
  }

  return (
    <TouchableOpacity onPress={GoToSignin}>
      <View style={{flexDirection: 'row'}}>
        <View style={sty.bottom_view02}>
          <Text style={sty.bottom_text02}>Sign In</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function SignUpButton(p: any) {
  const stack = p.stack;
  const email = p.u_email;
  const password = p.u_pass;

  function Authentication() {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed up
        const user = userCredential.user;
        VerificationEmail(user);
        Alert.alert('Alert', 'The verification link was send to your email');
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const alert = 'Error code : ' + errorCode.split('/')[1];
        Alert.alert('Error', alert);
        // ..
      });

      createUserWithEmailAndPassword(auth3, email, password)
      .then(userCredential => {
        // Signed up
        const user = userCredential.user;
      })
      .catch(error => {
        const errorCode = error.code;
        const alert = 'Error code : ' + errorCode.split('/')[1];
        Alert.alert('Error', alert);
        // ..
      });
  }
  return (
    <View style={{flexDirection: 'row', marginTop: 30}}>
      <View style={sty.sign_in_view01}>
        <Text style={sty.sign_in_text}>Sign Up</Text>
      </View>
      <View style={sty.button}>
        <Button
          title="Send verification Email"
          onPress={() => Authentication()}
        />
      </View>
    </View>
  );
}

async function VerificationEmail(user: any) {
  const actionCodeSettings = {
    url: 'https://www.myapp.com/app.json',
    handleCodeInApp: true,
  };
  try {
    await sendEmailVerification(user, actionCodeSettings);
    const code = '1234';
    // Obtain code from the user.
    await applyActionCode(auth, code);
  } catch (error: any) {
    const errorCode = error.code;
    console.log(errorCode);
    // ..
  }
}

function SignUpSection(p: any) {
  const stack = p.stack;

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

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

      <View style={sty.login_field_pass}>
        <TextInput
          style={sty.text_input}
          placeholder="Your Password"
          placeholderTextColor={'#7d7d85'}
          secureTextEntry={true}
          onChangeText={v => setUserPassword(v)}
        />
      </View>

      <SignUpButton u_email={userEmail} u_pass={userPassword} stack={stack} />
      <BottomSection stack={stack} />
    </View>
  );
}

// define your styles
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
    backgroundColor: 'rgba(255,255,255,0.8)',
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
    color: 'white',
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
    marginTop:60,
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
  button: {
    marginRight: 30,
    top: 10,
  },
});

//make this component available to the app
export default SignUpScreen;
