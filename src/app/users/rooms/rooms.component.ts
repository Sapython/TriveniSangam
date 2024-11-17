import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timeStamp } from 'console';
import { Subscription } from 'rxjs';import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import SwiperCore, { SwiperOptions, Virtual } from 'swiper';
import { ProductsServiceService } from '../products-service.service';
SwiperCore.use([Virtual]);
declare var $:any;
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {
  products : any = [
    {
      id : 1,
      name : 'Deluxe Room',
      price : 999,
      description : 'Our Deluxe rooms are naturally lit, air-conditioned and decorated with handcrafted modern artworks.',
      category : 1,
      image : 'deluxe.jpg'
    },
    {
      id : 2,
      name : 'Ultra Deluxe Room',
      price : 1199,
      description : 'Ultra Deluxe rooms are naturally lit, air-conditioned and decorated with handcrafted modern artworks.',
      category : 1,
      image : 'UltraDeluxe.jpg'
    },
    {
      id : 3,
      name : 'Business Rooms',
      price : 1299,
      description : 'Our Business rooms are naturally lit, air-conditioned and decorated with handcrafted modern artworks.',
      category : 1,
      image : 'Business.jpg'
    },
    {
      id : 4,
      name : 'Family Room',
      price : 2499,
      description : 'Our Family rooms are naturally lit, air-conditioned and decorated with handcrafted modern artworks.',
      category : 1,
      image : 'Family.jpg'
    },
    {
      id : 5,
      name : 'Suite Room',
      price : 4999,
      description : 'Our Suite rooms are naturally lit, air-conditioned and decorated with handcrafted modern artworks.',
      category : 1,
      image : '257864609_106830731823902_2664962564244406327_n.jpg'
    }
  ];
  productData : any = {};
  bannerConfig : SwiperOptions = {
    slidesPerView: 4,
    loop : true,
    spaceBetween: 30,
    navigation: true,
    centeredSlides : true,
    autoplay : {
      delay : 3000,
      disableOnInteraction: false
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    // Responsive breakpoints
    breakpoints: {
      '@0.00': {
        slidesPerView: 1,
        spaceBetween: 10
      },
      '@0.75': {
        slidesPerView: 2,
        spaceBetween: 20
      },
      '@1.00': {
        slidesPerView: 3,
        spaceBetween: 30
      },
      '@1.50': {
        slidesPerView: 4,
        spaceBetween: 30
      }
    }
  };
  sliderConfig : SwiperOptions = {
    slidesPerView: 1,
    loop : true,
    spaceBetween: 30,
    navigation: true,
    autoplay : {
      delay : 3000,
      disableOnInteraction: false
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    // Responsive breakpoints
    breakpoints: {
      '@0.00': {
        slidesPerView: 1,
        spaceBetween: 10
      },
      '@0.75': {
        slidesPerView: 1,
        spaceBetween: 20
      },
      '@1.00': {
        slidesPerView: 1,
        spaceBetween: 30
      },
      '@1.50': {
        slidesPerView: 1,
        spaceBetween: 30
      }
    }
  };
  productsSliderConfig : SwiperOptions = {
    slidesPerView: 5,
    loop : true,
    spaceBetween: 10,
    navigation: true,
    centeredSlides : true,
    autoplay : {
      delay : 5000,
      disableOnInteraction: false
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    // Responsive breakpoints
    breakpoints: {
      '@0.00': {
        slidesPerView: 1.15,
        spaceBetween: 10,
        centeredSlides : true,
      },
      '@0.75': {
        slidesPerView: 1.15,
        spaceBetween: 10,
        centeredSlides : true,
      },
      '@1.00': {
        slidesPerView: 3,
        spaceBetween: 10
      },
      '@1.50': {
        slidesPerView: 5,
        spaceBetween: 10
      }
    }
  }
  roomsSubscription : Subscription = Subscription.EMPTY;
  roomCommentsSubscribe : Subscription = Subscription.EMPTY;
  commentText : string;
  selectedRatings: string;
  selectedRoomID : string;
  commentData : any = [];
  isLoggedIn : boolean = false;
  constructor(private router : Router, private productService : ProductsServiceService, private databaseService : DatabaseService, private dataProvider : DataProvider, private alertify : AlertsAndNotificationsService) {
    this.isLoggedIn = this.dataProvider.loggedIn;
  }

  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.roomsSubscription = this.databaseService.getRooms().subscribe(
      (response) => {
        this.products = [];
        response.forEach((roomData) => {

          this.products.push(roomData.data());
        })
        this.dataProvider.pageSetting.blur = false;
      }
    );
  }
  getProductData(id : any){
    if(id){
      this.productData = this.products.filter((x : any) => x.id == id)
      this.productData = this.productData[0];
      this.selectedRoomID = this.productData.id;
      console.log(this.productData);
      this.commentData = [];
      this.getCommentsOfRoom();
      $("#rooms-view").modal('show');
    }
  }
  setRoomCheckout(data:any){
    $("#rooms-view").modal('hide');
    this.dataProvider.checkoutType = 'room';
    this.dataProvider.checkoutData = data;
    this.router.navigateByUrl('/checkout');
  }
  starRaingSet(rating){
    console.log("rating",rating);
    this.selectedRatings = rating;
  }
  validateComment(){
    console.log("commentdata",this.commentText)
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  addComment(){
    console.log("addComment",this.commentText, this.selectedRatings)
    if(this.commentText === undefined){
      this.alertify.presentToast("Please Enter Comment.");
    }else if(this.selectedRatings === undefined){
      this.alertify.presentToast("Please give Star Ratings.");
    }else {
      if(this.commentText != undefined && this.selectedRatings != undefined){
        let data = {
          uid : this.dataProvider.userData.userId,
          name : this.dataProvider.userData.displayName,
          rating : this.selectedRatings,
          comment : this.commentText,
          timeStamp : new Date()
        };
        console.log(data);
        console.log(this.dataProvider.userData);
        this.databaseService.addCommentById(this.selectedRoomID, data).then(
        res => {
          console.log("res", res);
          this.alertify.presentToast("Comment Added!");
          this.selectedRatings = '';
          this.commentText = '';
        }
        );
      }
    }

  }
  getCommentsOfRoom(){
    this.commentData = [];
    this.roomCommentsSubscribe = this.databaseService.getCommentsOfRoom(this.selectedRoomID).subscribe(
      (res) => {
        this.commentData = [];
        console.log("resof com", res);
        res.forEach((commentdata : any) => {
          console.log(commentdata.data());
          //let latest_date =this.datePipe.transform(commentdata.data().timeStamp, 'dd-MM-yyyy');
          //commentdata.data().timeStamp = commentdata.data().timeStamp.dateStr();
          this.commentData.push(commentdata.data());
        })
        console.log(this.commentData)
      }
    );
  }
  ngOnDestroy(): void {
    this.roomsSubscription.unsubscribe();
    this.roomCommentsSubscribe.unsubscribe();
  }
}
