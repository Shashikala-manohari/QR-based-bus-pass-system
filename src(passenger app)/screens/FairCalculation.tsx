import {
  DocumentData,
  collection,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {db1} from '../../firebase/firebaseInitRouts';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import HandlePay from '../components/RouteCharges';
import NavigationBar from '../components/navigationBar';
import {auth} from '../../firebase/firebaseinitPassengers';
import {db4} from '../../firebase/firebaseinitLocation';

const FairCalculation = (a: any) => {
  const stack = a.navigation;
  const [charge, setCharge] = useState(0);
  const [routeData, setRouteData] = useState<{[x: string]: string[]}[]>([]);
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [allStops, setAllStops] = useState<string[]>([]);
  const [filteredDepartureStops, setFilteredDepartureStops] = useState<
    string[]
  >([]);
  const [filteredArrivalStops, setFilteredArrivalStops] = useState<string[]>(
    [],
  );
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [busDetails, setBusDetails] = useState<BusDetails[]>([]);
  const [isLoading, setIsLoding] = useState(false);
  interface BusDetails {
    route: string;
    busNo: string;
    stoppedLoc: string;
  }

  useEffect(() => {
    const fetchBusStops = async () => {
      let stops: string[] = [];
      const snapshot = await getDocs(collection(db1, 'Routes'));
      const RouteData = snapshot.docs.map(doc => ({
        [doc.id]: Object.keys(doc.data()),
      }));
      setRouteData(RouteData);
      snapshot.docs.forEach(doc => {
        const routeData = doc.data();
        Object.keys(routeData).forEach(stop => {
          stops.push(stop);
        });
      });
      stops = Array.from(new Set(stops));
      setAllStops(stops);
    };
    fetchBusStops();
  }, []);

  const filterStops = (text: any, type: any) => {
    if (type === 'departure') {
      const filtered = allStops.filter(stop =>
        stop.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredDepartureStops(filtered);
    } else {
      let stops: string[] = [];

      routeData.forEach(route => {
        const array = Object.values(route)[0];
        const matchingStop = array.some(
          stop => stop.split('_')[1] === departure.split('_')[1],
        );
        if (matchingStop) {
          stops.push(...array);
        }
      });
      stops = Array.from(new Set(stops));
      const filtered = stops.filter(stop =>
        stop.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredArrivalStops(filtered);
    }
  };

  const handleDepartureSelection = (item: any) => {
    setDeparture(item);
    setFilteredDepartureStops([]);
  };

  const handleArrivalSelection = (item: any) => {
    setArrival(item);
    setFilteredArrivalStops([]);
  };

  const handleSearch = async () => {
    let selectedRouteNames: string[] = [];
    setBusDetails([]);
    routeData.forEach(route => {
      let flag1 = false;
      let flag2 = false;
      const array = Object.values(route)[0];
      array.forEach(stop => {
        if (stop.split('_')[1] === departure.split('_')[1]) {
          flag1 = true;
          setDeparture(stop);
        }
        if (stop.split('_')[1] === arrival.split('_')[1]) {
          flag2 = true;
          setArrival(stop);
        }
        if (flag1 && flag2) {
          selectedRouteNames.push(Object.keys(route)[0]);
          return;
        }
      });
    });
    const charge = await HandlePay(departure, arrival);
    setCharge(charge);
    selectedRouteNames = Array.from(new Set(selectedRouteNames));
    setRouteNames(selectedRouteNames);
    selectedRouteNames.forEach(route => {
      PossibleRoutes(route.split('_')[1]);
    });
  };

  async function PossibleRoutes(route: string) {
    setIsLoding(true);
    const getRef = await getDocs(
      query(collection(db4, 'Buses'), where('route', '==', route)),
    );
    if(!getRef.empty){
      getRef.forEach(doc => {
        setBusDetails(prevBusDetails => [
          {
            route: route,
            busNo: doc.data().registation_no,
            stoppedLoc: doc.data().stopped_location,
          },
          ...prevBusDetails,
        ]);
      });
    }
    
    setIsLoding(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fair Calulation</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input}
          placeholder="Thorana Junction"
          value={departure.split('_')[1]}
          onChangeText={text => {
            setDeparture(text);
            filterStops(text, 'departure');
          }}
        />
        <FlatList
          data={filteredDepartureStops}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleDepartureSelection(item)}>
              <Text style={styles.inputText}>{item.split('_')[1]}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
        />
        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          placeholder="Tyre Junction"
          value={arrival.split('_')[1]}
          onChangeText={text => {
            setArrival(text);
            filterStops(text, 'arrival');
          }}
        />
        <FlatList
          data={filteredArrivalStops}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleArrivalSelection(item)}>
              <Text style={styles.inputText}>{item.split('_')[1]}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
        />
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>SEARCH</Text>
      </TouchableOpacity>

      <View style={styles.ticketPrice}>
        <Text style={styles.ticketText}>Bus Ticket</Text>
        <Text style={styles.ticketText}>
          From {departure.split('_')[1]} To {arrival.split('_')[1]}
        </Text>
        <Text style={styles.ticketText}>Rs. {charge}.00 Average</Text>
        <Text style={styles.ticketText}>Possible routes: </Text>
        {isLoading ? (
          <View style={{}}>
            <ActivityIndicator animating={true} color="white" size={80} />
          </View>
        ) : (
          <ScrollView>
            <SafeAreaView>
              <View style={{}}>
                {busDetails.map((bus, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 5,
                      height: 80,
                      justifyContent: 'center',
                      marginVertical: 10,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.routeText}>{bus.route}</Text>

                      <View style={{flex: 2, flexDirection: 'column'}}>
                        <Text style={styles.inputText1}>
                          Bus No:{bus.busNo}
                        </Text>
                        <Text style={styles.inputText1}>
                          Current stop:{'\n'+bus.stoppedLoc}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </SafeAreaView>
          </ScrollView>
        )}
      </View>

      <NavigationBar routeName={a.route.name} stack={stack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0074D9', // Blue background color
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: 'black',
  },
  searchButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: '#0074D9',
    fontWeight: 'bold',
  },
  ticketPrice: {
    backgroundColor: '#0074D9',
    padding: 16,
    borderRadius: 8,
  },

  ticketText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  inputText: {
    color: 'black',
    fontSize: 16,
  },
  inputText1: {
    marginHorizontal: 5,
    color: 'black',
    fontSize: 14,
  },
  routeText: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
    fontSize: 36,
  },
  navigationIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default FairCalculation;
