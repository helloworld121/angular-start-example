import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {environment} from '../../../environments/environment';
import {Recipe} from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as fromRecipesActions from './recipes.actions';

@Injectable()
export class RecipesEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(fromRecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.httpClient.get<Recipe[]>(environment.baseUrl4Data + 'recipes.json');
    }),
    // prevent unexpected errors if ingredients array is empty
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    // dispatch a new action
    map(recipes => {
      return new fromRecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({dispatch: false}) // we don't need to dispatch a new action
  storeRecipes = this.actions$.pipe(
    ofType(fromRecipesActions.STORE_RECIPES),
    // withLatestFrom => merge a value from another observable into this observable stream
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => { // array-destructuring to put array values into variables
      return this.httpClient.put(environment.baseUrl4Data + 'recipes.json', recipesState.recipes);
    })
  );

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<fromApp.AppState>) { }
}
