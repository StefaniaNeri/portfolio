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

  urlCV: string = 'assets/Stefania Neri.pdf';

  openCV() {
    if (isPlatformBrowser(this.platformId)) {
      // Log per debug
      console.log('Open cv ts:', this.urlCV);

      // const userAgent = navigator.userAgent;
      // const isMobile = userAgent.includes('Mobi') || userAgent.includes('Android') || userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod');

      // Alternativa con regex:
      // const isMobile = /Android|iPhone|iPad|Mobi|/i.test(navigator.userAgent);
      // console.log(isMobile);
      // if (isMobile) {
      //   // Apri il PDF su mobile
      //   const link = document.createElement('a');
      //   if (link.download !== undefined) {
      //     link.setAttribute('href', this.urlCV);
      //     link.setAttribute('download', 'CV Stefania Neri.pdf');
      //     link.style.visibility = 'hidden';
      //     // document.body.appendChild(link);
      //     try {
      //       link.click();
      //     } catch {
      //       console.log('Errore apertura CV');
      //       // window.open(this.urlCV, '_blank');
      //       // } finally {
      //       //   document.body.removeChild(link);
      //       // }
      //     }
      //   } else {
      // Apri il PDF su desktop
      // window.open(this.urlCV, '_blank');
      this.portfolioServ.open(this.urlCV);
      // }
      // }
    }
  }
}
