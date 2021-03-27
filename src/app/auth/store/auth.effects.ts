import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';

import * as fromAuthActions from './auth.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';

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
          return of(new fromAuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate,
          }));
        }),
        // catchError must return a none error-observable so, that the outer observable doesn't die
        catchError(error => {
          return of();
        }),
      );
    })
  );

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient) { }

}
