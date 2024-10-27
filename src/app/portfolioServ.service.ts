import { isPlatformBrowser } from '@angular/common';
import {
  HostListener,
  Inject,
  Injectable,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioServService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}
  isVisible = false;

  onAppear() {
    this.isVisible = true;
    console.log('service' + this.isVisible);
  }

  // DOWNLOAD URL
  open(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank');
    } else {
      console.warn('Attempted to open a URL on the server side.');
    }
  }

  isSticky: boolean = false;

  // @HostListener('window:scroll', [])
  // checkScroll() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const scrollPos =
  //       window.scrollY ||
  //       document.documentElement.scrollTop ||
  //       document.body.scrollTop ||
  //       0;

  //     this.isSticky = scrollPos >= 600;
  //   }
  // }

  // Check if the scroll position indicates the sticky state
  updateSticky(scrollPos: number) {
    this.isSticky = scrollPos >= 600;
    console.log('Sticky status:', this.isSticky);
  }

  // GESTIRE GLI EVENTI, WINDOW SERVICE

  onScroll(): Observable<Event> {
    return new Observable((observer) => {
      if (isPlatformBrowser(this.platformId)) {
        const handler = (event: Event) =>
          this.ngZone.run(() => observer.next(event));

        this.ngZone.runOutsideAngular(() => {
          window.addEventListener('scroll', handler);
        });

        // Cleanup
        return () => {
          window.removeEventListener('scroll', handler);
        };
      } else {
        // Emit null or a placeholder value if running on the server
        observer.next(null);
        return () => {};
      }
    });
  }

  onResize(): Observable<Event> {
    return new Observable((observer) => {
      if (isPlatformBrowser(this.platformId)) {
        const handler = (event: Event) =>
          this.ngZone.run(() => observer.next(event));

        this.ngZone.runOutsideAngular(() => {
          window.addEventListener('resize', handler);
        });

        // Cleanup
        return () => {
          window.removeEventListener('resize', handler);
        };
      } else {
        // Emit null or a placeholder value if running on the server
        observer.next(null);
        return () => {};
      }
    });
  }
}
