import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener } from '@angular/core';
import { PortfolioServService } from './portfolioServ.service';

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
  constructor(private portfolioServ: PortfolioServService) {}

  titleParent = 'sn';
  isVisible = false;

  onAppear() {
    this.isVisible = true;
    console.log('Visible: ' + this.isVisible);
  }

  isSticky: boolean = false;

  @HostListener('window:scroll', [])
  checkScroll() {
    this.portfolioServ.checkScroll();
    this.isSticky = this.portfolioServ.isSticky;
  }
}
