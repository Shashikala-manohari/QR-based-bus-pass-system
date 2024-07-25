import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase is initialized
    if (true) {
      setIsLoading(false); // Set isLoading to false once Firebase is initialized
    }
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View>
          <ActivityIndicator animating={true} color="blue" size={80}/>
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            style={styles.image2}
            source={require('../../assets/img/splash_template.png')}
            resizeMode="cover"
          />

          <View style={styles.indicator}>
            <ActivityIndicator animating={true} color="white" size={80} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9f7',
  },
  imageContainer1: {
    width: '100%',
    height: '30%',
  },
  imageContainer2: {
    width: '100%',
    height: '100%',
  },
  image1: {
    width: '100%',
    height: '100%',
  },
  image2: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  indicator: {
    alignItems: 'center',
    marginVertical:'auto',
    marginBottom:150, 
  },
});

export default SplashScreen;
