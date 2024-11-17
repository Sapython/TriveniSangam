import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
@Input() name:string ='Ajay Debgun'
@Input() person:number =1
@Input() personType:string ='Adult'
@Input() phoneNo:number =9989854562
@Input() checkIn:string ='22/11/22'
@Input() checkOut:string ='27/11/22'
@Input() checkIntime:string ='11:25'
@Input() checkOuttime:string ='2:50'
@Input() paymnet:string ='Pending'
  constructor() { }

  ngOnInit(): void {
  }

}
