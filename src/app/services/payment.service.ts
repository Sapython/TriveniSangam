import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from 'firebase/functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private https:HttpClient) { }
  capturePayment(paymentDetails: any) {
    return this.https.post(
      environment.cloudFunctions.capturePayment,
      paymentDetails
    );
  }
  
}
