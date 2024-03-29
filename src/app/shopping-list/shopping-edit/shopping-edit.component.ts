import {Component, ElementRef, OnInit, ViewChild, EventEmitter, Output, OnDestroy} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import * as fromShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false})
  shoppingListForm: NgForm;

  subscription: Subscription;

  editMode = false;
  editedItem: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new fromShoppingListActions.StopEdit());
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(new fromShoppingListActions.UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new fromShoppingListActions.AddIngredient(newIngredient));
    }

    // after adding/updating reset the form
    this.editMode = false;
    form.reset();
  }

  onClear(): void {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(new fromShoppingListActions.StopEdit());
  }

  onDelete(): void {
    this.store.dispatch(new fromShoppingListActions.DeleteIngredient());
    this.onClear();
  }

}
