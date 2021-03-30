import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';

import * as fromAuthActions from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {of, throwError} from 'rxjs';
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

@Injectable()
export class AuthEffects {

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
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return new fromAuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate,
          });
        }),
        // catchError must return a none error-observable so, that the outer observable doesn't die
        catchError(errorResponse => {
          let errorMessage = 'An unknown error occured';
          // it is possible, that there is no error-key => for example due to network problems
          if (!errorResponse.error || !errorResponse.error.error) {
            console.log('[AuthService] handleError ', errorMessage);
            return of(new fromAuthActions.LoginFail(errorMessage));
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
          return of(new fromAuthActions.LoginFail(errorMessage));
        }),
      );
    })
  );

  // to let Angular know, that this Effect doesn't dispatch a new Action
  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(fromAuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private router: Router) { }

}
