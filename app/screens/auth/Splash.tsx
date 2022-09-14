import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import StyleGuide from '../../assets/style-guide';
// import LottieView from 'lottie-react-native';

const Splash: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/new-logo.png')}
        style={styles.image}
      />
      {/* <LottieView
        source={require('../../assets/animations/logo_animation.json')}
        autoPlay
        loop
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: StyleGuide.Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: '70%',
    resizeMode: 'contain',
  },
});

export default Splash;
