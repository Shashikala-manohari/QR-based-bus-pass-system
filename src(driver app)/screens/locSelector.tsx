import {
  View,
  Text,
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {db1} from '../../firebase/firebaseInitRouts';
import {auth, db} from '../../firebase/firebaseInitUsers';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RadioButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import {Speak} from './Voice';
import { db4 } from '../../firebase/firebaseinitLocation';

const LocSelector = (a: any) => {
  const stack = a.stack;
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [isLoading, setIsLoding] = useState(true);
  const [isSort, setISSort] = useState(true);
  const window = useWindowDimensions();
  const [orientation, setOrientation] = useState(
    window.width > window.height ? 'landscape' : 'portrait',
  );
  const [busDocId, setBusDocId] = useState('');
  const [busId, setBusId] = useState('');
  const currentStopIndex = names.indexOf(selectedName);
  const progress = names.length > 0 ? currentStopIndex / (names.length - 1) : 0;
  a.remainStops(names.length-currentStopIndex-1);

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
        setBusDocId(getRef.docs[0].id);
        setBusId(getRef.docs[0].data().registation_no);

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
    setSelectedName(name);
    let locationRemainderMessage =
      'Hello Passengers, ' + 'Now your in ' + name.split('_')[1] + ' bus stop.';
    Speak(locationRemainderMessage);
    const locationRef = doc(db4, 'Buses', busId);
    setDoc(locationRef, {stopped_location: name.split('_')[1]}, {merge: true});
    a.loc(name);
  };

  const HandleLeave = async () => {
    await AsyncStorage.removeItem('idArray');
  };

  function GoToBusRegistration() {
    stack.navigate('BusReg');
  }

  const SetSort = () => {
    setISSort(!isSort);
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Text style={styles.progressText}>{selectedName.split('_')[1]}</Text>
        <View style={styles.progressBar}>
          <Progress.Bar
            progress={progress}
            width={null}
            height={3}
            color="black"
            borderWidth={0}
            borderColor="black"
            unfilledColor="black"
          />
          <View
            style={[
              styles.busIcon,
              {
                left: `${progress * 100}%`,
                transform: [{translateX: -8}],
              },
            ]}>
            <Icon name="bus-side" size={30} color="#43416b" />
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: 100,
          backgroundColor: 'white',
          borderRadius: 10,
          elevation: 5,
          marginLeft: 10,
        }}>
        <Text
          style={{
            flex: 1,
            color: 'black',
            fontSize: 14,
            fontWeight: '500',
            textAlign: 'center',
            marginVertical: 5,
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
              marginVertical: 5,
            }}
          />
        </TouchableOpacity>
      </View>

      <SafeAreaView>
        <View style={styles.selectorView}>
          {isLoading ? (
            <View style={{marginTop: '50%'}}>
              <ActivityIndicator animating={true} color="#898fe0" size={80} />
            </View>
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
                    <RadioButton.Item label={name.split('_')[1]} value={name} />
                  </View>
                ))}
              </RadioButton.Group>
              <View style={{height: 100}}></View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>

      <TouchableOpacity onPress={HandleLeave}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>End Journey</Text>
          </View>
        </View>
      </TouchableOpacity>
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
  progressBar: {
    position: 'relative',
    width: '80%',
    height: 20,
    marginTop: 5,
  },
  busIcon: {
    position: 'absolute',
    top: -20,
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
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
    borderRadius: 20,
    elevation: 20,
  },
  progressBarContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
    elevation: 5,
    marginHorizontal: 10,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#6d6a9e',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 200,
    width: 250,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 0,
  },
});

export default LocSelector;
