import { Component, OnInit } from '@angular/core';

declare var $:any;
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems = [
    {
      id : 1,
      name : 'Burger with Fries & Coke',
      price : 250,
      image: 'product(1).jpeg'
    },
    {
      id : 2,
      name : 'Maharaja Dosa',
      price : 150,
      image: 'product(2).jpeg'
    },
    {
      id : 3,
      name : 'Paneer Deluxe Dosa',
      price : 270,
      image: 'product(3).jpeg'
    },
    {
      id : 4,
      name : 'Harabhara Kabab (6)pcs',
      price : 320,
      image: 'product(4).jpeg'
    },
    {
      id : 5,
      name : 'Chilly Masala Fries',
      price : 250,
      image: 'product(5).jpeg'
    },
    {
      id : 6,
      name : 'Orange Juice',
      price : 120,
      image: 'product(6).jpeg'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

  showProductRatings (id : any) {
    console.log(id)
    $("#SingleProductRating").modal('show');
  }
}
