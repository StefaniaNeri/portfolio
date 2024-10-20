import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { fromEvent, startWith, Subscription } from 'rxjs';

@Directive({
  selector: '[appear]',
})
export class AppearDirective implements AfterViewInit, OnDestroy {
  @Output() appear = new EventEmitter<null>();

  elementPos: number;
  elementHeight: number;
  scrollPos: number;
  windowHeight: number;

  subscriptionScroll: Subscription;
  subscriptionResize: Subscription;

  constructor(private element: ElementRef) {}

  saveDimensions() {
    if(typeof window !== 'undefined') {
      this.elementPos = this.getOffsetTop(this.element.nativeElement);
      this.elementHeight = this.element.nativeElement.offsetHeight;
      this.windowHeight = window.innerHeight;
      // console.log('Element position:' + this.elementPos);
      // console.log('Element height:' + this.elementHeight);

    }
  }

  saveScrollPos() {
    if(typeof window !== 'undefined') {
      this.scrollPos = window.scrollY;
      // console.log('Scroll position:' + this.scrollPos);

    }
  }

  getOffsetTop(element: any) {
    let offsetTop = element.offsetTop || 0;
    if (element.offsetParent) {
      offsetTop += this.getOffsetTop(element.offsetParent);
    }
    return offsetTop;
  }

  checkVisibility() {
    if (this.isVisible()) {
      this.saveDimensions();
      if (this.isVisible()) {
        this.unsubscribe();
        this.appear.emit(null);
      }
    }
  }

  isVisible() {
    // Verifica se la posizione dello scroll + l'altezza della finestra è maggiore o uguale alla posizione dell'elemento.
    return this.scrollPos + this.windowHeight >= this.elementPos;
  }

  subscribe() {
    this.subscriptionScroll = fromEvent(window, 'scroll')
      .pipe(startWith(null))
      .subscribe(() => {
        this.saveScrollPos();
        this.checkVisibility();
      });

    this.subscriptionResize = fromEvent(window, 'resize')
      .pipe(startWith(null))
      .subscribe(() => {
        this.saveDimensions();
        this.checkVisibility();
      });
  }

  unsubscribe() {
    if (this.subscriptionScroll) {
      this.subscriptionScroll.unsubscribe();
    }
    if (this.subscriptionResize) {
      this.subscriptionResize.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.saveDimensions(); // save initial dimensions
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
