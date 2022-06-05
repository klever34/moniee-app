import React from 'react';
import {View, StyleSheet, Platform, Text} from 'react-native';
import {ScreenProps} from '../../../../../App';
import StyleGuide from '../../../../assets/style-guide';
import {scaledSize} from '../../../../assets/style-guide/typography';
import Layout from '../../../../components/Layout';
import Subheader from '../../../../components/Subheader';

const ChangeLog: React.FC<ScreenProps<'ChangeLog'>> = ({navigation}) => {
  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Change log" goBack={navigation.goBack} />
        <View>
          <Text style={styles.headerText}>Gift cards now available!</Text>
          <Text style={styles.subText}>Version 1.02</Text>
          <Text style={[styles.subText, {fontSize: scaledSize(10)}]}>
            Gift cards now available for purchase
          </Text>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  headerText: {
    fontSize: scaledSize(14),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.shades.blue[300],
    marginVertical: 5,
  },
  subText: {
    fontSize: scaledSize(14),
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[25],
    marginVertical: 5,
  },
});

export default ChangeLog;
