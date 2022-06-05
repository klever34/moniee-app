import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenProps} from '../../../../../../App';
import Layout from '../../../../../components/Layout';
import MenuIcon from '../../../../../components/MenuIcon';
import Subheader from '../../../../../components/Subheader';

const TierList: React.FC<ScreenProps<'TierList'>> = ({navigation}) => {
  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Tier 3" goBack={navigation.goBack} />
        <MenuIcon
          title="Residential Address"
          image={require('../../../../../assets/images/location.png')}
          onPress={() => navigation.push('ResidentialAddress')}
        />
        <MenuIcon
          title="Bank Statement"
          image={require('../../../../../assets/images/chart.png')}
          onPress={() => navigation.push('BankStatement')}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

export default TierList;
