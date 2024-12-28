import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { PortfolioServService } from '../portfolioServ.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  private scrollSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private portfolioServ: PortfolioServService
  ) {}

  @ViewChild('hamburger') hamburger: ElementRef;
  @ViewChild('collapsedMenu') collapsedMenu: ElementRef;

  isSticky: boolean = false;

  // @HostListener('window:scroll', [])
  // checkScroll() {
  //   this.portfolioServ.checkScroll();
  //   this.isSticky = this.portfolioServ.isSticky;
  // }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Iscriversi agli eventi di scroll
      this.scrollSubscription = this.portfolioServ.onScroll().subscribe(() => {
        // Calcola la posizione di scroll
        const scrollPos =
          window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;

        // Se siamo su desktop e quindi il menu hamburger non è visibile, il menù è sticky
        if (
          window.getComputedStyle(this.hamburger.nativeElement).display ==
          'none'
        ) {
          // Aggiorna lo stato sticky
          this.portfolioServ.updateSticky(scrollPos);
          // Assegna isSticky alla variabile locale
          this.isSticky = this.portfolioServ.isSticky;
        }
      });

      //// MOBILE
      // Tappando una voce del menu hamburger o fuori da menù, si chiude
      // if (
      //   window.getComputedStyle(this.hamburger.nativeElement).display !== 'none'
      // ) {
      //   // Al tap su una voce del menù, si chiude
      //   const navItems = document.querySelectorAll('.nav-item');
      //   navItems.forEach((item) => {
      //     item.addEventListener('touchstart', (e) => {
      //       e.stopPropagation();
      //       this.collapsedMenu.nativeElement.classList.toggle('show');
      //     });
      //   });
      // }

      // // Al tap fuori dal menù, si chiude
      // document.addEventListener('touchstart', (e) => {
      //   if (!this.collapsedMenu.nativeElement.contains(e.target)) {
      //     this.collapsedMenu.nativeElement.classList.toggle('show');
      //   }
      // });
      // ora servono due click mi sa per chiuderlo da mobile però. E c'è il pezzo a destra
    }
  }

  ngOnDestroy() {
    // Disiscriversi dall'osservabile quando il componente viene distrutto
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
