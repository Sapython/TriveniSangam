import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/providers/data.provider';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  constructor(private dataProvider: DataProvider) { }

  ngOnInit(): void {
    console.log(this.dataProvider.selectedDeliveryAddress)
  }

}
