import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * Dynamic Components => the component should be there if something happens
 * Possibilities to load programmatically:
 *  - *ngIf
 *  - (previous: Dynamic Component Loader)
 *    => manually create Component and attach it to the DOM
 */
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input()
  message: string;
  @Output()
  close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

}
