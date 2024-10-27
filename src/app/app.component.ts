import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { PortfolioServService } from './portfolioServ.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // animations: [
  //   trigger('slide-in', [
  //     transition(':enter', [
  //       style({ transform: 'translateY(-100%)', opacity: 0 }), // initial state
  //       animate(
  //         '300ms ease-in',
  //         style({ transform: 'translateY(0)', opacity: 1 })
  //       ), // final state
  //     ]),
  //     transition(':leave', [
  //       animate(
  //         '300ms ease-out',
  //         style({ transform: 'translateY(-100%)', opacity: 0 })
  //       ), // leave transition
  //     ]),
  //   ]),
  // ],
})
export class AppComponent {
  private scrollSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private portfolioServ: PortfolioServService
  ) {}

  titleParent = 'sn';
  isVisible = false;

  onAppear() {
    this.isVisible = true;
    console.log('Visible: ' + this.isVisible);
  }

  isSticky: boolean = false;

  // @HostListener('window:scroll', [])
  // checkScroll() {
  //   this.portfolioServ.checkScroll();
  //   this.isSticky = this.portfolioServ.isSticky;
  // }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Iscriversi agli eventi di scroll
      this.scrollSubscription = this.portfolioServ.onScroll().subscribe(() => {
        // Calcola la posizione di scroll
        const scrollPos =
          window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        // Aggiorna lo stato sticky
        this.portfolioServ.updateSticky(scrollPos);
        // Assegna isSticky alla variabile locale
        this.isSticky = this.portfolioServ.isSticky;
      });
    }
  }

  ngOnDestroy() {
    // Disiscriversi dall'osservabile quando il componente viene distrutto
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
