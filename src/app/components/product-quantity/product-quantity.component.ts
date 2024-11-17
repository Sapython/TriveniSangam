import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css']
})
export class ProductQuantityComponent implements OnInit {
  @Input() quantity:number;
  @Output() cartQuantity : EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  decreaseQuantity(){
    if(this.quantity >= 2 ){
      this.quantity = this.quantity - 1;
      this.cartQuantity.emit(this.quantity)
    }
  }
  increaseQuantity() {
    if(this.quantity <= 9 ){
      this.quantity = this.quantity + 1;
      this.cartQuantity.emit(this.quantity)
    }
  }
}
