import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataProvider } from 'src/app/providers/data.provider';
import { AuthencationService } from 'src/app/services/authencation.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { ProductsServiceService } from '../products-service.service';

declare var $:any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  isCartHotel : boolean = false;
  cartObserver : Subscription = Subscription.EMPTY;
  authObserver : Subscription = Subscription.EMPTY;
  cartItems : any;
  cartTotal : number = 0;
  loggedIn : boolean = false;
  cartQuantityValue : number;
  constructor(
    private router : Router,
    private productService : ProductsServiceService,
    private databaseService : DatabaseService,
    public dataProvider : DataProvider,
    private AuthService : AuthencationService,
    private uiService : AlertsAndNotificationsService
  ) {}
  ngOnInit(): void {
    this.isUserLoggedIn();
    this.dataProvider.pageSetting.blur = true;
  }
  getCartData(){
    this.dataProvider.pageSetting.blur = true;
    this.cartObserver = this.databaseService.getCartObservable().subscribe((res:any)=>{
      //console.log("res",res);
      this.cartItems= [];
      this.cartTotal = 0;
      res.forEach((cart: any) => {
        // console.log(cart.data());
        let cartData = cart.data();
        cartData.id = cart.id;
        this.cartItems.push(cartData);
        // console.log(this.cartTotal)
        this.cartTotal = this.cartTotal + (cart.data().quantity * cart.data().price);
        // console.log(this.cartTotal)
      })
      // one time delivery charges added
      this.cartTotal = this.cartTotal;
      this.dataProvider.cartTotal = this.cartTotal;
      this.dataProvider.pageSetting.blur = false;
      console.log(this.cartItems);
      this.dataProvider.cartProducts = this.cartItems;
    })
  }
  moveToCheckout(){
    this.dataProvider.checkoutData = {
      name:this.dataProvider.userData.displayName,
      email:this.dataProvider.userData.email,
      phone:this.dataProvider.userData.phoneNumber || '',
      products : this.cartItems,
      totalAmount : this.cartTotal
    }
    this.dataProvider.checkoutType = 'product';
    this.router.navigateByUrl('/checkout');
  }

  isUserLoggedIn () {
    this.authObserver = this.AuthService.getUser.subscribe(
      (res) => {
        //console.log("loggedIn",res)
        if(res?.uid){
          this.loggedIn = true;
          this.getCartData();
        }
      }
    );
  }
  cartQuantityCheck(id,event){
    console.log(id,event)
    this.cartQuantityValue = event;
    this.databaseService.updateCart(id, event).then(
      res=> {
        console.log(res)
      }
    )
  }
  removeFromCart(id){
    console.log('id',id);
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteCartProduct(id).then(
      (res) => {
        this.dataProvider.pageSetting.blur = false;
        this.uiService.presentToast("Item Removed.");
        this.getCartData();
      }
    );
  }
  ngOnDestroy (): void {
    this.cartObserver.unsubscribe();
    this.authObserver.unsubscribe();
  }
}
