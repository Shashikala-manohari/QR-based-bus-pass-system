import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';

const NavigationBar = (a: any) => {
  const stack = a.stack;

  function GoToHome(){
    stack.navigate('Home');
  }

  function GoToReloadByCard(){
    stack.navigate('Reload');
  }

  function GoToSearch(){
    stack.navigate('Home');
  }

  function GoToProfile(){
    stack.navigate('FairCalculation');
  }

  return (
    <View
      style={styles.container}>
      {a.routeName == 'Home' ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToHome}>
            <Icon name="home" size={25} color="#a297a6" />
            <Text style={{color: '#a297a6', right: '14%', fontSize: 14}}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToHome}>
            <Icon name="home" size={25} color="#b449de" />
            <Text style={{color: '#b449de', right: '14%', fontSize: 14}}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {a.routeName == 'Reload' ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToReloadByCard}>
            <Icon name="card" size={25} color="#a297a6" />
            <Text style={{color: '#a297a6', right: '22%', fontSize: 14}}>
              Reload
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToReloadByCard}>
            <Icon name="card" size={25} color="#b449de" />
            <Text style={{color: '#b449de', right: '22%', fontSize: 14}}>
              Reload
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {a.routeName == 'Search' ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToSearch}>
            <Icon name="search-filed" size={25} color="#a297a6" />
            <Text style={{color: '#a297a6', right: '22%', fontSize: 14}}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToSearch}>
            <Icon name="search" size={25} color="#b449de" />
            <Text style={{color: '#b449de', right: '22%', fontSize: 14}}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {a.routeName == 'Profile' ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToProfile}>
            <Icon name="subway" size={25} color="#a297a6" />
            <Text style={{color: '#a297a6', right: '22%', fontSize: 14}}>
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={GoToProfile}>
            <Icon name="subway" size={25} color="#b449de" />
            <Text style={{color: '#b449de', right: '22%', fontSize: 14}}>
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    height: 85,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default NavigationBar;
