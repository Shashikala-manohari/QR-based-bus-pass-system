import {
  View,
  Text,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  FieldPath,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {db1} from '../../firebase/firebaseInitRouts';
import {auth, db} from '../../firebase/firebaseInitUsers';
import NavigationBar from '../components/NavigationBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YourComponent = (a: any) => {
  const stack = a.navigation;
  const {scannerOn, flashOn, dataName, dataValue} = a.route.params;
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [isLoading, setIsLoding] = useState(true);
  const [isSort, setISSort] = useState(true);
  const window = useWindowDimensions();
  const [orientation, setOrientation] = useState(
    window.width > window.height ? 'landscape' : 'portrait',
  );

  const handleLayoutChange = () => {
    const newOrientation =
      window.width > window.height ? 'landscape' : 'portrait';
    if (newOrientation !== orientation) {
      setOrientation(newOrientation);
    }
  };

  useEffect(() => {
    const getDataAndFetchNames = async () => {
      try {
        // Get route data
        const getRef = await getDocs(
          query(
            collection(db, 'Users'),
            where('email', '==', auth.currentUser?.email),
          ),
        );

        setSelectedName(getRef.docs[0].data().stopped_location);

        const busRoutes = getRef.docs.map(doc => doc.data().route);
        const busRoute = 'Route_' + busRoutes[0];

        // Fetch names if route is available
        if (busRoute != 'Route_undefined') {
          const snapshot = await getDoc(doc(db1, 'Routes', busRoute));
          const docData: any = snapshot.data();
          const customSortAsd = (a: any, b: any) => {
            const numA = parseInt(a.split('_')[0]);
            const numB = parseInt(b.split('_')[0]);
            return numA - numB;
          };
          const customSortDes = (a: any, b: any) => {
            const numA = parseInt(a.split('_')[0]);
            const numB = parseInt(b.split('_')[0]);
            return numB - numA;
          };
          const namesArray = Object.keys(docData).sort(
            isSort ? customSortAsd : customSortDes,
          );
          setNames(namesArray);
          setIsLoding(false);
        } else {
          GoToBusRegistration();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getDataAndFetchNames();
  }, [isSort]);

  const handleNameSelection = async (name: string) => {
    const getRef = await getDocs(
      query(
        collection(db, 'Users'),
        where('email', '==', auth.currentUser?.email),
      ),
    );
    const locationRef = doc(db, 'Users', getRef.docs[0].id);
    setDoc(locationRef, {stopped_location: name}, {merge: true});
    setSelectedName(name);
  };

  const HandleLeave=async ()=>{
    await AsyncStorage.removeItem('idArray');
  }

  function GoToBusRegistration() {
    stack.navigate('BusReg');
  }

  const SetSort = () => {
    setISSort(!isSort);
  };

  return (
    <View style={styles.container}>
      <Image
        style={{width: '100%', height: '100%', position: 'absolute'}}
        source={require('../../assets/img/signin_background.jpg')}
        resizeMode="cover"
      />
     
        <ScrollView onScroll={handleLayoutChange}>
          <View
            style={
              orientation === 'landscape'
                ? styles.itemContainerLandscape
                : styles.itemContainerPortrait
            }>
            <View style={{flex: 1}}>
              <Text style={styles.headerText}>Your Selected Location</Text>
              <View style={styles.selectedTextView}>
                <Text style={styles.selectedText}>{selectedName.split('_')[1]}</Text>
              </View>
            </View>
            <View style={{flex: 2}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  marginRight: 50,
                  marginLeft: 260,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  elevation: 5,
                }}>
                <Text
                  style={{
                    flex: 1,
                    color: 'black',
                    fontSize: 14,
                    fontWeight: '500',
                    textAlign: 'right',
                    marginRight: 10,
                    marginTop: 5,
                    marginBottom: 5,
                  }}>
                  Sort By{' '}
                </Text>
                <TouchableOpacity onPress={SetSort}>
                  <Icon
                    name="swap-vertical"
                    size={20}
                    color="black"
                    style={{
                      flex: 1,
                      textAlign: 'right',
                      marginRight: 10,
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  />
                </TouchableOpacity>
              </View>
             
              <SafeAreaView >
                <View style={styles.selectorView}>
                {isLoading ? (
                  <ActivityIndicator
                    animating={true}
                    color="#898fe0"
                    size={80}
                    style={{marginTop: '0%'}}
                  />
                ) : (
                  <ScrollView>
                    <RadioButton.Group
                      onValueChange={handleNameSelection}
                      value={selectedName}>
                      {names.map((name, index) => (
                        <View
                          key={index}
                          style={{
                            backgroundColor: '#dce5fa',
                            borderRadius: 20,
                            height: 60,
                            marginHorizontal: 30,
                            marginVertical: 5,
                            justifyContent: 'center',
                            paddingLeft: 20,
                            top: 20,
                            elevation: 5,
                          }}>
                          <RadioButton.Item
                            label={name.split('_')[1]}
                            value={name}
                          />
                        </View>
                      ))}
                    </RadioButton.Group>
                    <View style={{height: 100}}></View>
                  </ScrollView>
                )}
                </View>
              </SafeAreaView>
              <TouchableOpacity onPress={HandleLeave}>
                <View style={{alignItems:'center'}}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>End Journey</Text>
              </View>
              </View>
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    
      
      <NavigationBar
        stack={stack}
        scannerOn={scannerOn}
        flashOn={flashOn}
        dataName={dataName}
        dataValue={dataValue}
        routeName={a.route.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainerPortrait: {
    flexDirection: 'column',
  },
  itemContainerLandscape: {
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 35,
    color: '#6757d4',
    fontWeight: '700',
    marginTop: 50,
    textAlign: 'center',
  },
  selectedText: {
    fontSize: 30,
    color: '#155a82',
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  selectedTextView: {
    backgroundColor: '#ebf4fa',
    height: 80,
    marginTop: 40,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 15,
    elevation: 5,
  },
  selectorView: {
    backgroundColor: 'white',
    height: 500,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    borderRadius: 20,
    elevation: 5,
  },
  buttonContainer: {
    flex:1,
    backgroundColor: 'red',
    borderRadius: 20,
    height: 50,
    justifyContent:'center',
    marginTop:20,
    marginBottom:200,
    width:250,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal:0
  },
});

export default YourComponent;
