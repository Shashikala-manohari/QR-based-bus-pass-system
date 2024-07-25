import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {auth, db3} from '../../firebase/firebaseinitPassengers';
import NavigationBar from '../components/navigationBar';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {doc, getDoc, setDoc, where} from 'firebase/firestore';
import RoutesMenu from '../components/DropdownMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = (a: any) => {
  const stack = a.navigation;
  const [searchedName, setSearchedName] = useState('');
  const [amount, setAmount] = useState('0');
  const [names, setNames] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [previousSelectedId, setPreviousSelectedId] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const date = new Date();
  const currentDate = date.getMonth() + '/' + date.getDate();
  const currentTime =
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

  useEffect(() => {
    const loadData = async () => {
      setIsLogging(true);
      const storedSelectedId = await AsyncStorage.getItem('selectedId');
      if (storedSelectedId) {
        setPreviousSelectedId(storedSelectedId);
        setSelectedId(storedSelectedId);
        const getAmount = await getDoc(doc(db3, 'Users', storedSelectedId));
        const userAmount = getAmount.data()?.amount ?? '0';
        setAmount(userAmount);
      }
      setIsLogging(false);
    };
    loadData();
  }, []);

  const HandleRefresh = () => {
    setIsRefresh(!isRefresh);
  };
  useEffect(() => {
    const fetchAmount = async () => {
      setIsLogging(true);
      try {
        if (selectedId) {
          await AsyncStorage.setItem('selectedId', selectedId);
        }
        const querySnapshot = await getDoc(
          doc(db3, 'Users', auth.currentUser?.uid ?? ''),
        );

        if (querySnapshot.data()?.members) {
          const idArray = querySnapshot.data()?.members;
          setNames(idArray);
          if (selectedId != '') {
            const getAmount = await getDoc(doc(db3, 'Users', selectedId));
            const userAmount = getAmount.data()?.amount ?? '0';
            setAmount(userAmount);
          }
        }
      } catch (error) {
        console.error('Error fetching amount:', error);
        // Handle error
      }
      setIsLogging(false);
    };
    fetchAmount();
  }, [isRefresh, selectedId]);

  useEffect(() => {
    const addAccount = async () => {
      try {
        const id: string = auth.currentUser?.uid ?? '';
        const docRef = doc(db3, 'Users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        } else {
          setDoc(doc(db3, 'Users', id), {email: auth.currentUser?.email});
        }
      } catch (error) {
        console.error('Error fetching addUser:', error);
      }
    };
    addAccount();
  }, []);

  function GoToReload() {
    stack.navigate('Reload');
  }

  function GoToAddMembers() {
    setIsVisible(false);
    stack.navigate('AddMembers');
  }

  function GoToAddOldMember() {
    setIsVisible(false);
    stack.navigate('AddOldMember');
  }

  function GoToFairCalculation() {
    stack.navigate('FairCalculation');
  }

  function GoToMenu() {
    stack.navigate('Back');
  }

  function GoToMyDetails() {
    stack.navigate('MyDetails', {userId: selectedId, userAmount: amount});
  }

  function GoToRequestQR() {
    stack.navigate('RequestQR');
  }

  function GoToTransaction() {
    stack.navigate('Transactions', {userId: selectedId, userAmount: amount});
  }

  function GoToFundTransfer() {
    stack.navigate('FundTransfer');
  }

  return (
    <View style={styles.container}>
      <Image
        style={{width: '100%', height: '100%', position: 'absolute'}}
        source={require('../../assets/img/app_background.png')}
        resizeMode="cover"
      />
      <Modal
        visible={isLogging}
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
      <Modal visible={isVisible} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              height: '80%',
              width: '90%',
              borderRadius: 30,
            }}>
            <View
              style={{marginTop: 20, alignItems: 'flex-end', marginRight: 30}}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Icon name="close" color={'black'} size={25} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: '#3b3a69',
                fontSize: 22,
                fontWeight: '600',
                marginTop: 20,
                marginBottom: 30,
                textAlign: 'center',
                marginHorizontal: 30,
              }}>
              Welcome !
            </Text>

            <View style={{flex: 1, marginBottom: 50}}>
              <SafeAreaView>
                <ScrollView>
                  <Text
                    style={{
                      color: 'black',
                      marginHorizontal: 40,
                      fontSize: 18,
                      textAlign: 'center',
                    }}>
                    If you are want create bus pass
                  </Text>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={GoToAddMembers}>
                      <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Create a pass</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: 'black',
                      marginHorizontal: 40,
                      fontSize: 18,
                      textAlign: 'center',
                      marginTop: 30,
                    }}>
                    {'OR\n\n'}Add an existing user
                  </Text>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={GoToAddOldMember}>
                      <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Add a member</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: 'red',
                      marginHorizontal: 40,
                      fontSize: 16,
                      textAlign: 'center',
                      marginTop: 30,
                    }}>
                    {'*NOTE:- '} Lorem ipsum, dolor sit amet consectetur
                    adipisicing elit. Ipsa, reprehenderit obcaecati incidunt est
                    impedit porro repellat harum optio, sapiente ipsam animi
                    repudiandae, in cumque minima quod sequi rem veritatis
                    libero?
                  </Text>
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.settingsIcon} onPress={GoToMenu}>
        <Icon name="settings-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={{flexDirection: 'row', marginTop: 100, height: 50}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'white',
            borderRadius: 10,
            marginLeft: 20,
            elevation: 5,
          }}>
          <Text style={styles.headerTextHi}>Hi !</Text>
          <RoutesMenu
            nameArray={names}
            placeHolder={previousSelectedId}
            setOnChange={(selectedText: any) => setSelectedId(selectedText)}
            setLogin={setIsLogging}
          />
        </View>

        <View style={{flex: 1}}></View>
      </View>

      <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.headerText}>Your Balance</Text>
          <TouchableOpacity style={{flex: 1}} onPress={HandleRefresh}>
            <Icon
              name="refresh-outline"
              size={22}
              color="black"
              style={styles.refreshIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceText}>Rs. {amount + '.00'}</Text>
        <Text style={styles.balanceTimeText}>
          Last update: {currentTime + ' ' + currentDate}
        </Text>
      </View>
      <View style={styles.rectangle}>
        <SafeAreaView style={{marginTop: 35}}>
          <ScrollView>
            <View style={styles.content}>
              <View>
                <Text style={styles.searchHeaderText}>
                  Where would you like to go?
                </Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="search-outline"
                    size={20}
                    color="black"
                    style={styles.iconcontainer}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Search here..."
                    value={searchedName}
                    onChangeText={setSearchedName}
                    placeholderTextColor={'#7d7d85'}
                    cursorColor={'#606066'}
                  />
                </View>
              </View>
              <Text style={styles.searchHeaderText}>Quick Access</Text>
              <View
                style={{
                  borderBottomColor: '#bbc4c9',
                  borderBottomWidth: 1,
                  width: '100%',
                }}
              />
              <View style={styles.menuContainer}>
                <View style={styles.menuContainer1}>
                  <View style={styles.menuItem}>
                    <TouchableOpacity onPress={GoToReload}>
                      <Icon
                        name="card-outline"
                        size={48}
                        color="white"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menuItem}>
                    <TouchableOpacity onPress={() => setIsVisible(true)}>
                      <Icon
                        name="person-add-outline"
                        size={45}
                        color="white"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menuItem}>
                    <TouchableOpacity onPress={GoToFundTransfer}>
                      <Icon
                        name="cash-outline"
                        size={48}
                        color="white"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.menuContainer2}>
                  <Text style={styles.menuIconText}>Reload</Text>
                  <Text style={styles.menuIconText}>Add Members</Text>
                  <Text style={styles.menuIconText}>Fund Transfer</Text>
                </View>
                <View style={styles.menuContainer1}>
                  <View style={styles.menuItem}>
                    <TouchableOpacity onPress={GoToFairCalculation}>
                      <Icon
                        name="calculator-outline"
                        size={48}
                        color="white"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menuItem}>
                    <TouchableOpacity onPress={GoToTransaction}>
                      <Icon
                        name="receipt-outline"
                        size={48}
                        color="white"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menuItem}>
                    <TouchableOpacity onPress={GoToMyDetails}>
                      <Icon
                        name="person-outline"
                        size={48}
                        color="white"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.menuContainer2}>
                  <Text style={styles.menuIconText}>Fair Calculation</Text>
                  <Text style={styles.menuIconText}>Transaction History</Text>
                  <Text style={styles.menuIconText}>My Details</Text>
                </View>
                <View style={styles.menuContainer1}>
                  <View style={styles.menuItem3}></View>
                  <View style={styles.menuItem}>
                    <TouchableOpacity onPress={GoToRequestQR}>
                      <Icon
                        name="qr-code-outline"
                        size={48}
                        color="white"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menuItem3}></View>
                </View>
                <View style={styles.menuContainer2}>
                  <Text style={styles.menuIconText}></Text>
                  <TouchableOpacity onPress={GoToRequestQR}>
                  <Text style={styles.menuIconText}>Get A new QR</Text>
                  </TouchableOpacity>
                  <Text style={styles.menuIconText}></Text>
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

