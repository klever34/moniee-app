import React, {useCallback, useContext, useEffect, useState} from 'react';
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
  const [notifications, setNotifications] = useState([]);

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
        setNotifications(response);
      })();
    } catch (error: any) {
      console.log(error);
    }
  }, [logOutUser, isFocused]);
  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Notifications" goBack={navigation.goBack} />
        {notifications.map((item: any, index) => (
          <NotificationItem
            key={index}
            amount={item.meta.amount}
            destination={item.meta.destination}
            reason={item.meta.reason}
            type={item.type}
            created_at={item.created_at}
          />
        ))}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

export default Notifications;
