import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {saveFcmToken} from '../../contexts/User';

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    var r = (Math.random() * 16) | 0,
      // eslint-disable-next-line no-bitwise
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const initializeFB = () => {
  const getToken = async () => {
    try {
      const token = await firebase.messaging().getToken();
      await saveFcmToken({token, platform: Platform.OS});
    } catch (error) {}
  };

  const registerForRemoteMessages = () => {
    firebase
      .messaging()
      .registerDeviceForRemoteMessages()
      .then(() => {
        requestPermissions();
      })
      .catch(e => console.log(e));
  };

  const requestPermissions = () => {
    firebase
      .messaging()
      .requestPermission()
      .then((status: FirebaseMessagingTypes.AuthorizationStatus) => {
        if (status === 1) {
          onMessage();
        }
      })
      .catch(e => console.log(e));
  };

  const onMessage = () => {
    firebase.messaging().onMessage(response => {
      showNotification(response?.notification);
    });
  };

  const showNotification = (notification: any) => {
    if (Platform.OS === 'android') {
      PushNotification.localNotification({
        id: uuidv4(),
        channelId: 'shara-customer-notification',
        title: notification.title,
        message: notification.body!,
      });
    } else {
      PushNotificationIOS.addNotificationRequest({
        id: uuidv4(),
        title: notification.title,
        body: notification.body!,
      });
    }
  };

  getToken();

  if (Platform.OS === 'ios') {
    registerForRemoteMessages();
  } else {
    onMessage();
  }
};
