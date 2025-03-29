import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { fromEvent, startWith, Subscription } from 'rxjs';
import { PortfolioServService } from './portfolioServ.service';

@Directive({
  selector: '[appear]',
})
export class AppearDirective {
  @Output() appear = new EventEmitter<null>();
  elementPos: number;
  elementHeight: number;
  scrollPos: number;
  windowHeight: number;
  subscriptionScroll: Subscription;
  subscriptionResize: Subscription;
  constructor(
    private element: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private portfolioServ: PortfolioServService
  ) {}
  saveDimensions() {
    if (typeof window !== 'undefined') {
      this.elementPos = this.getOffsetTop(this.element.nativeElement);
      this.elementHeight = this.element.nativeElement.offsetHeight;
      this.windowHeight = window.innerHeight;
      // console.log('Element position:' + this.elementPos);
      // console.log('Element height:' + this.elementHeight);
    }
  }
  saveScrollPos() {
    if (typeof window !== 'undefined') {
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
  // subscribe() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.subscriptionScroll = fromEvent(window, 'scroll')
  //       .pipe(startWith(null))
  //       .subscribe(() => {
  //         this.saveScrollPos();
  //         this.checkVisibility();
  //       });
  //     this.subscriptionResize = fromEvent(window, 'resize')
  //       .pipe(startWith(null))
  //       .subscribe(() => {
  //         this.saveDimensions();
  //         this.checkVisibility();
  //       });
  //   }
  // }
  private subscribeToScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptionScroll = this.portfolioServ
        .onScroll()
        .subscribe((scrollPos) => {
          // console.log('Scroll position:', scrollPos);
          this.checkVisibility(); // Controlla la visibilità dell'elemento
        });
    }
  }
  private subscribeToResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptionResize = this.portfolioServ.onResize().subscribe(() => {
        this.checkVisibility(); // Controlla la visibilità dell'elemento
      });
    }
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
    // if (isPlatformBrowser(this.platformId)) {
    //   if (this.element && this.element.nativeElement) {
    //     this.saveDimensions(); // Salva le dimensioni iniziali
    //     this.subscribe();
    //   }
    // }
    this.subscribeToScroll();
    this.subscribeToResize();
  }
  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
