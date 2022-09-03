import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Layout from '../../../components/Layout';
import Subheader from '../../../components/Subheader';
import TransactionItem, {
  TransactionItemsProps,
} from '../../../components/TransactionItem';
import {fetchRecentTransactions} from '../../../contexts/User';
import {scaleHeight} from '../../../utils';
import {Transaction} from '../Home/Dashboard';

const TransactionHistory: React.FC<ScreenProps<'TransactionHistory'>> = ({
  navigation,
}) => {
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [transactions, setTransx] = useState<Transaction>([]);

  useEffect(() => {
    try {
      (async () => {
        const transx = await fetchRecentTransactions();
        setTransx(transx.transactions);
        setPageLoading(false);
      })();
    } catch (error: any) {
      setPageLoading(false);
    }
  }, []);

  const renderItem = ({item}: {item: TransactionItemsProps}) => (
    <TransactionItem {...item} />
  );

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
      <View style={styles.page}>
        <Subheader title="Transaction History" goBack={navigation.goBack} />
        {transactions.length === 0 ? (
          <View style={styles.main}>
            <Text style={styles.headerText}>You have no transactions</Text>
          </View>
        ) : (
          <View style={styles.main}>
            <FlatList
              data={transactions}
              initialNumToRender={15}
              renderItem={renderItem}
              keyboardShouldPersistTaps="always"
              keyExtractor={(item, index) => `${item?.toString()}-${index}`}
              ListEmptyComponent={
                <View>
                  <Text>Loading contacts...</Text>
                </View>
              }
              contentContainerStyle={{paddingBottom: scaleHeight(10)}}
            />
          </View>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
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
    fontSize: scaledSize(14),
    color: StyleGuide.Colors.shades.grey[100],
    alignSelf: 'center',
    marginTop: 50,
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
