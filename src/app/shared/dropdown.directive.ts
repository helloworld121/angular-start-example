import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  // we want to attach/detach this class dynamically
  // we only need to bind to this class, the rest will be done by angular
  // @HostBinding('class.show')
  private isOpen = false;

  // we want to bind to this event
  @HostListener('click')
  toggleOpen(): void {
    // console.log('[DropdownDirective]', this.elRef.nativeElement.parentNode);
    // console.log(this.elRef.nativeElement.parentNode.querySelector('.dropdown-menu').constructor.name);

    this.isOpen = !this.isOpen;

    // must be HTMLUListElement
    // const el: HTMLElement = this.elRef.nativeElement.parentNode.querySelectorAll('.dropdown-menu');
    const el: HTMLElement = this.elRef.nativeElement.parentNode.querySelector('.dropdown-menu');

    if (this.isOpen) {
      this.renderer.addClass(el, 'show');
    } else {
      this.renderer.removeClass(el, 'show');
    }
  }

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

}
