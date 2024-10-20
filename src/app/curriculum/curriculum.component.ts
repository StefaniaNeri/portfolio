import { Component } from '@angular/core';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.css',
})
export class CurriculumComponent {
  urlCV: string = 'assets/CV new SF.pdf';

  openCV() {
    if (typeof window !== 'undefined') {
      window.open(this.urlCV, '_blank');
    }
  }
}
