import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Handler from '../../payhere';
import NavigationBar from '../components/navigationBar';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import {auth, db3} from '../../firebase/firebaseinitPassengers';
import MembersMenu from '../components/MembersMenu';

const ReloadByCard = (a: any) => {
  const stack = a.navigation;
  const [amount, setAmount] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [previousSelectedId, setPreviousSelectedId] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  function GoToPayhere() {
    Handler(amount);
  }

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const querySnapshot = await getDoc(
          doc(db3, 'Users', auth.currentUser?.uid ?? ''),
        );

        if (querySnapshot.data()?.members
      ) {
          const idArray = querySnapshot.data()?.members;
          setNames(idArray);
          if (selectedId != '') {
            setDoc(
              doc(db3, 'Users', auth.currentUser?.uid ?? ''),
              {selected_id: selectedId},
              {merge: true},
            );

            const getselectedId = querySnapshot.data()?.selected_id;

            setPreviousSelectedId(getselectedId);
          } else {
            setDoc(
              doc(db3, 'Users', auth.currentUser?.uid ?? ''),
              {selected_id: idArray[0]},
              {merge: true},
            );

            const getselectedId = querySnapshot.data()?.selected_id;

            setPreviousSelectedId(getselectedId);
            setIsLogging(true);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error
      }
    };

    fetchAmount();
  }, [selectedId]);

  function GoToMenu() {
    stack.navigate('Back');
  }

  return (
    <View style={styles.container}>
      <Image
        style={{width: '100%', height: '100%', position: 'absolute'}}
        source={require('../../assets/img/app_background.png')}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.settingsIcon} onPress={GoToMenu}>
        <Icon name="settings-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.rectangle}>
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.content}>
          <View>
            <Text style={styles.headerText}>Reload</Text>
            
            <Text style={styles.amountHeaderText}>To</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="person-outline"
                size={20}
                color="#747FFD"
                style={styles.iconcontainer}
              />
              {isLogging ? (
                <MembersMenu
                  nameArray={names}
                  placeHolder={previousSelectedId}
                  setOnChange={(selectedText: any) =>
                    setSelectedId(selectedText)
                  }
                />
              ) : (
                <ActivityIndicator size={30} color="blue" />
              )}
            </View>
            <Text style={styles.amountHeaderText}>Amount</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="cash-outline"
                size={20}
                color="#747FFD"
                style={styles.iconcontainer}
              />
              <TextInput
                style={styles.input}
                placeholder="100.00"
                value={amount}
                onChangeText={setAmount}
                placeholderTextColor={'#7d7d85'}
                cursorColor={'#606066'}
              />
            </View>
            <View>
            <Button title="Pay Now" onPress={GoToPayhere} />
            </View>
          </View>
        </View>
        
            </ScrollView>
      </SafeAreaView>
      
      </View>
      <NavigationBar routeName={a.route.name} stack={stack} />
    </View>
  );
};

export async function Upload(flag: boolean, amount: string) {
  if (flag) {
    
    const getRef = await getDoc(doc(db3, 'Users', auth.currentUser?.uid ?? ''));
    const getSelectedId = getRef.data()?.selected_id ?? '';
    if (getSelectedId != '') {
      const getOldAmount = await getDoc(doc(db3, 'Users', getSelectedId));
      const oldAmount: number = parseFloat(getOldAmount.data()?.amount);
      const newAmount: number = oldAmount + parseFloat(amount);
      console.log(newAmount);
      setDoc(
        doc(db3, 'Users', getSelectedId),
        {amount: newAmount},
        {merge: true},
      );
    }
  }
}

export default ReloadByCard;

const styles = StyleSheet.create({
  rectangle: {
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    backgroundColor: '#FFFFFF',
    top: 0,
    flex: 2,
    marginTop: 150,
  },
  content: {
    marginTop: 50,
    marginBottom:150,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  iconcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 25,
    marginRight: 20,
    paddingLeft: 5,
    paddingTop: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#747FFD',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    fontSize: 16,
  },
  headerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 24,
    marginBottom: 30,
    color: 'blue',
    fontWeight: '700',
    textAlign: 'center',
  },
  amountHeaderText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
    fontWeight: '700',
    textAlign: 'left',
  },
});
