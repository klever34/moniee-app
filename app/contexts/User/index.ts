import {createContext} from 'react';
import {GenericUserAction} from './actions';
import {initialUserState} from './reducer';

export * from './reducer';
export * from './actions';

export const UserContext = createContext({
  userState: initialUserState,
  userDispatch: (action: GenericUserAction) => {
    console.log(action.payload);
  },
});
