import {
  Component,
  HostListener,
  Inject,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { PortfolioServService } from '../portfolioServ.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private scrollSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private portfolioServ: PortfolioServService
  ) {}

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
