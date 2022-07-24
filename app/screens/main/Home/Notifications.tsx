import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  Platform,
} from 'react-native';
import {ScreenProps} from '../../../../App';
import Layout from '../../../components/Layout';
import NotificationItem from '../../../components/NotificationItem';
import Subheader from '../../../components/Subheader';
import {useIsFocused} from '@react-navigation/native';
import {fetchNotifications} from '../../../contexts/User';
import {AuthContext} from '../../../../context';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';

const Notifications: React.FC<ScreenProps<'Notifications'>> = ({
  navigation,
}) => {
  const isFocused = useIsFocused();
  const {signOut} = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

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
        setPageLoading(false);
      })();
    } catch (error: any) {
      setPageLoading(false);
    }
  }, [logOutUser, isFocused]);

  if (pageLoading) {
    return (
      <View style={styles.isLoading}>
        <ActivityIndicator
          size={'large'}
          color={StyleGuide.Colors.primary}
          style={{marginBottom: StyleGuide.Typography[18]}}
        />
      </View>
    );
  }

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
        {notifications.length === 0 && (
          <Text style={styles.headerText}>
            You do not have any notifications
          </Text>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  isLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.shades.magenta[50],
    fontSize: scaledSize(18),
  },
});

export default Notifications;
