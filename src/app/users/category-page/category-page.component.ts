import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import Swal from 'sweetalert2';

declare var $:any;
@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {
  categoryID : any;
  productData : any = [];
  singleProductData : any;
  constructor(
    private activeRoute : ActivatedRoute, private databaseService : DatabaseService, private dataProvider : DataProvider
  )
  {
  }

  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.activeRoute.queryParams.subscribe((qp) => {
      console.log('Get Router Params:', qp.category);
      this.categoryID = qp.category;
      this.getProductDetails();
      // console.log('Get Router Params:', qp);
    });
  }
  getProductDetails(){
    if(this.categoryID){
      const data = this.databaseService.getProductsByCategory(this.categoryID).then(
        (res) => {
          //console.log(res);
          res.forEach((resData) => {
            //console.log("resData",resData.data());
            this.productData.push(resData.data());
          })
          this.dataProvider.pageSetting.blur = false;
        }
      );
      //this.productData = data.filter((x : any) => x.id == this.categoryID)
     // this.productData = this.productData[0];
      console.log(this.productData)
    }
  }

  getProductData(data) {
    $('#addons-options-modal').modal('show');
    if (data) {
      this.singleProductData = data;
      console.log("data",this.singleProductData)
    }
  }
  addProductToCart(product: any) {
    console.log("product",product)
    if (product.productid != null) {
      this.databaseService.addToCart(product).then((res) => {
        console.log('res',res)
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Added to cart',
          showConfirmButton: false,
          timer: 1500,
        });
      }).catch((error) => {
        console.log('err', error)
      });
    }
  }

}
