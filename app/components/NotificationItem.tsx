/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, StyleSheet, Text, Platform, TouchableOpacity} from 'react-native';
import StyleGuide from '../assets/style-guide';
import {scaledSize} from '../assets/style-guide/typography';
import MonieeButton from './MonieeButton';
import moment from 'moment';
import {declineRequest} from '../contexts/User';
import Icon from './Icon';
import {useToast} from 'react-native-toast-notifications';

type NotificationProps = {
  amount: number;
  destination?: string;
  reason?: string;
  type: string;
  created_at: string;
  id: number;
  source?: string;
  refresh: (val: boolean) => void;
  openModal: (val: boolean) => void;
};

export const dateConverter = (myDate: string) => {
  var fromNow = moment(myDate).fromNow();
  return moment(myDate).calendar(null, {
    lastWeek: '[Last] dddd',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    sameElse: function () {
      return '[' + fromNow + ']';
    },
  });
};

const NotificationItem: React.FC<NotificationProps> = ({
  amount,
  destination,
  reason,
  type,
  created_at,
  id,
  source,
  refresh,
  openModal,
}) => {
  // const [acceptLoader, setAcceptLoader] = useState(false);
  const [declineLoader, setDeclineLoader] = useState(false);
  const toast = useToast();

  const getNotificationType = () => {
    switch (type) {
      case 'request-sent':
        return 'Request Sent';
      case 'withdrawal':
        return 'Withdrawal';
      case 'request':
        return 'Request';
      case 'request-declined':
        return 'Request Declined';
      case 'deposit':
        return 'Deposit';
      default:
        break;
    }
  };

  const descriptionBody = () => {
    switch (type) {
      case 'request-sent':
        return (
          <Text style={styles.body}>
            Your sent a request of:
            <Text style={styles.boldText}> ₦{amount}</Text> to
            <Text style={styles.boldText}> {destination}</Text> for
            <Text style={styles.boldText}> {reason ?? ''}</Text>
          </Text>
        );
      case 'deposit':
        return (
          <Text style={styles.body}>
            Your deposit of<Text style={styles.boldText}> ₦{amount}</Text> has
            been completed
          </Text>
        );
      case 'withdrawal':
        return (
          <Text style={styles.body}>
            <Text style={styles.boldText}>₦{amount}</Text> successfully sent to
            your bank account
          </Text>
        );
      case 'request':
        return (
          <Text style={styles.body}>
            <Text style={styles.boldText}>{source}</Text> has requested
            <Text style={styles.boldText}> ₦{amount}</Text> for
            <Text style={styles.boldText}> {reason}</Text>
          </Text>
        );
      case 'request-declined':
        return (
          <Text style={styles.body}>
            Your request:<Text style={styles.boldText}> ₦{amount}</Text> for
            <Text style={styles.boldText}> {reason}</Text> has been declined by
            <Text style={styles.boldText}> {destination}</Text>
          </Text>
        );
      default:
        return (
          <Text style={styles.body}>
            <Text style={styles.boldText}>New Notification</Text>
          </Text>
        );
    }
  };

  // const accept = async (pin: string) => {
  //   setAcceptLoader(true);
  //   try {
  //     const res = await acceptRequest({id, pin});
  //     setAcceptLoader(false);
  //     if (res.status) {
  //       toast.show(res.message, {
  //         type: 'custom_toast',
  //         animationDuration: 100,
  //         data: {
  //           title: 'Info',
  //         },
  //       });
  //     } else {
  //       toast.show('Could not process request', {
  //         type: 'custom_toast',
  //         animationDuration: 100,
  //         data: {
  //           title: 'Info',
  //         },
  //       });
  //     }

  //     refresh(true);
  //   } catch (error: any) {
  //     console.log(error.response);

  //     setAcceptLoader(false);
  //   }
  // };
  // const onHandlePinDone = async (pin: string) => {
  //   await accept(pin);
  // };

  const decline = async () => {
    setDeclineLoader(true);
    try {
      const res = await declineRequest(id);
      setDeclineLoader(false);
      if (res.status) {
        toast.show(res.message, {
          type: 'custom_toast',
          animationDuration: 100,
          data: {
            title: 'Info',
          },
        });
      } else {
        toast.show('Could not decline request', {
          type: 'custom_toast',
          animationDuration: 100,
          data: {
            title: 'Info',
          },
        });
      }
      refresh(true);
    } catch (error) {
      setDeclineLoader(false);
    }
  };

  return (
    <View style={styles.cardItem}>
      {/* <Image
        source={require('../assets/images/avatar.png')}
        style={styles.avatarImage}
      /> */}
      <TouchableOpacity style={styles.iconBg}>
        <Icon
          type="material-icons"
          name="notifications-none"
          size={24}
          color={StyleGuide.Colors.white}
        />
      </TouchableOpacity>
      <View style={styles.rightItem}>
        <View style={styles.topText}>
          <Text style={styles.notyType}>{getNotificationType()}</Text>
          <Text style={styles.notyDate}>· {dateConverter(created_at)} </Text>
        </View>
        <View>{descriptionBody()}</View>
        {type === 'request' && (
          <View style={styles.btn}>
            <MonieeButton
              customStyle={{
                marginRight: 10,
                width: '40%',
                backgroundColor: StyleGuide.Colors.shades.grey[600],
              }}
              onPress={() => {
                decline();
              }}
              title="Getat!"
              textColor={StyleGuide.Colors.shades.magenta[25]}
              isLoading={declineLoader}
            />
            <MonieeButton
              customStyle={{width: '40%'}}
              onPress={() => {
                // transactionPinSheetRef?.current?.show();
                openModal(true);
              }}
              title="Accept"
              // isLoading={acceptLoader}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    height: 60,
    width: 60,
    marginRight: 5,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 5,
    marginVertical: 5,
  },
  rightItem: {
    marginLeft: 5,
    flex: 1,
  },
  topText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[25],
    paddingVertical: 5,
    lineHeight: 20,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  notyDate: {
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[100],
    fontSize: scaledSize(10),
  },
  notyType: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.primary,
    fontSize: scaledSize(10),
  },
  boldText: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
  iconBg: {
    backgroundColor: StyleGuide.Colors.primary,
    padding: 15,
    borderRadius: 50,
    marginRight: 10,
  },
});

export default NotificationItem;
