import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit,OnDestroy {
  categories:any = [];
  constructor(private databaseService:DatabaseService, private dataProvider : DataProvider) { }
  categorySubscription: Subscription;
  categoryName:string = "";
  productsData : any = [];
  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.categorySubscription = this.databaseService.getCategories().subscribe((res)=>{
      // this.categories = res.data();
      this.categories = res.category;
    });
    this.databaseService.getProducts().subscribe(
      (res) => {
        this.productsData = []
        res.forEach((pData) => {
          this.productsData.push(pData.data());
        })
        this.dataProvider.pageSetting.blur = false;
      }
    );
  }
  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }
  addCategory(){
    this.databaseService.addCategory(this.categoryName);
    // this.ngOnInit();
  }
  deleteProduct(id){
    if(confirm('Are you sure you want to delete this product?')){
      this.databaseService.deleteProduct(id);
      // this.ngOnInit();
    }
  }
  deleteCategory(categoryName){
    if(confirm('Are you sure you want to delete '+categoryName+' category?')){
      this.databaseService.deleteCategory(categoryName);
      // this.ngOnInit();
    }
  }
}
