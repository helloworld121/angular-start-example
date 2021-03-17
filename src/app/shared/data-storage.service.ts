import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {environment} from '../../environments/environment';
import {Recipe} from '../recipes/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private httpClient: HttpClient, private recipeService: RecipeService) { }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.httpClient.put(environment.baseUrl4Data + 'recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes(): void {
    this.httpClient.get<Recipe[]>(environment.baseUrl4Data + 'recipes.json').subscribe(recipes => {
      this.recipeService.setRecipes(recipes);
    });
  }

}
