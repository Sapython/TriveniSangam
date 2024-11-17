import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
  };
  zoom = 20;
  markers: any[] = [];
  constructor(private dataProvider : DataProvider, private databaseService : DatabaseService) { }
  orders:any[] = [];
  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.getUsers().then((res:any) => {
      res.forEach((user)=>{
        this.databaseService.getOrderForUser(user.id).then((userOrder:any) => {
          userOrder.forEach(async (data:any)=>{
            let orderData = data.data()
            orderData["id"] = data.id
            if (orderData.type=='product'){
              await this.databaseService.getSpecificDeliveryAddress(orderData.address).then((address:any) => {
                orderData.address = address.data()
                let position:google.maps.LatLngLiteral = {
                  lat: Number(address.data().lat),
                  lng: Number(address.data().lng),
                }
                orderData['marker']={
                  position:position,
                  label:{
                    color: 'red',
                    text: 'Order Location',
                  },
                  title: 'Your Position ' + (this.markers.length + 1),
                  options: {animation: google.maps.Animation.DROP, draggable: false},
                }
              })
            }
            this.orders.push(orderData);
          })
          this.dataProvider.pageSetting.blur = false;
        })
      }) 
    })
  }
  getAddress(addressId:string):any{
    // this.databaseService.getSpecificDeliveryAddress(addressId).then((res:any) => {
    //   console.log(res);
    //   return res.data();
    // });
  }
  getDate(data:any):string{
    // console.log(data.toDate());
    return data.toDate().toDateString();
    // return (new Date(data.seconds)).toDateString();
  }
}
