import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {map, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // user is already an observable, but not a boolean, therefore we need to map it
    return this.authService.user.pipe(
      take(1), // to make sure, to take the latest value und unsubscripe automatically
      map(user => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        // instead of navigating programmatically we can return a UrlTree
        return this.router.createUrlTree(['/auth']);
      }),
      // tap(isAuth => {
      //   if (!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
    );
  }


}
