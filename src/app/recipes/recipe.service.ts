import {Injectable, EventEmitter} from '@angular/core';
import {Recipe} from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is simply a test', 'https://cdn.pixabay.com/photo/2017/07/16/10/43/recipe-2508859__340.jpg'),
    new Recipe('Second Test Recipe', 'This is simply a test', 'https://cdn.pixabay.com/photo/2017/07/16/10/43/recipe-2508859__340.jpg')
  ];

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

}
