import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {UserModel} from './user.model';
import {Router} from '@angular/router';


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

  // we can subscribe to this subject and always will be informed if new data is emitted
  // user = new Subject<UserModel>();
  // it behaves like Subject, but it gives Subscribes access to the previous emitted value,
  //   even if they subscribe after the value is emitted
  user = new BehaviorSubject<UserModel>(null);



  constructor(private httpClient: HttpClient, private router: Router) { }

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

  autoLogin(): void {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new UserModel(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }

  logout(): void {
    this.user.next(null);
    // because there are multiple places where the logout can be called we do the redirect in the service
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new UserModel(email, userId, token, expirationDate);
    this.user.next(user);

    // store token in local storage
    localStorage.setItem('userData', JSON.stringify(user));
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
