import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenProps} from '../../../../../App';
import Layout from '../../../../components/Layout';
import MenuIcon from '../../../../components/MenuIcon';
import Subheader from '../../../../components/Subheader';

const CustomerCare: React.FC<ScreenProps<'CustomerCare'>> = ({navigation}) => {
  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Customer Care" goBack={navigation.goBack} />
        <MenuIcon
          title="FAQs"
          image={require('../../../../assets/images/search.png')}
        />
        <MenuIcon
          title="Chat with Us"
          image={require('../../../../assets/images/chat.png')}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

export default CustomerCare;
