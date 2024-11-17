import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsServiceService } from '../products-service.service';

@Component({
  selector: 'app-single-dish',
  templateUrl: './single-dish.component.html',
  styleUrls: ['./single-dish.component.css']
})
export class SingleDishComponent implements OnInit {
  productId : any;
  productData : any = {};
  constructor( private activeRoute : ActivatedRoute, private productService : ProductsServiceService) {


  }

  ngOnInit(): void {
  }


}
