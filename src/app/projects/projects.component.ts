import { Component, OnInit, Inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Gallery, GalleryItem, ImageItem} from 'ng-gallery';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit{
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }
 
  theaterPrjUrl: WritableSignal<String> = signal("https://github.com/StefaniaNeri/theaterPrj");
  tripzUrl: WritableSignal<String> = signal("https://github.com/StefaniaNeri/Tripz");

  
  tripzPreviews: GalleryItem[];

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadGallery();
    }
  }

  private loadGallery(){

    this.tripzPreviews = [
      new ImageItem({
        src: 'assets/anteprime-tripz/Anteprima - Login.png', thumb: 'assets/anteprime-tripz/Anteprima - Login.png'
      }),
      new ImageItem({
        src: 'assets/anteprime-tripz/Anteprima - Registrazione utente.webp', thumb: 'assets/anteprime-tripz/Anteprima - Registrazione utente.webp'
      }),
      new ImageItem({
        src: 'assets/anteprime-tripz/Anteprima - Vista admin - Catalogo.webp', thumb: 'assets/anteprime-tripz/Anteprima - Vista admin - Catalogo.webp'
      }),
      new ImageItem({
        src: 'assets/anteprime-tripz/Anteprima - Vista admin - Lista utenti.webp', thumb: 'assets/anteprime-tripz/Anteprima - Vista admin - Lista utenti.webp'
      }),
      new ImageItem({
        src: 'assets/anteprime-tripz/Anteprima - Vista utente - Carrello.webp', thumb: 'assets/anteprime-tripz/Anteprima - Vista utente - Carrello.webp'
      }),
      new ImageItem({
        src: 'assets/anteprime-tripz/Anteprima - Vista utente - Catalogo.webp', thumb: 'assets/anteprime-tripz/Anteprima - Vista utente - Catalogo.webp'
      }),
    ]

  }


  }

