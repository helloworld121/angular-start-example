import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as fromAuthActions from './store/auth.actions';

// export interface AuthResponseData {
//   idToken: string;
//   email: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean; // this is only on signIn returned
// }


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // we can subscribe to this subject and always will be informed if new data is emitted
  // user = new Subject<UserModel>();
  // it behaves like Subject, but it gives Subscribes access to the previous emitted value,
  //   even if they subscribe after the value is emitted
  // user = new BehaviorSubject<UserModel>(null);

  private tokenExpirationTimer: any;

  constructor(
    private store: Store<fromApp.AppState>) { }

  // this could be moved to ngrx-effects, but this would need way more effort
  setLogoutTimer(exiprationDuration: number): void {
    this.tokenExpirationTimer = setTimeout( () => {
      this.store.dispatch(new fromAuthActions.Logout());
    }, exiprationDuration);
  }

  clearLogoutTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

}
