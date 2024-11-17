import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';import { CommonFunction } from 'src/app/common';
import { DataProvider } from 'src/app/providers/data.provider';
import { AuthencationService } from 'src/app/services/authencation.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  checkoutType : boolean = true;
  addressForm : UntypedFormGroup;
  validationMessages : any;
  formErrors : any = {
    area: '',
    address: '',
    instructions: '',
    nickname: ''
  };
  userLoggedinSubscription : Subscription;
  userData : any;
  constructor(private fb : UntypedFormBuilder, public authService : AuthencationService, public dataProvider : DataProvider) {
    this.addressForm = fb.group({
      area: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      address: [
        null,
        Validators.compose([Validators.required]),
      ],
      instructions: [
        null,
      ],
      nickname: [
        null,
      ]
    });
    this.validationMessages = {
      area: {
        required: `Please Enter Area`,
        maxLength: `Maximum 100 characters allowed.`
      },
      address: {
        required: `Please Enter Address`
      }
    };
  }

  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.userData = this.dataProvider.userData;
    this.dataProvider.pageSetting.blur = false;
    console.log(this.userData)
  }
  addAddress( formdata : any ) {
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
        CommonFunction._setErrMsgs(this.addressForm.get(field), this.formErrors, field, this.validationMessages);
      }
    }
  }
}
