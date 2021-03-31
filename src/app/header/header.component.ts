import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

import * as fromAuthActions from '../auth/store/auth.actions';
import * as fromRecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;

  isAuthenticated = false;
  private userSubscription: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').pipe(
      // we only want the user from the authState
      map(authState => authState.user)
    ).subscribe(user => {
      this.isAuthenticated = !!user; // => short for "!user ? false : true"
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }


  onSaveData(): void {
    this.dataStorageService.storeRecipes();
  }

  onFetchData(): void {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new fromRecipesActions.FetchRecipes());
  }

  onLogout(): void {
    // this.authService.logout();
    this.store.dispatch(new fromAuthActions.Logout());
  }

}
