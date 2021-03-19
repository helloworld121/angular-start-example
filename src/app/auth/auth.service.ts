import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {UserModel} from './user.model';


export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; // this is only on signIn returned
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new Subject<UserModel>();

  constructor(private httpClient: HttpClient) { }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.httpClient.post<AuthResponseData>(
      environment.baseUrl4SignUp + environment.firebaseApiKey,
      {email, password, returnSecureToken: true}
      ).pipe(
        catchError(this.handleError),
        // tap executes code without changing the result
        tap( resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.httpClient.post<AuthResponseData>(
      environment.baseUrl4SignIn + environment.firebaseApiKey,
      {email, password, returnSecureToken: true}
    ).pipe(
      catchError(this.handleError),
      // tap executes code without changing the result
      tap( resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
    );
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new UserModel(email, userId, token, expirationDate);
    this.user.next(user);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.log('[AuthService] handleError');
    let errorMessage = 'An unknown error occured';
    // it is possible, that there is no error-key => for example due to network problems
    if (!errorResponse.error || !errorResponse.error.error) {
      console.log('[AuthService] handleError ', errorMessage);
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }


}
