import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataProvider } from 'src/app/providers/data.provider';
import { AuthencationService } from 'src/app/services/authencation.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  constructor(private router : Router,  private databaseService : DatabaseService,public dataProvider : DataProvider, private AuthService : AuthencationService) { }
  cartProducts:any = [];
  cartProductsSubscription:Subscription = Subscription.EMPTY;
  authObserver : Subscription = Subscription.EMPTY;
  loggedIn : any;
  ngOnInit(): void {
    // setInterval(() => {
    //   console.log(this.dataProvider)}, 1000);

     this.isUserLoggedIn();

  }


  ngOnDestroy(){
      this.cartProductsSubscription.unsubscribe();
  }
  getCartCounts(){
      this.cartProductsSubscription = this.databaseService.getCartObservable().subscribe(data => {
        this.cartProducts = [];
        data.forEach((element:any) => {
          this.cartProducts.push(element.data());
        },
        (err) => {
          //console.log(err)
        })
      });
  }
  isUserLoggedIn () {
    this.authObserver = this.AuthService.getUser.subscribe(
      (res) => {
        //console.log("loggedIn",res)
        if(res?.uid){
          this.loggedIn = true;
          this.getCartCounts();
        }
      }
    );
  }

}
