import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core.module';
import {LoggingService} from './logging.service';
import {StoreModule} from '@ngrx/store';
import * as fromApp from './store/app.reducer';

@NgModule({
  // ATTENTION: multiple declarations of the same thing are not allowed
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    SharedModule,
    CoreModule,
  ],
  providers: [
    // by providing the Service multiple times we get multiple instances
    LoggingService,
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
