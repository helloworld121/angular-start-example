import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';

import {Recipe} from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as fromRecipesActions from '../recipes/store/recipes.actions';
import {map, switchMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
// this resolver will load recipes if someone access a deeplink and the recipes aren't loaded yet
export class RecipesResolverService implements Resolve<Recipe[]>{

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    // we don't need to subscribe in here because the resolver will do this => to check if data is there

    // we don't want to send any requests if we already have recipes
    return this.store.select('recipes').pipe(
      take(1), // to ensure this won't be executed multiple times
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new fromRecipesActions.FetchRecipes());
          // we need to return an observable for that will be wait to finish
          // => therefore we filter for the action that should be finished
          return this.actions$.pipe(
            ofType(fromRecipesActions.SET_RECIPES),
            take(1) // to complete and unsubscribe subscription
          );
        } else {
          return of(recipes);
        }
      })
    );


  }

}
