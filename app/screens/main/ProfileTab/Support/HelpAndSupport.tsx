import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenProps} from '../../../../../App';
import Layout from '../../../../components/Layout';
import MenuIcon from '../../../../components/MenuIcon';
import Subheader from '../../../../components/Subheader';

const HelpAndSupport: React.FC<ScreenProps<'HelpAndSupport'>> = ({
  navigation,
}) => {
  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Help & Support" goBack={navigation.goBack} />
        <MenuIcon
          title="Customer Care"
          image={require('../../../../assets/images/headphone.png')}
          onPress={() => navigation.push('CustomerCare')}
        />
        <MenuIcon
          title="Legal"
          image={require('../../../../assets/images/judge.png')}
          onPress={() => navigation.push('Legal')}
        />
        <MenuIcon
          title="Change Log"
          image={require('../../../../assets/images/code.png')}
          onPress={() => navigation.push('ChangeLog')}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

export default HelpAndSupport;
