import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent {

    // @ViewChild('myForm') myForm: ElementRef;


  clearForm(form: any) {
    // const form = document.getElementById("myForm") as HTMLFormElement;
    form.reset();
}

}
