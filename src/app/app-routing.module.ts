import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from './about-me/about-me.component';
import { SkillsComponent } from './skills/skills.component';
import { HeroComponent } from './hero/hero.component';
import { ProjectsComponent } from './projects/projects.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', component: AppComponent },
  // {
    // path: 'skills', component: SkillsComponent,
    // loadChildren serve per importare moduli, loadComponent per importare componenti standalone
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, 
    //{
    //anchorScrolling: 'enabled',
    //scrollOffset: [0, 64], // opzionale, se hai navbar fissa
   // scrollPositionRestoration: 'enabled'
 // }
)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
