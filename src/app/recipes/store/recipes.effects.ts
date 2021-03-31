import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';

import * as fromRecipesActions from './recipes.actions';
import {Recipe} from '../recipe.model';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

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

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient) { }
}
