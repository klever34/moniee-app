import React from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {ScreenProps} from '../../../../../App';
import Layout from '../../../../components/Layout';
import MenuIcon from '../../../../components/MenuIcon';
import Subheader from '../../../../components/Subheader';

const Legal: React.FC<ScreenProps<'Legal'>> = ({navigation}) => {
  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Legal" goBack={navigation.goBack} />
        <MenuIcon
          title="Terms of Use"
          image={require('../../../../assets/images/document.png')}
          onPress={() => Linking.openURL('https://moniee.app/terms/')}
        />
        <MenuIcon
          title="Privacy Policy"
          image={require('../../../../assets/images/barcode.png')}
          onPress={() => Linking.openURL('https://moniee.app/privacy')}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

export default Legal;
