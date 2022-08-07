import React, {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
import {acceptRequest, fetchNotifications} from '../../../contexts/User';
import {AuthContext} from '../../../../context';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import TransactionPin from '../../../components/TransactionPin';
import ActionSheet from 'react-native-actions-sheet';
import {useToast} from 'react-native-toast-notifications';

const Notifications: React.FC<ScreenProps<'Notifications'>> = ({
  navigation,
}) => {
  const isFocused = useIsFocused();
  const {signOut} = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [reloadPage, setReload] = useState<boolean>(false);
  const transactionPinSheetRef = createRef<ActionSheet>();
  const toast = useToast();
  const [requestId, setRequestId] = useState<number>();

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
  }, [logOutUser, isFocused, reloadPage]);

  const onHandlePinDone = async (pin: string) => {
    if (pin.length === 4) {
      transactionPinSheetRef?.current?.hide();
      try {
        const res = await acceptRequest({id: requestId!, pin});
        if (res.status) {
          toast.show(res.message, {
            type: 'custom_toast',
            animationDuration: 100,
            data: {
              title: 'Info',
            },
          });
          setReload(!reloadPage);
        } else {
          toast.show('Could not process request', {
            type: 'custom_toast',
            animationDuration: 100,
            data: {
              title: 'Info',
            },
          });
        }
      } catch (error: any) {
        console.log(error.response);
      }
    }
  };

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
            id={item.meta.requestId}
            source={item.meta.source}
            refresh={(value: boolean) => setReload(value)}
            openModal={(value: boolean) => {
              setRequestId(item.meta.requestId);
              if (value) {
                transactionPinSheetRef?.current?.show();
              } else {
                transactionPinSheetRef?.current?.hide();
              }
            }}
          />
        ))}
        {notifications.length === 0 && (
          <Text style={styles.headerText}>
            You do not have any notifications
          </Text>
        )}
      </View>
      <View style={{flex: 1}}>
        <TransactionPin
          actionSheetRef={transactionPinSheetRef}
          onDone={(pin: string) => onHandlePinDone(pin)}
        />
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
