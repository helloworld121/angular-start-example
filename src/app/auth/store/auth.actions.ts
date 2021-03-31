import {Action} from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const SIGNUP_START = '[Auth] Signup Start';
// success and fail logic is the same for login and signup
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const CLEAR_ERROR = '[Auth] clear error';
export const AUTO_LOGIN = '[Auth] auto login';
export const LOGOUT = '[Auth] Logout';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(public payload: {
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
    redirect: boolean; // only redirect if necessaray
  }) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: {email: string; password: string}) { }
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) { }
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: {email: string; password: string}) { }
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | LoginStart
  | SignupStart
  | AuthenticateSuccess
  | AuthenticateFail
  | Logout
  | ClearError
  | AutoLogin
  ;
