import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Timestamp } from 'firebase/firestore';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { Guest } from 'src/app/structures/booking.structure';
import { Order } from 'src/app/structures/orders.structure';
import { Room } from 'src/app/structures/rooms.structure';
declare const UIkit: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css', '../manager.util.scss'],
})
export class OrdersComponent implements OnInit {
  dishes: any[];
  bookedRooms: any[];
  dishControls: any[] = [];
  dishesForm:FormGroup = new FormGroup({});
  orderForm: FormGroup = new FormGroup({
    dishes: this.dishesForm,
    roomId: new FormControl(null, [Validators.required]),
  });

  pendingOrders: Order[];
  completedOrders: Order[];
  cancelledOrders: Order[];

  dishNames: { [key: string]: string };
  roomNos: { [key: string]: string };
  guests: { [key: string]: Guest };

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(
    private databaseService: DatabaseService,
    private dataProvider: DataProvider,
    private alertService: AlertsAndNotificationsService
  ) {}

  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.getPendingOrders().then((docs) => {
      this.pendingOrders = [];
      this.roomNos = {};
      this.dishNames = {};
      this.guests = {};

      docs.forEach((doc) => {
        const order = { orderId: doc.id, ...doc.data() } as Order;
        this.pendingOrders.push(order);

        // Get room number
        if (!(order.roomId in this.roomNos)) {
          this.databaseService.getRoom(order.roomId).then((doc) => {
            this.roomNos[order.roomId] = (doc.data() as Room).number;
          });
        }

        // Get dish details
        order.dishes.forEach((dish:any)=>{
          console.log(dish)
          if (!(dish.id in this.dishNames)) {
            this.databaseService.getDish(dish.id).then((doc) => {
              const dish = doc.data();
              console.log(dish);
              if (dish) {
                this.dishNames[dish.id] = dish.name;
              }
            });
          }
        })

        // Get guest details
        if (!(order.orderId! in this.guests)) {
          this.databaseService
            .getRoomGuest(order.roomId, order.time)
            .then((doc) => {
              this.guests[order.orderId!] = doc.data() as Guest;
              console.log(this.guests);
            });
        }
      });
      this.dataProvider.pageSetting.blur = false;
    });
  }

  getPendingOrderTime(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'long',
      day: 'numeric',
    });
  }

  getOrderTime(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      weekday: 'long',
    });
  }

  markComplete(orderId: string) {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.editOrderStatus(orderId, 'Completed').then(() => {
      this.ngOnInit();
      this.dataProvider.pageSetting.blur = false;
      this.alertService.presentToast('Order marked as complete');
    });
  }

  cancelOrder(orderId: string) {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.editOrderStatus(orderId, 'Cancelled').then(() => {
      this.ngOnInit();
      this.dataProvider.pageSetting.blur = false;
      this.alertService.presentToast('Order cancelled');
    });
  }

  onTabChange() {
    switch (this.tabGroup.selectedIndex) {
      case 1:
        if (!this.completedOrders) {
          this.dataProvider.pageSetting.blur = true;
          this.databaseService.getFirstCompletedOrders(10).then((docs) => {
            this.completedOrders = [];

            docs.forEach((doc) => {
              const order = doc.data() as Order;
              this.completedOrders.push(order);

              // Get room number
              if (!(order.roomId in this.roomNos)) {
                this.databaseService.getRoom(order.roomId).then((doc) => {
                  this.roomNos[order.roomId] = (doc.data() as Room).number;
                });
              }

              // Get dish
              order.dishes.forEach((dish:any)=>{
                if (!(dish.id in this.dishNames)) {
                  this.databaseService.getDish(dish.id).then((doc) => {
                    const dish = doc.data();
                    if (dish) {
                      this.dishNames[dish.id] =
                        dish.name.charAt(0).toUpperCase() + dish.name.slice(1);
                    }
                  });
                }
              })

              // Get guest
              if (!(order.orderId! in this.guests)) {
                this.databaseService
                  .getRoomGuest(order.roomId, order.time)
                  .then((doc) => {
                    this.guests[order.orderId!] = doc.data() as Guest;
                  });
              }
            });

            this.dataProvider.pageSetting.blur = false;
          });
        }
        break;

      case 2:
        if (!this.cancelledOrders) {
          this.dataProvider.pageSetting.blur = true;
          this.databaseService.getFirstCancelledOrders(10).then((docs) => {
            this.cancelledOrders = [];

            docs.forEach((doc) => {
              const order = doc.data() as Order;
              this.cancelledOrders.push(order);

              // Get room number
              if (!(order.roomId in this.roomNos)) {
                this.databaseService.getRoom(order.roomId).then((doc) => {
                  this.roomNos[order.roomId] = (doc.data() as Room).number;
                });
              }

              // Get dish details
              order.dishes.forEach((dish:any)=>{
                if (!(dish.id in this.dishNames)) {
                  this.databaseService.getDish(dish.id).then((doc) => {
                    const dish = doc.data();
                    if (dish) {
                      this.dishNames[dish.id] =
                        dish.name.charAt(0).toUpperCase() + dish.name.slice(1);
                    }
                  });
                }
              })

              // Get guest
              if (!(order.orderId! in this.guests)) {
                this.databaseService
                  .getRoomGuest(order.roomId, order.time)
                  .then((doc) => {
                    this.guests[order.orderId!] = doc.data() as Guest;
                  });
              }
            });

            this.dataProvider.pageSetting.blur = false;
          });
        }
        break;
    }
  }

  async openOrderModal() {
    this.dataProvider.pageSetting.blur = true;
    if (!this.dishes) {
      await this.databaseService.getAllRecipes().then((docs) => {
        this.dishes = [];
        docs.forEach((doc) => {
          this.dishes.push({ dishId: doc.id, ...doc.data() });
        });
      });
    }
    if (!this.bookedRooms) {
      // await this.databaseService.getBookedRooms().then((docs) => {
      //   this.bookedRooms = [];
      //   docs.forEach((doc) => {
      //     this.bookedRooms.push({ roomId: doc.id, ...doc.data() });
      //   });
      // });
    }

    // Reset order form
    this.orderForm.patchValue({
      dishId: null,
      quantity: 1,
      roomId: null,
    });

    UIkit.modal(document.getElementById('order-modal')).show();
    this.dataProvider.pageSetting.blur = false;
  }

  addOrder() {
    const dishes:any[] = []
    this.dishControls.forEach((element:any) => {
      dishes.push({id:element.id.value,quantity:element.quantity.value})
    });
    this.dataProvider.pageSetting.blur = true;
    const order = {
      ...this.orderForm.value,
      dishes:dishes,
      status: 'Pending',
      time: Timestamp.now(),
    } as Order;
    this.databaseService.addOrder(order).then(() => {
      UIkit.modal(document.getElementById('order-modal')).hide();
      this.ngOnInit();
      this.dataProvider.pageSetting.blur = false;
      this.alertService.presentToast('Order added');
    });
  }

  addDish(){
    const control = new FormControl(null, [Validators.required]);
    const quantityControl = new FormControl(1, [Validators.required]);
    this.dishesForm.addControl('dishId'+(this.dishControls.length).toString(), control);
    this.dishesForm.addControl('quantity'+(this.dishControls.length).toString(), quantityControl);
    this.dishControls.push({id:control,quantity:quantityControl})
  }
  removeDish(index:number){
    this.dishesForm.removeControl('dishId'+(index).toString());
    this.dishControls.splice(index,1);
  }
}
