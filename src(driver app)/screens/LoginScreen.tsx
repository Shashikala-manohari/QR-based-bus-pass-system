import {deleteUser, signInWithEmailAndPassword} from 'firebase/auth';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {auth} from '../../firebase/firebaseInitUsers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth3} from '../../firebase/firebaseinitPassengers';

const LoginScreen = (a: any) => {
  const stack = a.navigation;
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');

        if (storedEmail) {
          setUserEmail(storedEmail);
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };
    loadCredentials();
  }, []);

  return (
    <View style={sty.container}>
      <Image
        style={sty.login_img}
        source={require('../../assets/img/bus3.jpg')}
        resizeMode="cover"
      />
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'never'}>
        <Text style={sty.header}>{'Welcome to\n'}<Text style={sty.header1}>Bustapp</Text>{'\nCommunity'}</Text>

        <LoginField stack={stack} email={userEmail} setEmail={setUserEmail} />
      </KeyboardAwareScrollView>
    </View>
  );
};

function BottomSection(p: any) {
  const stack = p.stack;

  function GotoSignUp() {
    stack.navigate('SignUp');
  }

  function GotoForgot() {
    stack.navigate('Forgetpass');
  }

  return (
    <View style={{flexDirection: 'row', marginTop: '25%', marginBottom: '5%'}}>
      <View style={sty.bottom_view}>
        <TouchableOpacity onPress={GotoSignUp}>
          <Text style={sty.bottom_text01}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={sty.bottom_view}>
        <TouchableOpacity onPress={GotoForgot}>
          <Text style={sty.bottom_text02}>Forget Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SignInButton(p: any) {
  const stack = p.stack;
  const email = p.u_email;
  const password = p.u_pass;
  const [isLogging, setIsLogging] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  function GoToMain() {
    setIsLogging(false);
    stack.navigate('Main', {
      scannerOn: false,
      flashOn: false,
      dataName: [],
      dataValue: [],
    });
  }

  function GoToHome() {
    setIsLogging(false);
    stack.navigate('Home');
  }

  function AuthenticateUser() {
    setIsLogging(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        // Signed in
        const user = userCredential.user;
        if (user.emailVerified) {
          await AsyncStorage.setItem('email', email);
          setIsVerified(true);
          signInWithEmailAndPassword(auth3, email, password)
            .then(userCredential => {
              // Signed in
            })
            .catch(error => {
              const errorCode = error.code;
              const alert = 'Error code : ' + errorCode.split('/')[1];
              Alert.alert('Error', alert);
              setIsLogging(false);
            });
          GoToHome();
        } else {
          setIsLogging(false);
          deleteUser(user);
          Alert.alert(
            'Error',
            'Your registation process is unsuccessful because your unable to verify your email',
          );
        }
        setIsVerified(user.emailVerified);
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const alert = 'Error code : ' + errorCode.split('/')[1];
        Alert.alert('Error', alert);
        setIsLogging(false);
      });
  }

  return (
    <View style={{flexDirection: 'row', marginTop: 30}}>
      <View style={sty.sign_in_view01}>
        <Text style={sty.sign_in_text}>Sign in</Text>
      </View>
      <TouchableOpacity onPress={AuthenticateUser}>
        <View style={sty.sign_in_icon}>
          {isLogging ? (
            <ActivityIndicator animating={true} color="#1fcc75" size={32} />
          ) : (
            <Icon name="arrow-forward" size={32} color="white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

function LoginField(p: any) {
  const stack = p.stack;
  const [userPassword, setUserPassword] = useState('');

  return (
    <View style={sty.login_view}>
      <View style={sty.login_field_uname}>
        <TextInput
          style={sty.text_input}
          placeholder="Your Email"
          placeholderTextColor={'#7d7d85'}
          cursorColor={'#606066'}
          value={p.email}
          onChangeText={v => p.setEmail(v)}
        />
      </View>

      <View style={sty.login_field_pass}>
        <TextInput
          style={sty.text_input}
          placeholder="Your Password"
          placeholderTextColor={'#7d7d85'}
          cursorColor={'#606066'}
          secureTextEntry={true}
          onChangeText={v => setUserPassword(v)}
        />
      </View>
      <SignInButton u_email={p.email} u_pass={userPassword} stack={stack} />
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
    fontSize: 35,
    color: 'white',
    fontWeight: '700',
    marginTop: 100,
    marginLeft: 20,
  },
  header1: {
    fontSize: 35,
    color: '#92c244',
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
    elevation: 5,
  },
  login_field_pass: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    height: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 20,
    elevation: 5,
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
  sign_in_icon: {
    width: 50,
    height: 50,
    backgroundColor: '#367cfe',
    marginRight: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
    elevation: 5,
  },
  sign_in_view02: {
    height: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  bottom_text01: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginLeft: 40,
    textAlign: 'left',
  },
  bottom_text02: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginRight: 40,
    textAlign: 'right',
  },
  bottom_view: {
    flex: 1,
  },
  indicator: {},
});

//make this component available to the app
export default LoginScreen;
