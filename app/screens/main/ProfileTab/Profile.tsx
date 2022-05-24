import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';

const Profile: React.FC<ScreenProps<'Profile'>> = () => {
  return (
    <View style={[styles.main]}>
      <Text>Profile Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    backgroundColor: StyleGuide.Colors.white,
  },
});

export default Profile;
