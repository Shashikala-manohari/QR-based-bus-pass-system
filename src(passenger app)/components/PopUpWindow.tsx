import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';

const PopupWindow = (p:any) => {
    const[isPressed,setIsPressed]=useState(false);
  const [modalVisible, setModalVisible] = useState(p.setState);

  console.log(modalVisible);
  console.log('flag '+p.setState);

  return (
    <View style={styles.container}>
    <View style={styles.button}>
        <Button title="Send verification Email" disabled={isPressed} onPress={() => setIsPressed(true)} />
    </View>
    
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{'The verification link was send to your email'}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // semi-transparent background
    
  },
  modalView: {
    backgroundColor: '#dce5fa',
    borderRadius: 20,
    width:360,
    height:150,
    alignItems: 'center',
    elevation: 5,

  },
  modalText: {
    fontSize:16,
    marginTop:25,
    marginBottom: 25,
    textAlign: 'center',
    color:'black'
  },
  button:{
    marginRight:30,
    top:10,
    
  },
});

export default PopupWindow;
