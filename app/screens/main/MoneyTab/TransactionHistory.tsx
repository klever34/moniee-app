import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Layout from '../../../components/Layout';
import Subheader from '../../../components/Subheader';
import {fetchRecentTransactions} from '../../../contexts/User';

const TransactionHistory: React.FC<ScreenProps<'TransactionHistory'>> = ({
  navigation,
}) => {
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      (async () => {
        await fetchRecentTransactions();
        setPageLoading(false);
      })();
    } catch (error: any) {
      setPageLoading(false);
    }
  }, []);

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
        <Subheader title="Transaction History" goBack={navigation.goBack} />
        <ScrollView style={styles.main}>
          <Text style={styles.headerText}>You have no transactions</Text>
        </ScrollView>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  badgeStyle: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  noId: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerText: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    fontSize: scaledSize(18),
    color: StyleGuide.Colors.black,
  },
  subText: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Light' : 'NexaLight',
    fontSize: scaledSize(12),
    color: StyleGuide.Colors.black,
    lineHeight: 15,
    textAlign: 'center',
    marginVertical: 10,
  },
  expandBtn: {
    flex: 1,
  },
  textInputStyle: {
    backgroundColor: StyleGuide.Colors.shades.grey[600],
    padding: 10,
    color: StyleGuide.Colors.shades.grey[800],
    marginVertical: 5,
    borderRadius: 5,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  uploadBox: {
    backgroundColor: StyleGuide.Colors.shades.grey[600],
    padding: 30,
    marginVertical: 30,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTextStyle: {
    color: StyleGuide.Colors.shades.grey[800],
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    padding: 10,
  },
  isLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TransactionHistory;
