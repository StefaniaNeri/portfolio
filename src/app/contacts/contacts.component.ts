import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements AfterViewInit {
  constructor(private toast: NgToastService) {}

  @ViewChild('myFormRef') myFormRef!: NgForm;
  @ViewChild('fullName') fullName!: ElementRef;
  @ViewChild('email') email!: ElementRef;
  @ViewChild('message') message!: ElementRef;

  ngAfterViewInit() {
   
  }

  async sendForm() {
    try {

      const formElement = document.querySelector('form') as HTMLFormElement;
      const response = await fetch(formElement.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: this.fullName.nativeElement.value,
          email: this.email.nativeElement.value,
          message: this.message.nativeElement.value
        })
      });

      const data = await response.json();
      console.log("Risposta dal server:", data);
      // window.location.href = "https://stefanianeri.github.io/portfolio/#contact";
      this.myFormRef.reset();
      this.showSuccess();
      
    } catch (error) {
      console.error("Errore nell'invio del form:", error);
      this.showError();
    }
  }


  showSuccess() {
    this.toast.success('Message sent successfully!', '', 6000);
    
  }

  showError() {
    this.toast.danger('Something went wrong. Please try again.', 'Error', 6000);
  }

  showInfo() {
    this.toast.info('Info Message', 'Information', 6000);
  }

  showWarning() {
    this.toast.warning('Warning Message', 'Warning', 6000);
  }
}