import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';

import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as fromRecipesActions from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params.id;
    //   this.recipe = this.recipeService.getRecipe(this.id);
    // });

    this.route.params.pipe(
      map(params => {
        return +params.id;
      }),
      // we could also use nested observables but this is a bad practice
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })
    ).subscribe(recipe => {
      this.recipe = recipe;
    });
  }

  onAddToShoppingList(): void {
    // console.log('[RecipeDetailComponent] onAddToShoppingList');
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
    // alternative approach to navigate => by going up one folder
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe(): void {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new fromRecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}
