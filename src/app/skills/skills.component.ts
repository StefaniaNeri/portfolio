import { ChangeDetectorRef, Component } from '@angular/core';
import { Skill } from './skill/skill.model';
import { PortfolioServService } from '../portfolioServ.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css',
})
export class SkillsComponent implements Skill {
  constructor(
    private portfolioServ: PortfolioServService,
    private cdr: ChangeDetectorRef
  ) {}

  isVisible: boolean = false;

  linguaggio: String;
  src: String;
  progress: String;

  // listaSkill: Skill[] = [
  //   // new CardSkill('HTML5', 'src', 'Frontend'),
  //   // new CardSkill('CSS3', 'src', 'Frontend'),
  //   // new CardSkill('JavaScript', 'src', 'Frontend'),
  //   // new CardSkill('Java', 'src', 'Backend'),
  //   // new CardSkill('MySQL', 'src', 'Backend'),

  //   {
  //     linguaggio: 'HTML5',
  //     src: 'https://img.icons8.com/plasticine/100/html-5.png',
  //   },
  //   { linguaggio: 'CSS3', src: 'https://img.icons8.com/stickers/50/css3.png' },
  //   {
  //     linguaggio: 'JavaScript',
  //     src: 'https://img.icons8.com/fluency/48/javascript.png',
  //   },
  //   {
  //     linguaggio: 'Bootstrap',
  //     src: 'https://img.icons8.com/color-glass/48/bootstrap.png',
  //   },
  //   {
  //     linguaggio: 'Angular',
  //     src: 'https://img.icons8.com/fluency/48/angularjs.png',
  //   },
  //   {
  //     linguaggio: 'Java',
  //     src: 'https://img.icons8.com/nolan/64/java-coffee-cup-logo.png', // https://img.icons8.com/plasticine/100/java-coffee-cup-logo.png
  //   },
  //   {
  //     linguaggio: 'Spring Boot',
  //     src: 'https://img.icons8.com/color/48/spring-logo.png',
  //   },
  //   {
  //     linguaggio: 'MySQL',
  //     src: 'https://img.icons8.com/external-those-icons-flat-those-icons/24/external-MySQL-programming-and-development-those-icons-flat-those-icons.png',
  //   },
  // ];

  listaSkillFE: Skill[] = [
    {
      linguaggio: 'HTML5',
      src: 'https://img.icons8.com/plasticine/200/html-5.png',
      progress: '85',
    },
    {
      linguaggio: 'CSS3',
      src: 'https://img.icons8.com/plasticine/200/css3.png',
      progress: '70',
    },
    {
      linguaggio: 'JavaScript',
      src: 'https://img.icons8.com/fluency/96/javascript.png',
      progress: '60',
    },
    {
      linguaggio: 'Bootstrap',
      src: 'https://img.icons8.com/color/96/bootstrap--v2.png',
      progress: '65',
    },
    {
      linguaggio: 'Angular',
      src: 'https://img.icons8.com/fluency/96/angularjs.png',
      progress: '35',
    },
  ];
  listaSkillBE: Skill[] = [
    {
      linguaggio: 'Java',
      src: 'https://img.icons8.com/nolan/100/java-coffee-cup-logo.png', // https://img.icons8.com/plasticine/100/java-coffee-cup-logo.png
      progress: '35',
    },
    {
      linguaggio: 'Spring Boot',
      src: 'https://img.icons8.com/color/96/spring-logo.png',
      progress: '37',
    },
    {
      linguaggio: 'MySQL',
      src: 'https://img.icons8.com/external-those-icons-flat-those-icons/96/external-MySQL-programming-and-development-those-icons-flat-those-icons.png',
      progress: '40',
    },
  ];

  listaSkillTesting: Skill[] = [
    {
      linguaggio: 'Appium',
      src: '',
      progress: '85',
    },
    {
      linguaggio: 'Gherkin',
      src: '',
      progress: '85',
    },
    {
      linguaggio: 'Cucumber',
      src: '',
      progress: '85',
    },
  ];

  listaSkillMisc: Skill[] = [
    {
      linguaggio: 'Git',
      src: 'https://img.icons8.com/nolan/100/git.png',
      progress: '40',
    },
    {
      linguaggio: 'Npm',
      src: 'https://img.icons8.com/color/96/npm.png',
      progress: '40',
    },
    // {
    //   linguaggio: 'Appium Inspector',
    //   src: '',
    // },
  ];

  onAppear() {
    //this.isVisible = true; // Imposta isVisible a true quando l'elemento appare
    // console.log('Element is visible skills');
    this.portfolioServ.onAppear(); // Chiamata al metodo onAppear del servizio
    // this.cdr.detectChanges();
  }
}