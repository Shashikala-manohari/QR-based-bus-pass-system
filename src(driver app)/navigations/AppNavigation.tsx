import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import ForgetPassScreen from '../screens/ForgetPassScreen';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import SignUpScreen from '../screens/SignUpScreen';
import MainScreen from '../screens/MainScreen';
import LocationSelectorSrc from '../screens/LocationSelectorSrc';
import BusRegisterSrc from '../screens/BusRegisterSrc';
import QrScanner from '../screens/QrScanner';
import MenuScreen from '../screens/MenuScreen';
import Home from '../screens/Home';
import StatReport from '../screens/StatReport';
import BalanceScreen from '../screens/BalanceScreen';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="Forgetpass"
        component={ForgetPassScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
    
      />
  
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
      <Stack.Screen
        name="BusReg"
        component={BusRegisterSrc}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Statistics"
        component={StatReport}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="Balance"
        component={BalanceScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="LocSelector"
        component={LocationSelectorSrc}
        options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
      <Stack.Screen name="QrScanner" component={QrScanner} />

      <Stack.Screen
        name="Back"
        component={MenuScreen}
        options={{
          cardStyle: {marginLeft: 130, elevation: 5, backgroundColor: 'white'},
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardOverlayEnabled: true,
          presentation: 'transparentModal',
          headerShown: true,
          headerStyle: {height: 80},
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigation;
