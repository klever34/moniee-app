import {Bill} from '../MyBills/reducer';
import {GenericUserAction, UserActions} from './actions';

export type User = {
  firstname: string;
  lastname: string;
  email?: string;
  mobile: string;
  countryCode: string;
  token: string;
  is_identity_verified: boolean;
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
  bills: Bill[];
  ux_cam_id: string;
  id?: number | null;
};

export const initialUserState: User = {
  id: null,
  firstname: '',
  lastname: '',
  mobile: '',
  countryCode: '',
  token: '',
  is_identity_verified: false,
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
  bills: [],
  ux_cam_id: '',
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
