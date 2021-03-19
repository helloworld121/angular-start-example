import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


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

  constructor(private httpClient: HttpClient) { }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.httpClient.post<AuthResponseData>(
      environment.baseUrl4SignUp + environment.firebaseApiKey,
      {email, password, returnSecureToken: true}
      ).pipe(
        catchError(errorResponse => {
          let errorMessage = 'An unknown error occured';
          // it is possible, that there is no error-key => for example due to network problems
          if (!errorResponse.error || errorResponse.error.error) {
            return throwError(errorMessage);
          }
          switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS': errorMessage = 'The email address is already in use by another account.'; break;
            case 'OPERATION_NOT_ALLOWED': errorMessage = 'Password sign-in is disabled for this project.'; break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER': errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.'; break;
          }
          return throwError(errorMessage);
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.httpClient.post<AuthResponseData>(
      environment.baseUrl4SignIn + environment.firebaseApiKey,
      {email, password, returnSecureToken: true}
    );
  }


}
