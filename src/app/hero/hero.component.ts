import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { PortfolioServService } from '../portfolioServ.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private portfolioServ: PortfolioServService) {}

  // @ViewChild('heroSec') heroSec: ElementRef;

  // ngAfterViewInit(): void {
  //   if (isPlatformBrowser(this.platformId) && window !== undefined) {
  //     let vh = window.innerHeight * 0.01;
  //     // console.log(window.innerHeight, this.platformId, window);
  //     document.documentElement.style.setProperty('--vh', `${vh}px`);
  //   }
  // }

  urlCV: string = 'assets/Stefania Neri Eng.pdf';

  openCV() {
    if (isPlatformBrowser(this.platformId)) {
      this.portfolioServ.open(this.urlCV);
    }
  }
}
