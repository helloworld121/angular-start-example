import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {exhaustMap, map, take} from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      // take will only take the number of values from the observable and than automatically unsubscribe
      take(1),
      // we only want the user from the authSate therefore we need to map it
      map(authState => {
        return authState.user;
      }),
      // exhaust map waits for the first observable - the user - to complete
      // after that it gives us the user and returns a new observable
      // => the outer observable will be replaced by the observable the inner-function of exhaustMap returns
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
        return next.handle(modifiedReq);
      }));
  }

}
