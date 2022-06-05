// import {Bill} from '../MyBills/reducer';
import {GenericUserAction, UserActions} from './actions';

export type User = {
  first_name: string;
  last_name: string;
  middle_name: string;
  email?: string;
  mobile: string;
  country_code: string;
  token: string;
  is_active: boolean;
  is_new: boolean;
  avatar_url: string;
  dob: string;
  wallet: {
    account_details: {
      bank_name: string;
      vnuban: number;
    };
    balance: 0;
    currency_code: string;
    card_details: {};
  };
  score: number;
  // bills: Bill[];
  id?: number | null;
  tier?: number | null;
};

export const initialUserState: User = {
  id: null,
  first_name: '',
  last_name: '',
  middle_name: '',
  mobile: '',
  country_code: '',
  token: '',
  is_active: false,
  is_new: true,
  avatar_url: '',
  dob: '',
  wallet: {
    account_details: {
      bank_name: '',
      vnuban: 0,
    },
    balance: 0,
    currency_code: '',
    card_details: {},
  },
  score: 0,
  tier: 1,
};

export const reducer = (state: User, action: GenericUserAction) => {
  switch (action.type) {
    case UserActions.CREATE_NEW_USER:
    case UserActions.SIGN_IN_USER:
    case UserActions.VERIFY_USER:
    case UserActions.REFRESH_USER:
      return {...state, ...action.payload};
    case UserActions.SIGN_OUT_USER:
      return {};
    default:
      return state;
  }
};
