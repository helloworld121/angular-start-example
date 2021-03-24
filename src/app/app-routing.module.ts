import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth/auth.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
];
// every model works on its own => they don't communicate with each other
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  // if the module is used everything that is exported can be used
  exports: [RouterModule]
})
export class AppRoutingModule {

}
