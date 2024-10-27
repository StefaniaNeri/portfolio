import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.css',
})
export class CurriculumComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  urlCV: string = 'assets/CV new SF.pdf';

  openCV() {
    if (isPlatformBrowser(this.platformId)) {
      window.open(this.urlCV, '_blank');
    }
  }
}
