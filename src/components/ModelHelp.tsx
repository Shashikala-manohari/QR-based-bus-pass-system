import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const ModelHelp = (p:any) => {
    const [isVisible, setIsVisible] = useState(true);

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            height: '80%',
            width: '90%',
            borderRadius: 30,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 5,
                color: 'black',
                fontSize: 18,
                fontWeight: '600',
                marginLeft: 30,
                marginTop: 30,
                marginBottom: 30,
                textAlign: 'center',
              }}>
              Instructions
            </Text>
            <View style={{flex: 1, marginTop: 10}}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Icon name="close" color={'black'} size={25} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 1, marginBottom: 50}}>
            <SafeAreaView>
              <ScrollView>
                <Text
                  style={{color: 'black', marginHorizontal: 30, fontSize: 26}}>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Atque, saepe impedit? Dicta vero earum laborum, optio vitae
                  voluptas ea sequi voluptatem hic, ab quibusdam nam quae
                  incidunt aliquid odit dignissimos. Lorem ipsum, dolor sit amet
                  consectetur adipisicing elit. Atque, saepe impedit? Dicta vero
                  earum laborum, optio vitae voluptas ea sequi voluptatem hic,
                  ab quibusdam nam quae incidunt aliquid odit dignissimos. Lorem
                  ipsum, dolor sit amet consectetur adipisicing elit. Atque,
                  saepe impedit? Dicta vero earum laborum, optio vitae voluptas
                  ea sequi voluptatem hic, ab quibusdam nam quae incidunt
                  aliquid odit dignissimos. Lorem ipsum, dolor sit amet
                  consectetur adipisicing elit. Atque, saepe impedit? Dicta vero
                  earum laborum, optio vitae voluptas ea sequi voluptatem hic,
                  ab quibusdam nam quae incidunt aliquid odit dignissimos. Lorem
                  ipsum, dolor sit amet consectetur adipisicing elit. Atque,
                  saepe impedit? Dicta vero earum laborum, optio vitae voluptas
                  ea sequi voluptatem hic, ab quibusdam nam quae incidunt
                  aliquid odit dignissimos.
                </Text>
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModelHelp;
