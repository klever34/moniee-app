import appsFlyer from 'react-native-appsflyer';
import {savedUser} from '../../contexts/User';

export async function MonieeLogEvent(name: string, values: {}) {
  const user_id = await savedUser();
  if (Object.keys(values).length === 0) {
    appsFlyer.logEvent(name, {user_id});
    return;
  }
  appsFlyer.logEvent(name, values);
}
