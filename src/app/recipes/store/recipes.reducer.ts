import {Recipe} from '../recipe.model';

import * as fromRecipesActions from './recipes.actions';


export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function recipesReducer(
  state = initialState,
  action: fromRecipesActions.RecipesActions): State {

  switch (action.type) {
    case fromRecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    case fromRecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case fromRecipesActions.UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.newRecipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: updatedRecipes
      };
    case fromRecipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => index !== action.payload)
      };
    default:
      return state;
  }
}
