import {Injectable, EventEmitter} from '@angular/core';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      'https://cdn.pixabay.com/photo/2017/07/16/10/43/recipe-2508859__340.jpg',
      [new Ingredient('Apple', 1), new Ingredient('Bread', 2)]),
    new Recipe(
      'Second Test Recipe',
      'This is simply a test',
      'https://cdn.pixabay.com/photo/2017/07/16/10/43/recipe-2508859__340.jpg',
      [new Ingredient('Tomatoes', 2), new Ingredient('Cucumber', 1), new Ingredient('Salmon', 2)],
    )
  ];

  constructor(private shoppingListService: ShoppingListService) { }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.shoppingListService.addIngredients(ingredients);
  }

}
