import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonFunction } from 'src/app/common';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  contactForm : UntypedFormGroup;
  validationMessages : any;
  formErrors : any = {
    name: '',
    email: '',
    phone: '',
    comment: ''
  };
  constructor(private fb : UntypedFormBuilder, private databaseService:DatabaseService, private alertify:AlertsAndNotificationsService) {
    this.contactForm = this.fb.group({
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
      comment: [
        null,
        Validators.compose([Validators.maxLength(500)])
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
      comment: {
        maxLength: `Maximum 500 characters allowed.`
      }
    };
  }

  ngOnInit(): void {
  }
  async submitContact( formdata : any ) {
    console.log(formdata)
    if(formdata.invalid){
      this._generateErrors();
    }

    if (formdata.valid) {
      await this.databaseService.addContactRequest(
        this.contactForm.get('name')!.value,
        this.contactForm.get('email')!.value,
        this.contactForm.get('phone')!.value,
        this.contactForm.get('comment')!.value
      )
      this.alertify.presentToast('Thank you for contacting us. We will get back to you soon.','info',3000,'',false);
      //this.contactForm.reset();
      this.formErrors = {
        name: '',
        email: '',
        phone: '',
        comment: ''
      };
      this.contactForm.markAsPristine();
      this.contactForm.markAsUntouched();
    }
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
