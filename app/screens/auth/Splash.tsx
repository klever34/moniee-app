import React from 'react';
import {View, StyleSheet} from 'react-native';
import StyleGuide from '../../assets/style-guide';

const Splash: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../../assets/images/shara_green.png')}
        style={styles.image}
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
    width: '80%',
    resizeMode: 'contain',
  },
});

export default Splash;
