import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {ScreenProps} from '../../../../../App';
import Layout from '../../../../components/Layout';
import MenuIcon from '../../../../components/MenuIcon';
import Subheader from '../../../../components/Subheader';
import Intercom from '@intercom/intercom-react-native';
import {APIUserOBJ} from '../Profile';
import {useIsFocused} from '@react-navigation/native';
import {fetchUserInfo} from '../../../../contexts/User';

const CustomerCare: React.FC<ScreenProps<'CustomerCare'>> = ({navigation}) => {
  const [userObj, setUserObj] = useState<APIUserOBJ>();
  const isFocused = useIsFocused();

  useEffect(() => {
    try {
      (async () => {
        const userInfo = await fetchUserInfo();
        setUserObj(userInfo);
      })();
    } catch (error: any) {}
  }, [isFocused]);

  const startIntercom = () => {
    try {
      Intercom.registerIdentifiedUser({
        userId: `234${userObj?.mobile}`,
      });
      Intercom.updateUser({
        name: userObj?.firstName,
        phone: userObj?.mobile,
      });
      Intercom.displayMessenger();
    } catch (error) {}
  };

  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Customer Care" goBack={navigation.goBack} />
        <MenuIcon
          title="FAQs"
          image={require('../../../../assets/images/search.png')}
          onPress={() => Linking.openURL('https://moniee.app/faqs/')}
        />
        <MenuIcon
          title="Chat with Us"
          image={require('../../../../assets/images/chat.png')}
          onPress={() => startIntercom()}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

export default CustomerCare;
