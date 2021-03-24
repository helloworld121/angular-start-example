import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)},
  {path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
];
// every model works on its own => they don't communicate with each other
@NgModule({
  imports: [
    // strategy: PreloadAllModules => will load code-bundlings as soon as possible
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  // if the module is used everything that is exported can be used
  exports: [RouterModule]
})
export class AppRoutingModule {

}
