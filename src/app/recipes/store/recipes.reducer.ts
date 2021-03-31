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
    default:
      return state;
  }
}
