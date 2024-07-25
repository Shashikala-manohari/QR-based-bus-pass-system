import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Modal} from 'react-native-paper';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {auth, db} from '../../firebase/firebaseInitUsers';
import Icon from 'react-native-vector-icons/Ionicons';

const BalanceScreen = (a: any) => {
  const stack = a.navigation;
  const [busAmount, setBusAmount] = useState(0);
  const [isWithdraw, setIsWithdraw] = useState(false);

  useEffect(() => {
    const getBusDetails = async () => {
      const getRef = await getDocs(
        query(
          collection(db, 'Users'),
          where('email', '==', auth.currentUser?.email),
        ),
      );
      if (!getRef.empty) {
        let amount = getRef.docs[0].data().amount;
        setBusAmount(amount);
      }
    };
    getBusDetails();
  }, []);
  return (
    <View style={styles.container}>
      <Image
        style={{width: '100%', height: '100%', position: 'absolute'}}
        source={require('../../assets/img/app_background.png')}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => {
          stack.navigate('Home');
        }}>
        <Icon name="home-outline" size={20} color="#FFFF" />
      </TouchableOpacity>
      <ScrollView>
        <SafeAreaView>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceCardText}>Your balance</Text>
            <Text style={styles.balanceText}>Rs. {busAmount}.00</Text>
            <TouchableOpacity
              onPress={() => {
                setIsWithdraw(true);
              }}>
              <View style={styles.withdrawBtn}>
                <Text style={styles.withdrawBtnText}>Withdraw</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.historyContainer}>
            <Text style={styles.historyText}>Withdrawal History</Text>
            <View>
              <Text style={styles.historydataText}>No data</Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <Modal visible={isWithdraw}>
        <View style={styles.model}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              setIsWithdraw(false);
            }}>
            <Icon name="close" size={25} color="black"/>
          </TouchableOpacity>
          <Text style={styles.historydataText}>Minimum withdrawal balance is Rs. 5000.00</Text>
        </View>
      </Modal>
    </View>
  );
};

export default BalanceScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  settingsIcon: {
    marginVertical: 20,
    marginHorizontal: 30,
    alignItems:'flex-end'
  },
  closeIcon: {
    marginVertical: 20,
    marginHorizontal: 30,
    alignItems:'flex-end'
  },
  balanceCard: {
    backgroundColor: 'white',
    height: 210,
    marginHorizontal: 30,
    marginVertical: 20,
    borderRadius: 20,
    elevation: 5,
  },
  balanceCardText: {
    color: 'black',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 24,
    fontWeight: '800',
  },
  balanceText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 24,
    marginTop: 10,
  },
  withdrawBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20,100,250,1)',
    height: 50,
    marginHorizontal: 100,
    borderRadius: 30,
    marginTop: 20,
    elevation: 5,
  },
  withdrawBtnText: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '500',
  },
  historyContainer: {
    backgroundColor: 'white',
    height: 500,
    marginHorizontal: 30,
    marginVertical: 20,
    borderRadius: 20,
    marginTop: 20,
    elevation: 5,
  },
  historyText: {
    color: 'black',
    textAlign: 'left',
    marginTop: 30,
    marginLeft: 30,
    fontSize: 18,
    fontWeight: '800',
  },
  historydataText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 200,
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal:30,
  },
  model: {
    backgroundColor: 'white',
    height: '90%',
    marginHorizontal: 20,
    borderRadius: 20,
  },
});
