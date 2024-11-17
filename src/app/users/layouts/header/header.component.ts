import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProvider } from 'src/app/providers/data.provider';
import { AuthencationService } from 'src/app/services/authencation.service';
import hcOffcanvasNav from 'hc-offcanvas-nav';
import { Subscription } from 'rxjs';import { DatabaseService } from 'src/app/services/database.service';


declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartProducts:any = [];
  cartProductsSubscription:Subscription = Subscription.EMPTY;
  authObserver : Subscription = Subscription.EMPTY;
  loggedIn : any;
  constructor(private databaseService : DatabaseService,private AuthService : AuthencationService, private router : Router,private activeRoute : ActivatedRoute,public dataProvider:DataProvider, public authService : AuthencationService) { }
  ngOnInit(): void {
    $(document).ready(function () {

      $('#dismiss, .overlay').on('click', function () {
          $('#sidebar').removeClass('active');
          $('.overlay').removeClass('active');
      });
      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').addClass('active');
          $('.overlay').addClass('active');
          $('.collapse.in').toggleClass('in');
          $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
  });
  this.isUserLoggedIn();
  }
  setRoute(routerURL){
    console.log(routerURL)
  }
  getCartCounts(){
    this.cartProductsSubscription = this.databaseService.getCartObservable().subscribe(data => {
      this.cartProducts = [];
      data.forEach((element:any) => {
        this.cartProducts.push(element.data());
      })
      //console.log(this.cartProducts)
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
