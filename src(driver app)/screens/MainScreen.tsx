import {View, Text, StyleSheet, Image, FlatList, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {auth, db} from '../../firebase/firebaseInitUsers';
import NavigationBar from '../components/NavigationBar';
import Icon from 'react-native-vector-icons/Ionicons';

const MainScreen = (a: any) => {
  const stack = a.navigation;
  const {scannerOn, flashOn, dataName, dataValue} = a.route.params;

  const email = auth.currentUser?.email;
  const [names, setnames] = useState<string[]>([]);

  useEffect(()=>{
    async function GetBusName(userEmail: any) {
      const snapshot = await getDocs(
        query(collection(db, 'Users'), where('email', '==', userEmail)),
      );
      const namesArray = snapshot.docs.map(doc => doc.data().bus_name);
      setnames(namesArray);
    }
    GetBusName(email);
  },[email])

 

 

  return (
    <View style={sty.container}>
      <Image
        style={sty.login_img}
        source={require('../../assets/img/bus1.jpg')}
        resizeMode="cover"
      />

      <HeaderSection name={names} stack={stack} />

      <MainSection
        u_email={email}
        stack={stack}
        name={names}
        dataName={dataName}
        dataValue={dataValue}
      />

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

function TransactionTable(p: any) {
  const [scanned, setScanned] = useState(false);

  return (
    <View>
      <View
        style={{
          backgroundColor: 'rgba(255, 255,255 , 0.9)',
          height: 490,
          marginTop:30,
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 20,
          elevation: 5,
        }}>
        <Text
          style={{
            color: 'green',
            fontSize: 22,
            fontWeight: '800',
            textAlign: 'center',
            marginTop: 30,
          }}>
          Transactions
        </Text>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: '600',
                textAlign: 'center',
                marginTop: 20,
                marginLeft: 10,
              }}>
              User
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: '600',
                textAlign: 'center',
                marginTop: 20,
              }}>
              Amount
            </Text>
          </View>
        </View>

        <SafeAreaView>
          <View style={{flexDirection: 'row', height: 350}}>
            <View style={{flex: 2, marginLeft: 20}}>
              <FlatList
                data={p.dataName}
                renderItem={({item}) => RenderedItem(item)}
                style={{flex: 2}}
              />
            </View>

            <View style={{flex: 1}}>
              <FlatList
                data={p.dataValue}
                renderItem={({item}) => RenderedItem(item)}
                style={{flex: 1}}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

function RenderedItem(item: any) {
  return (
    <Text
      style={{
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 20,
      }}>
      {item}
    </Text>
  );
}

function HeaderSection(p: any) {
  const busName = p.name;
  const stack = p.stack;

  function GoToMenu() {
    stack.navigate('Back');
  }

  return (
    <View style={sty.headerContainer}>
      <View style={sty.headerContent1}>
        <View style={sty.headerNotification}>
          <TouchableOpacity>
            <Icon name="notifications" size={40} color="black" />
          </TouchableOpacity>
        </View>
        <View style={sty.headerName}>
          <TouchableOpacity>
           <Text style={sty.headerText}>{busName}</Text>
          </TouchableOpacity>
        </View>

        <View style={sty.headerMenu}>
          <TouchableOpacity onPress={GoToMenu}>
            <Icon name="menu" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function MainSection(p: any) {
  const stack = p.stack;

  return (
    <View style={sty.main_view}>
      <TransactionTable dataName={p.dataName} dataValue={p.dataValue} />
    </View>
  );
}

const sty = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flexDirection: 'row',
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
    marginTop: 70,
    marginLeft: 20,
    flex: 1,
  },
  camera: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#0390fc',
    top: 20,
    marginRight: 20,
  },
  main_view: {
    marginTop: 20,
  },
  main_view01: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 40,
  },
  main_view02: {
    backgroundColor: '#2c6bc9',
    borderRadius: 20,
    height: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 100,
  },
  main_view03: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 50,
  },
  main_view04: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 20,
  },
  main_view05: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 20,
    marginBottom: 50,
  },
  main_btn01: {
    fontSize: 25,
    fontWeight: '700',
    color: '#0390fc',
    marginLeft: 40,
    left: 20,
  },
  main_btn02: {
    fontSize: 25,
    fontWeight: '700',
    color: 'white',
    marginLeft: 20,
    left: 70,
  },
  main_btn03: {
    fontSize: 25,
    fontWeight: '700',
    color: '#0390fc',
    marginLeft: 40,
    left: 10,
  },
  main_btn04: {
    fontSize: 25,
    fontWeight: '700',
    color: '#0390fc',
    marginLeft: 40,
    left: 10,
  },
  main_btn05: {
    fontSize: 25,
    fontWeight: '700',
    color: '#0390fc',
    marginLeft: 40,
    left: 30,
  },
  reload_card: {
    flex: 1,
    backgroundColor: '#e6e6f7',
    height: 180,
    marginTop: 40,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 15,
    shadowColor: '#192f4d',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.75,
    shadowRadius: 20,
    textShadowColor: 'black',
    elevation: 60,
  },
  reload_text01: {
    color: '#020a14',
    elevation: 50,
    textShadowColor: 'blue',
    left: 60,
    top: 20,
    fontSize: 22,
  },
  reload_text02: {
    color: '#6161ed',
    left: 20,
    top: 35,
    fontSize: 45,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.75,
    shadowRadius: 20,
    textShadowColor: 'black',
    elevation: 60,
  },
  reload_text03: {
    color: 'black',
    left: 160,
    top: 50,
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  headerContainer: {
    height: 80,
  },
  headerContent2: {
    flex: 3,
  },
  headerContent1: {
    flexDirection: 'row',
  },
  headerMenu: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 30,
    marginTop: 30,
  },
  headerNotification: {
    flex: 1,
    marginLeft: 30,
    marginTop: 30,
  },
  headerName: {
    flex: 1,
    marginTop: 40,
  },
  headerText:{
textAlign:'center',
color:'black',
fontSize:20,
fontWeight:'800',
  },
 
});

export default MainScreen;
