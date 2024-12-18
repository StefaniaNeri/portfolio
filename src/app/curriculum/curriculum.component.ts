import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { PortfolioServService } from '../portfolioServ.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.css',
})
export class CurriculumComponent {
  private scrollSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private portfolioServ: PortfolioServService
  ) {}

  urlCV: string = 'assets/CV new SF.pdf';

  openCV() {
    this.portfolioServ.open(this.urlCV);
    // if (isPlatformBrowser(this.platformId)) {
    //   window.open(this.urlCV, '_blank');
    // }
  }

  //   ngOnInit() {
  //     if (isPlatformBrowser(this.platformId)) {
  //       // Iscriversi agli eventi di scroll
  //       this.scrollSubscription = this.portfolioServ.onScroll().subscribe(() => {
  //         // Calcola la posizione di scroll
  //         const scrollPos =
  //           window.scrollY ||
  //           document.documentElement.scrollTop ||
  //           document.body.scrollTop ||
  //           0;
  //         // Aggiorna lo stato sticky
  //         this.portfolioServ.updateSticky(scrollPos);
  //       });
  //     }
  //   }

  //   ngOnDestroy() {
  //     // Disiscriversi dall'osservabile quando il componente viene distrutto
  //     if (this.scrollSubscription) {
  //       this.scrollSubscription.unsubscribe();
  //     }
  //   }
}
