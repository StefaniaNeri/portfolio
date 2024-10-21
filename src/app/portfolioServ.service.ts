import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortfolioServService {
  constructor() {}
  isVisible = false;

  onAppear() {
    this.isVisible = true;
    console.log('service' + this.isVisible);
  }

  isSticky: boolean = false;

  @HostListener('window:scroll', [])
  checkScroll() {
    const scrollPos =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isSticky = scrollPos >= 600;
  }
}
