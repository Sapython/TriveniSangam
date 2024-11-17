import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ProductsServiceService {
  private myData = new BehaviorSubject(true);
  allProducts : any = [
    {
      id : 1,
      name : 'Main course',
      products : [
        {
          id : 1,
          name : 'Burger with Fries & Coke',
          price : '250.00',
          description : 'Some product description will go here.',
          image : 'product(1).jpeg'
        },
        {
          id : 2,
          name : 'Maharaja Dosa',
          price : '260.00',
          description : 'Some product description will go here.',
          image : 'product(2).jpeg'
        },
        {
          id : 3,
          name : 'Paneer Deluxe Dosa',
          price : '270.00',
          description : 'Some product description will go here.',
          image : 'product(3).jpeg'
        },
        {
          id : 4,
          name : 'Masala Dosa',
          price : '330.00',
          description : 'Some product description will go here.',
          image : 'product(4).jpeg'
        },
        {
          id : 5,
          name : 'Schezwan Fried Rice',
          price : '260.00',
          description : 'Some product description will go here.',
          image : 'product(9).jpeg'
        },
        {
          id : 6,
          name : 'Soup',
          price : '175.00',
          description : 'Some product description will go here.',
          image : 'product(6).jpeg'
        }
      ],
      image : '2020-11-11-19-20-00GujaratiCategory.png'
    },
    {
      id : 2,
      name : 'Punjabi Plaza',
      products : [
        {
          id : 7,
          name : 'Harabhara Kabab (6)pcs',
          price : '200.00',
          description : 'Some product description will go here.',
          image : 'product(7).jpeg'
        },
        {
          id : 8,
          name : 'Stuffed Tandoori Alo',
          price : '230.00',
          description : 'Some product description will go here.',
          image : 'product(8).jpeg'
        },
        {
          id : 9,
          name : 'Veg seekh kabab',
          price : '270.00',
          description : 'Some product description will go here.',
          image : 'product(9).jpeg'
        },
        {
          id : 10,
          name : 'Paneer malai tikka',
          price : '280.00',
          description : 'Some product description will go here.',
          image : 'product(10).jpeg'
        },
        {
          id : 11,
          name : 'Paneer Tikka Achari',
          price : '250.00',
          description : 'Some product description will go here.',
          image : 'product(11).jpeg'
        },
        {
          id : 12,
          name : 'Paneer Tikka',
          price : '270.00',
          description : 'Some product description will go here.',
          image : 'product(12).jpeg'
        }
      ],
      image : '2020-11-11-19-20-25PunjabiCategory.png'
    }
    ,
    {
      id : 3,
      name : 'South Indian',
      products : [
        {
          id : 13,
          name : 'Chilly Masala Fries',
          price : 80,
          description : 'Some product description will go here.',
          image : 'product(13).jpeg'
        },
        {
          id : 14,
          name : 'South Indian Desi Pasta',
          price : 100,
          description : 'Some product description will go here.',
          image : 'product(14).jpeg'
        },
        {
          id : 15,
          name : 'Chilly Garlic masala noodles',
          price : 120,
          description : 'Some product description will go here.',
          image : 'product(15).jpeg'
        },
        {
          id : 16,
          name : 'Mexican Roast Dosa',
          price : 150,
          description : 'Some product description will go here.',
          image : 'product(16).jpeg'
        },
        {
          id : 26,
          name : 'Maharaja Dosa',
          price : 150,
          description : 'Some product description will go here.',
          image : 'product(3).jpeg'
        }
      ],
      image : 'south.png'
    },
    {
      id: 4,
      name : 'Pav Bhaji',
      products : [
        {
          id : 17,
          name : 'Butter Pav Bhaji',
          price : 120,
          description : 'Some product description will go here.',
          image : 'butter-pav-bhaji.jpg'
        },
        {
          id : 18,
          name : 'Cheese Pav bhaji',
          price : 140,
          description : 'Some product description will go here.',
          image : 'img_20180322_224611_302786315533.jpg'
        },
        {
          id : 19,
          name : 'Masala Pav (2 pcs)',
          price : 100,
          description : 'Some product description will go here.',
          image : 'Masala Pav 2 Pcs A.jpg'
        },
        {
          id : 20,
          name : 'Butter Pav (1 pc)',
          price : 20,
          description : 'Some product description will go here.',
          image : 'butterpav.png'
        },
        {
          id : 27,
          name : 'Special mumbai Pavbhaji',
          price : 100,
          description : 'Some product description will go here.',
          image : 'product(11).jpeg'
        }
      ],
      image : '2020-11-11-19-20-37AllDaySnacksCategory.png'
    },
    {
      id: 5,
      name : 'Fresh Juices',
      products : [
        {
          id : 21,
          name : 'Jaljira Soda',
          price : 50,
          description : 'Some product description will go here.',
          image : 'JalJeera-Recipe.png'
        },
        {
          id : 22,
          name : 'Lime Juice',
          price : 50,
          description : 'Some product description will go here.',
          image : 'Lime Juice.jpg'
        },
        {
          id : 23,
          name : 'Lime Soda',
          price : 60,
          description : 'Some product description will go here.',
          image : 'Lime Soda.webp'
        },
        {
          id : 24,
          name : 'Shikanji',
          price : 90,
          description : 'Some product description will go here.',
          image : 'Shikanji.jpg'
        },
        {
          id : 25,
          name : 'Orange Juice',
          price : 120,
          description : 'Some product description will go here.',
          image : 'orange-juice-1024x1024.png'
        }
      ],
      image : 'Addons.png'
    }
  ]
  constructor() { }
  getSouthProducts() {
    const products : any = [
      {
        id : 1,
        name : 'Sheera',
        price : 80,
        description : 'Some product description will go here.',
        category : 1,
        image : 'product(1).jpeg'
      },
      {
        id : 2,
        name : 'Upama / Rawa Kichhdi',
        price : 100,
        description : 'Some product description will go here.',
        category : 1,
        image : 'product(2).jpeg'
      },
      {
        id : 3,
        name : 'Medu vada',
        price : 120,
        description : 'Some product description will go here.',
        category : 1,
        image : 'product(3).jpeg'
      },
      {
        id : 4,
        name : 'Puri Bhaji',
        price : 150,
        description : 'Some product description will go here.',
        category : 1,
        image : 'product(4).jpeg'
      }
    ];
    return this.allProducts;
  }
  addToCart() : Observable<any>{
    return observableOf(true);
  }
  getCartStatus(): Observable<boolean> {
    return this.myData;
  }
  updateCart(data){
    this.myData.next(data);
  }
}
