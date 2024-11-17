import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunction } from 'src/app/common';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  constructor(private databaseService : DatabaseService,private dataProvider : DataProvider) {

  }
  orders:any = [];
  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.getOrders().then(res => {
      res.forEach((data:any)=>{
        let orderData = data.data()
        orderData["id"] = data.id
        this.orders.push(orderData);
      })
      console.log(this.orders);
      this.dataProvider.pageSetting.blur = false;
    })
  }
  getDate(data:any){
    return (new Date(data.seconds+data.nanoseconds)).toDateString();
  }
}
