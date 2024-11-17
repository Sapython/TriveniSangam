import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonFunction } from 'src/app/common';
import { DataProvider } from 'src/app/providers/data.provider';
import { AuthencationService } from 'src/app/services/authencation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  toggleForm : boolean = false;
  loginForm : UntypedFormGroup;
  signUpForm : UntypedFormGroup;
  validationMessages : any;
  validationMessagesSignup : any;
  formErrors : any = {
    username: '',
    password: '',
  };
  formErrorsSignup : any = {
    username: '',
    email: '',
    password: '',
    cnfpassword: '',
  };
  constructor(public authService:AuthencationService, private fb : UntypedFormBuilder,public dataProvider: DataProvider) {
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(60),
          Validators.email,
        ]),
      ],
      password: [
        null,
        Validators.compose([Validators.required]),
      ]
    });
    this.signUpForm = fb.group({
      username: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
        ]),
      ],
      password: [
        null,
        Validators.compose([Validators.required]),
      ],
      cnfpassword: [
        null,
        Validators.compose([Validators.required]),
      ]
    });
    this.validationMessages = {
      email: {
        required: `Please Enter Email`,
        maxLength: `Maximum 60 characters allowed.`
      },
      password: {
        required: `Please Enter Password`
      }
    };
    this.validationMessagesSignup = {
      username: {
        required: `Please Enter Username`,
        maxLength: `Maximum 50 characters allowed.`
      },
      email: {
        required: `Please Enter Email Address`,
        email: `Please check the Email Address.`
      },
      password: {
        required: `Please Enter Password`
      },
      cnfpassword: {
        required: `Please Enter Confirm Password`
      }
    };
  }

  ngOnInit(): void {
  }
  loginSubmit(formdata : any) {
    //console.log(formdata)
    this._generateErrors('login');
    if (this.loginForm.valid) {
      this.authService.loginEmailPassword(formdata.value.email, formdata.value.password);
    }
  }
  signupSubmit(formdata : any) {
    //console.log(formdata)
    this._generateErrors('signup');
    // console.log(formdata.value.email)
    if (this.signUpForm.valid) {
      this.authService.signUpWithEmailAndPassword(formdata.value.email, formdata.value.password,formdata.value.username);
    }
  }
  passwordConfirming(c: AbstractControl):{invalid: boolean} {
    if (c.get('password')!.value !== c.get('confirm_password')!.value) {
        return {invalid: true};
    } else {
      return {invalid: false};
    }
  }
  // ERROR GENERATIONS
  private _generateErrors(formname) {
    console.log(formname)
    let formName : any;
    let validations : any;
    let formErrorsData : any;
    if(formname == 'login'){
      console.log("login")
      formName = this.loginForm;
      validations = this.validationMessages;
      formErrorsData = this.formErrors;
    }else if(formname == 'signup'){
      console.log("signup")
      formName = this.signUpForm;
      validations = this.validationMessagesSignup;
      formErrorsData = this.formErrorsSignup;
    }
    console.log(formName, validations, formErrorsData)
    // Check validation and set errors
    for (const field in formErrorsData) {
      if (formErrorsData.hasOwnProperty(field)) {
        // Set errors for fields not inside datesGroup
        // Clear previous error message (if any)
        this.formErrors[field] = '';
        CommonFunction._setErrMsgs(formName.get(field), formErrorsData, field, validations);
      }
    }
  }
}
