import {API} from '../../services/api';
import {Transaction} from './reducer';

export enum MyWalletActions {
  SET_TRANSACTIONS = 'SET_TRANSACTIONS',
}

export type MyWalletAction = {
  type: MyWalletActions;
  payload: any;
};

export const setTransactions = (
  newTransactions: Transaction[],
): MyWalletAction => ({
  type: MyWalletActions.SET_TRANSACTIONS,
  payload: newTransactions,
});

export const getTransactions = async (): Promise<Transaction> => {
  const fetchResponse = await API.get('');
  return fetchResponse.data.data;
};
