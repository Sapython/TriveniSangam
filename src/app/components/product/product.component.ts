import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() categoryName:string;
  @Input() images:string[];
  @Input() name:string;
  @Input() quantity:number;
  @Input() price:number;
  @Input() description:string;
  @Input() id:string;
  @Input() vegetarian:boolean = true;
  @Output() addToCart:EventEmitter<any> = new EventEmitter();
  @Output() showDetail:EventEmitter<any> = new EventEmitter();
  cartQuantityValue : number;
  constructor() { }
  addToCartTrigger(){
    //console.log(this)
    let data = {
      productid : this.id,
      name : this.name,
      price : this.price,
      description : this.description,
      image : this.images[0],
      quantity : this.cartQuantityValue || 1
    }
    console.log(data)
    this.addToCart.emit(data);
  }
  showDetailTrigger(){
    this.showDetail.emit(this);
  }
  ngOnInit(): void {
  }
  cartQuantityCheck(event){
    console.log(event)
    this.cartQuantityValue = event;
  }

}
