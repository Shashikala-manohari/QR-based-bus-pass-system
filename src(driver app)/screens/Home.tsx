import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LocSelector from './locSelector';
import {Text} from 'react-native-paper';
import {useState} from 'react';
import Scanner from './Scanner';

const Home = (a: any) => {
  const stack = a.navigation;
  const [location, setLocation] = useState('');
  const [pickup, setpickup] = useState('none');
  const [drop, setDrop] = useState('none');
  const [charge, setCharge] = useState(0.0);
  const [count, setCount] = useState(0);
  const [remainingStops,setRemainningStops]=useState(0);

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
      <View style={{zIndex: 2, alignItems: 'center'}}>
        <Scanner
          location={location}
          pickUp={setpickup}
          drop={setDrop}
          charge={setCharge}
          count={setCount}
        />
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.cont1}>
            <Text style={styles.headerText}>Number of{'\n'}Passengers</Text>
            <Text style={styles.headerText}>Remaining stops</Text>
          </View>
          <View style={styles.cont1}>
            <Text style={styles.headerTextHi}>{count}</Text>
            <Text style={styles.headerTextHi}>{remainingStops}</Text>
          </View>
          <View style={styles.notificationBar}>
            <Text style={styles.notificationText}>
              {pickup + ' - ' + drop + ' : Rs.' + charge}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rectangle}>
        <SafeAreaView style={{marginTop: 30}}>
          <ScrollView>
            <View style={styles.content}>
              <LocSelector loc={setLocation} remainStops={setRemainningStops} stack={stack} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rectangle: {
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    backgroundColor: 'rgba(255,255,255,1)',
    flex: 2,
    marginTop: 30,
    elevation: 5,
  },
  content: {
    marginTop: 0,
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
    top: 20,
    right: 20,
    zIndex: 3,
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
    marginHorizontal: 20,
    marginTop: 0,
    borderRadius: 10,
    height: 150,
    elevation: 5,
    zIndex: 1,
  },
  notificationBar: {
    justifyContent: 'center',
    marginTop: 10,
    height: 30,
    width: '100%',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
  },
  notificationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'black',
    marginHorizontal: 20,
    fontWeight: '800',
  },
  headerContent: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  cont1: {flexDirection: 'row', alignItems: 'center'},
  headerTextHi: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
    color: 'red',
    fontWeight: '700',
    textAlign: 'center',
  },
  headerText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
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
