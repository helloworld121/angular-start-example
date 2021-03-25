import {UserModel} from '../user.model';
import * as fromAuthActions from './auth.actions';

export interface State {
  user: UserModel;
}

const initialState: State = {
  user: null
};

export function authReducer(
  state: State = initialState,
  action: fromAuthActions.AuthActions
): State {
  switch (action.type) {
    case fromAuthActions.LOGIN:
      const user = new UserModel(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user,
      };
    case fromAuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
