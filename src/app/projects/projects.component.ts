import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {

  theaterPrjUrl: WritableSignal<String> = signal("https://github.com/StefaniaNeri/theaterPrj");

}
