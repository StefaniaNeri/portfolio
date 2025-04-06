import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { PortfolioServService } from './portfolioServ.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ToasterPosition } from 'ng-angular-popup';

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
    private portfolioServ: PortfolioServService, private cdr: ChangeDetectorRef
  ) {}

  titleParent = 'sn';
  isVisible = false;
  ToasterPosition = ToasterPosition;

  onAppear() {
    this.isVisible = true;
    console.log('Visible: ' + this.isVisible);
  }

  isSticky: boolean = false;

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

  // ROUTES

  // showSkills = false;
  // showProjects = false;

  // @ViewChild('skillsTrigger') skillsTrigger!: ElementRef;
  // @ViewChild('projectsTrigger') projectsTrigger!: ElementRef;


  // ngAfterViewInit(): void {
  //   this.lazyLoad(this.skillsTrigger.nativeElement, () => {
  //     this.showSkills = true;
  //     this.cdr.detectChanges(); 
  //   });

  //   this.lazyLoad(this.projectsTrigger.nativeElement, () => {
  //     this.showProjects = true;
  //     this.cdr.detectChanges();
  //   });
  // }

  // lazyLoad(element: HTMLElement, callback: () => void): void {
  //   if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
  //     const observer = new IntersectionObserver(([entry]) => {
  //       if (entry.isIntersecting) {
  //         callback();
  //         observer.disconnect();
  //       }
  //     }, { threshold: 0.2 });

  //     observer.observe(element);
  //   } else {
   
  //     callback();
  //   }
  // }

}

