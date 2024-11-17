import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonFunction } from 'src/app/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm : UntypedFormGroup;
  validationMessages : any;
  formErrors : any = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city : ''
  };
  constructor(private fb : UntypedFormBuilder) {
    this.profileForm = this.fb.group({
      name: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      phone: [
        null,
        Validators.compose([Validators.required, Validators.minLength(10)]),
      ],
      address: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(200)])
      ],
      city: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ]
    });
    this.validationMessages = {
      name: {
        required: `Please Enter Name`,
        maxLength: `Maximum 100 characters allowed.`
      },
      email: {
        required: `Please Enter Email Address`,
        email: `Please check the Email Address.`
      },
      phone: {
        required: `Please Enter Phone Number.`,
        minLength: `Please check number.`
      },
      address: {
        required: `Please Enter Address.`,
        maxLength: `Maximum 200 characters allowed.`
      },
      city : {
        required: `Please Enter City.`,
        maxLength: `Maximum 100 characters allowed.`
      }
    };
  }

  ngOnInit(): void {
  }

  updateProfile(formdata : any){
    console.log(formdata);
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
        CommonFunction._setErrMsgs(this.profileForm.get(field), this.formErrors, field, this.validationMessages);
      }
    }
  }
}
