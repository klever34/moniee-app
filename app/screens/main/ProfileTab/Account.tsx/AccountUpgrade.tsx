import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenProps} from '../../../../../App';
import Layout from '../../../../components/Layout';
import MenuIcon from '../../../../components/MenuIcon';
import Subheader from '../../../../components/Subheader';

const AccountUpgrade: React.FC<ScreenProps<'AccountUpgrade'>> = ({
  navigation,
}) => {
  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Account Upgrade" goBack={navigation.goBack} />
        <MenuIcon
          title="Tier 2"
          description="Govt. Issued ID"
          image={require('../../../../assets/images/award.png')}
          onPress={() => navigation.push('GovtID')}
        />
        <MenuIcon
          title="Tier 3"
          description="Residential Address, Bank Statement"
          image={require('../../../../assets/images/crown.png')}
          onPress={() => navigation.push('TierList')}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

export default AccountUpgrade;
