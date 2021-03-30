import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';

import * as fromAuthActions from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; // this is only on signIn returned
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  return new fromAuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'An unknown error occured';
  // it is possible, that there is no error-key => for example due to network problems
  if (!errorResponse.error || !errorResponse.error.error) {
    console.log('[AuthService] handleError ', errorMessage);
    return of(new fromAuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS': errorMessage = 'The email address is already in use by another account.'; break;
    case 'OPERATION_NOT_ALLOWED': errorMessage = 'Password sign-in is disabled for this project.'; break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER': errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.'; break;

    case 'EMAIL_NOT_FOUND': errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.'; break;
    case 'INVALID_PASSWORD': errorMessage = 'The password is invalid or the user does not have a password.'; break;
    case 'USER_DISABLED': errorMessage = 'The user account has been disabled by an administrator.'; break;
  }
  console.log('[AuthService] handleError ', errorMessage);
  return of(new fromAuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(fromAuthActions.SIGNUP_START),
    switchMap((signupAction: fromAuthActions.SignupStart) => {
      return this.httpClient.post<AuthResponseData>(
        environment.baseUrl4SignUp + environment.firebaseApiKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
  );


  /*
  private authLogin = createEffect(() => {
    return this.actions$.pipe(

    );
  });
  */

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(fromAuthActions.LOGIN_START),
    switchMap((authData: fromAuthActions.LoginStart) => {
      return this.httpClient.post<AuthResponseData>(
        environment.baseUrl4SignIn + environment.firebaseApiKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true}
      ).pipe(
        map(resData => {
          return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
  );

  // to let Angular know, that this Effect doesn't dispatch a new Action
  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(fromAuthActions.AUTHENTICATE_SUCCESS, fromAuthActions.LOGOUT), // we can react to multiple actions
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private router: Router) { }

}
