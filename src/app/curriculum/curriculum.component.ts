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

  urlCV: string = 'assets/CV Stefania Neri.pdf';

  openCV() {
    if (isPlatformBrowser(this.platformId)) {
      // Log per debug
      console.log('Open cv ts:', this.urlCV);

      // const userAgent = navigator.userAgent;
      // const isMobile = userAgent.includes('Mobi') || userAgent.includes('Android') || userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod');
      // Alternativa con regex:
      const isMobile = /Android|iPhone|iPad|Mobi|/i.test(navigator.userAgent);
      console.log(isMobile);
      if (isMobile) {
        // Apri il PDF su mobile
        const link = document.createElement('a');
        link.href = this.urlCV;
        link.download = 'CV Stefania Neri.pdf';
        link.click(); // Il browser sa di dover cliccare l'elemento "a" appena creato
      } else {
        // Apri il PDF su desktop
        // window.open(this.urlCV, '_blank');
        this.portfolioServ.open(this.urlCV);
      }
    }
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
