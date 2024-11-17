import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
JSon
  constructor() { }

  ngOnInit(): void {
  var stud = JSON.parse(localStorage.get("studentData"))
  }

}
