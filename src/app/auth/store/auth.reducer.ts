import {UserModel} from '../user.model';
import * as fromAuthActions from './auth.actions';

export interface State {
  user: UserModel;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(
  state: State = initialState,
  action: fromAuthActions.AuthActions
): State {
  switch (action.type) {
    case fromAuthActions.AUTHENTICATE_SUCCESS:
      const user = new UserModel(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        authError: null,
        user,
        loading: false,
      };
    case fromAuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case fromAuthActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case fromAuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
