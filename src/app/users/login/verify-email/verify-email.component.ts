import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { CommonFunction } from 'src/app/common';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  contactForm : UntypedFormGroup;
  validationMessages : any;
  formErrors : any = {
    name: '',
    email: '',
    phone: '',
    comment: ''
  };
  constructor() { }

  ngOnInit(): void {
  }
  async submitContact( formdata : any ) {
    console.log(formdata)
    this._generateErrors();
  }
  // ERROR GENERATIONS
  private _generateErrors() {
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // Set errors for fields not inside datesGroup
        // Clear previous error message (if any)
        this.formErrors[field] = '';
        CommonFunction._setErrMsgs(this.contactForm.get(field), this.formErrors, field, this.validationMessages);
      }
    }
  }

}
