import { CUSTOM_ELEMENTS_SCHEMA, importProvidersFrom, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FooterComponent } from './footer/footer.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { SkillComponent } from './skills/skill/skill.component';
import { AppearDirective } from './appear.directive';
import { provideAnimations } from '@angular/platform-browser/animations';
import { GALLERY_CONFIG, GalleryConfig, GalleryModule } from 'ng-gallery';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeroComponent,
    SkillsComponent,
    ProjectsComponent,
    CurriculumComponent,
    ContactsComponent,
    FooterComponent,
    AboutMeComponent,
    SkillComponent,
    AppearDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GalleryModule,
    FormsModule, NgToastModule
    ],
  providers: [provideClientHydration(), provideAnimations(), importProvidersFrom(GalleryModule),  {
    provide: GALLERY_CONFIG,
    useValue: {
      autoHeight: true,
      imageSize:'cover'
    } as GalleryConfig
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {
//   if (isPlatformBrowser(this.platformId)) {
//     import('GalleryModule').then(({ GalleryModule }) => {
//       console.log('ng-gallery caricato solo lato browser!');
//     });
//   }
// }

}
