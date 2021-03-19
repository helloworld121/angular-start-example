import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {environment} from '../../environments/environment';
import {Recipe} from '../recipes/recipe.model';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private httpClient: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.httpClient.put(environment.baseUrl4Data + 'recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(environment.baseUrl4Data + 'recipes.json')
      .pipe(
        // prevent unexpected errors if ingredients array is empty
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        // we still want to store the recipes, but we also want to subscribe to the observable
        tap(recipes => this.recipeService.setRecipes(recipes))
      );
  }

}
