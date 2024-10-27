import { isPlatformBrowser } from '@angular/common';
import { HostListener, Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortfolioServService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  isVisible = false;

  onAppear() {
    this.isVisible = true;
    console.log('service' + this.isVisible);
  }

  isSticky: boolean = false;

  @HostListener('window:scroll', [])
  checkScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPos =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      this.isSticky = scrollPos >= 600;
    }
  }
}
