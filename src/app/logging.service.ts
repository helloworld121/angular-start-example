import {Injectable} from '@angular/core';

/**
 * this is just a demo-service to demonstrate to difference service-instances
 *
 * services provided in a lazy loaded module will be recreated being a new instance
 *   => this way the service won't be a singleton anymore => there will be multiple instances
 */
// @Injectable({providedIn: 'root'})
export class LoggingService {
  lastlog: string;

  printLog(message: string): void {
    console.log(message);
    console.log(this.lastlog);
    this.lastlog = message;
  }

}
