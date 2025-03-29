import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements AfterViewInit {

  @ViewChild('myFormRef') myFormRef!: NgForm;
  @ViewChild('fullName') fullName!: ElementRef;
  @ViewChild('email') email!: ElementRef;
  @ViewChild('message') message!: ElementRef;

  ngAfterViewInit() {
    // `ViewChild` sarà disponibile solo dopo questo punto
  }

  clearForm(form: HTMLFormElement) {
    form.reset();
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
      window.location.href = "https://stefanianeri.github.io/portfolio/#contact";
      this.myFormRef.reset();

      
    } catch (error) {
      console.error("Errore nell'invio del form:", error);
    }
  }
}