import React, {useCallback, useContext, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {ScreenProps} from '../../../../App';
import Layout from '../../../components/Layout';
import NotificationItem from '../../../components/NotificationItem';
import Subheader from '../../../components/Subheader';
import {useIsFocused} from '@react-navigation/native';
import {fetchNotifications} from '../../../contexts/User';
import {AuthContext} from '../../../../context';

const Notifications: React.FC<ScreenProps<'Notifications'>> = ({
  navigation,
}) => {
  const isFocused = useIsFocused();
  const {signOut} = useContext(AuthContext);

  const logOutUser = useCallback(async () => {
    await signOut();
  }, [signOut]);

  useEffect(() => {
    try {
      (async () => {
        const response = await fetchNotifications();
        if (response === 401) {
          Alert.alert('Info', 'Your session has timed out, please login again');
          await logOutUser();
          return;
        }
        console.log(response);
      })();
    } catch (error: any) {
      console.log(error);
    }
  }, [logOutUser, isFocused]);
  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Notifications" goBack={navigation.goBack} />
        <NotificationItem />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

export default Notifications;