const styles = StyleSheet.create({
  rectangle: {
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    backgroundColor: '#FFFFFF',
    flex: 2,
  },
  content: {
    marginTop: 50,
    marginBottom: 150,
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#d5dade',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  searchHeaderText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    fontWeight: '700',
    textAlign: 'left',
  },
  headerContainer: {
    backgroundColor: 'white',
    marginBottom: 0,
    marginHorizontal: 40,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1,
    top: 30,
  },
  headerTextHi: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginTop: 15,
    color: 'black',
    fontWeight: '700',
    textAlign: 'left',
    marginLeft: 20,
  },
  headerText: {
    flex: 2,
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    marginTop: 15,
    color: 'black',
    fontWeight: '700',
    textAlign: 'right',
  },
  refreshIcon: {
    flex: 1,
    marginTop: 15,
    textAlign: 'left',
    marginLeft: 10,
  },
  balanceText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 28,
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
  },
  balanceTimeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    marginBottom: 20,
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
  },
  menuContainer: {
    marginTop: 30,
  },
  menuContainer1: {
    flexDirection: 'row',
    height: 80,
  },
  menuContainer2: {
    flexDirection: 'row',
    height: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  menuItem: {
    flex: 1,
    backgroundColor: '#827af0',
    borderRadius: 10,
    elevation: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  menuItem3: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  icon: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  menuIconText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(18, 149, 21,1)',
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 80,
  },
});

export default Home;
