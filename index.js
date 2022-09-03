/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs(true);
import PushNotification from 'react-native-push-notification';

PushNotification.createChannel(
  {
    channelId: 'moniee-app-notification',
    channelName: 'Moniee App',
    channelDescription: 'Moniee App message',
    importance: 4,
    vibrate: true,
  },
  created => console.log(`createChannel returned '${created}'`),
);

AppRegistry.registerComponent(appName, () => App);
