import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';

import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';
import {Store} from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as fromAuthActions from './store/auth.actions';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true; // this should not part of the ngrx-store
  isLoading = false;
  error: string = null;

  // we can also pass a type => and angular will find the first occurence of the type
  @ViewChild(PlaceholderDirective, {static: false})
  alertHost: PlaceholderDirective;

  private storeSubscription: Subscription;
  private closeSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }


  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(new fromAuthActions.LoginStart({email, password}));
    } else {
      this.store.dispatch(new fromAuthActions.SignupStart({email, password}));
    }
    form.reset();
  }

  onHandleError(): void {
    this.store.dispatch(new fromAuthActions.ClearError());
  }

  private showErrorAlert(message: string): void {
    // This won't work, this is just a normal JS object
    // Angular instantiates Compnents in a different way. For example
    // - it wires it up to dependency injection
    // - connects it to change detection
    // - and way more....
    // Angular needs to create the component
    // const alert = new AlertComponent();

    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    // we need the viewContainerRef to interact with the place in the DOM
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    // create a new component using the resolveComponentFactory
    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    componentRef.instance.message = message;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe(); // we need to clear the subscription
      hostViewContainerRef.clear(); // clear all content that was rendered
    });
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }



}
