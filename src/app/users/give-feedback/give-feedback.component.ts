import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunction } from 'src/app/common';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-give-feedback',
  templateUrl: './give-feedback.component.html',
  styleUrls: ['./give-feedback.component.css']
})
export class GiveFeedbackComponent implements OnInit {

  contactForm : UntypedFormGroup;
  validationMessages : any;
  formErrors : any = {
    name: '',
    email: '',
    comment: ''
  };
  constructor(private fb : UntypedFormBuilder,private router : Router, private databaseService:DatabaseService, private alertify:AlertsAndNotificationsService) {
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
      comment: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(200)])
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
      comment: {
        required: `Please Enter Feedback here`,
        maxLength: `Maximum 200 characters allowed.`
      }
    };
  }

  ngOnInit(): void {
  }
  async submitContact( formdata : any ) {
    console.log(formdata)
    this._generateErrors();
    if (this.contactForm.valid) {
      await this.databaseService.addFeedback(
        this.contactForm.get('name')!.value,
        this.contactForm.get('email')!.value,
        this.contactForm.get('comment')!.value
      )
      this.alertify.presentToast('Thank you for your Feedback.','info',3000,'',false);
      this.contactForm.reset();
      this.formErrors = {
        name: '',
        email: '',
        comment: ''
      }
      this.router.navigate(['/feedbacks'])
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
