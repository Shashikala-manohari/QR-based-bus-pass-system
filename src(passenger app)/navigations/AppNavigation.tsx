import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ReloadByCard from '../screens/Reload_byCard';
import Home from '../screens/Home';
import AddMembers from '../screens/AddMembers';
import FairCalculation from '../screens/FairCalculation';
import QRCodeDownload from '../screens/QRCodeDownload';
import MenuScreen from '../screens/SideMenu';
import RequestNewQr from '../screens/RequestNewQR';
import MyDetails from '../screens/MyDetails';
import TransactionHistory from '../screens/Transaction';
import FundTransfer from '../screens/FundTransfer_enterDetails';
import AddOldMember from '../screens/AddOldMember';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
  
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forModalPresentationIOS,
          }}
        />
        <Stack.Screen name="Reload" component={ReloadByCard} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddMembers" component={AddMembers} />
        <Stack.Screen name="AddOldMember" component={AddOldMember} />
        <Stack.Screen name="FairCalculation" component={FairCalculation} />
        <Stack.Screen name="QRCodeDownload" component={QRCodeDownload} />
        <Stack.Screen name="RequestQR" component={RequestNewQr} />
        <Stack.Screen name="MyDetails" component={MyDetails} />
        <Stack.Screen name="Transactions" component={TransactionHistory} />
        <Stack.Screen name="FundTransfer" component={FundTransfer} />
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
