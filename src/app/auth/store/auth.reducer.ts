import {UserModel} from '../user.model';

export interface State {
  user: UserModel;
}

const initialState = {
  user: null
};

export function authReducer(state = initialState, action) {
  return state;
}
