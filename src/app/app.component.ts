import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {LoggingService} from './logging.service';

import * as fromApp from './store/app.reducer';
import * as fromAuthActions from './auth/store/auth.actions';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store,
    private loggingService: LoggingService) {
  }

  ngOnInit(): void {
    this.store.dispatch(new fromAuthActions.AutoLogin());
    this.loggingService.printLog('Hello from AppComponent ngOnInit');
  }

}
