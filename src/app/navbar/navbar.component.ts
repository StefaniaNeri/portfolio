import { Component, HostListener, Input } from '@angular/core';
import { PortfolioServService } from '../portfolioServ.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private portfolioServ: PortfolioServService) {}

  isSticky: boolean = false;

  @HostListener('window:scroll', [])
  checkScroll() {
    this.portfolioServ.checkScroll();
    this.isSticky = this.portfolioServ.isSticky;
  }
}
