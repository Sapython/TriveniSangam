import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonFunction } from 'src/app/common';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { Product } from 'src/app/structures/method.structure';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit, OnDestroy {
  addProductForm : UntypedFormGroup;
  validationMessages : any;
  imageOne:File;
  imageTwo:File;
  fileCounter:number = 0;
  vegetarian : boolean = false;
  formErrors : any = {
    name: '',
    price: '',
    description: '',
    category: '',
    vendor : '',
  };
  constructor(private fb : UntypedFormBuilder, private router : Router, private databaseService:DatabaseService, private alertify:AlertsAndNotificationsService) {
    this.addProductForm = this.fb.group({
      name: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      price: [
        null,
        Validators.compose([Validators.required, Validators.min(10)]),
      ],
      description: [
        null,
        Validators.compose([Validators.required, Validators.minLength(25), Validators.maxLength(200)]),
      ],
      category: [
        null,
        Validators.compose([Validators.required])
      ],
    });
    this.validationMessages = {
      name: {
        required: `Please Enter Name`,
        maxLength: `Maximum 100 characters allowed.`
      },
      price: {
        required: `Please Enter Price`,
        min: `Minimum 10 rupees required.`
      },
      description: {
        required: `Please Enter Description.`,
        minLength: `Minimum 25 characters required.`,
        maxLength: `Maximum 200 characters allowed.`
      },
      category: {
        required: `Please Select Category`,
      },
    };
  }
  vendors:any = [];
  categories:any = [];
  categorySubscription: Subscription;
  ngOnInit(): void {
    this.databaseService.getVendors().then((data:any)=>{
      // console.log(data);
      data.forEach((element:any) => {
        // console.log(element);
        // console.log(element.data());
        this.vendors.push({name:element.data().displayName,image:element.data().photoURL,id:element.id});
      })
    })
    this.categorySubscription = this.databaseService.getCategories().subscribe((res)=>{
      // this.categories = res.data();
      this.categories = res.category;
    });
  }
  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }
  setImage(type:'one'|'two',event:any){
    if(type==='one'){
      this.imageOne = event.target.files[0];
    }else if (type==='two'){
      this.imageTwo = event.target.files[0];
    } else {
      this.alertify.presentToast('Invalid File Format','error');
    }
  }
  async addProduct(formdata : any){
    console.log(this.addProductForm);
    this._generateErrors();
    if (this.imageOne!=undefined && this.imageTwo!=undefined){
      if(this.addProductForm.errors===null && confirm('Are you sure you want to upload this data')){
        let imageOneUrl = await this.databaseService.upload('products/'+this.addProductForm.value.name+'/images/imageOne',this.imageOne)
        let imageTwoUrl = await this.databaseService.upload('products/'+this.addProductForm.value.name+'/images/imageTwo',this.imageTwo)
        if (typeof imageOneUrl == 'string' && typeof imageTwoUrl == 'string'){
          let product : Product = {
            name : this.addProductForm.value.name,
            price : this.addProductForm.value.price,
            description : this.addProductForm.value.description,
            category : this.addProductForm.value.category,
            images : {
              imageOne : imageOneUrl,
              imageTwo : imageTwoUrl,
            },
            id:'',
            dateOfPublish:new Date(),
            vegetarian:this.vegetarian
          }
          //console.log('Product data',product);
          this.databaseService.addProduct(product).then(()=>{
            this.alertify.presentToast('Product Added Successfully','info');
            this.resetForm();
            this.router.navigate(['/admin/products'])
          }).catch(()=>{
            this.alertify.presentToast('Something went wrong','error');
          })
        }
      } else {
        this.alertify.presentToast('Please fill all the fields correctly','error');
      }
    } else {
      this.alertify.presentToast('Please upload all the images','error');
    }
  }
  // ERROR GENERATIONS
  private _generateErrors() {
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // Set errors for fields not inside datesGroup
        // Clear previous error message (if any)
        this.formErrors[field] = '';
        CommonFunction._setErrMsgs(this.addProductForm.get(field), this.formErrors, field, this.validationMessages);
      }
    }
  }
  resetForm(){
    this.addProductForm.reset();
    this.addProductForm.markAsUntouched();
    this.addProductForm.markAsPristine();
    this.formErrors = {
      name: '',
      price: '',
      description: '',
      category: '',
      vendor : '',
    };
  }
  // uploadImage(file,MIME_TYPE,MAX_HEIGHT,MAX_WIDTH){
  //   const QUALITY = 0.7;
  //   const blobURL = URL.createObjectURL(file);
  //   const img = new Image();
  //   img.src = blobURL;
  //   img.onload = () => {
  //     // window.URL.revokeObjectURL(this.src);
  //     const [newWidth, newHeight] = this.calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
  //     const canvas = document.createElement("canvas");
  //     canvas.width = newWidth;
  //     canvas.height = newHeight;
  //     const ctx = canvas.getContext("2d");
  //     ctx!.drawImage(img, 0, 0, newWidth, newHeight);
  //     canvas.toBlob(
  //       async (blob) => {
  //         // Handle the compressed image. es. upload or save in local state
  //         await this.uploadFile(blob)
  //       },
  //       MIME_TYPE,
  //       QUALITY
  //     );
  //     document.getElementById("root")!.append(canvas);
  //   };
  // }
  // async uploadFile(event:File){
  //   const url = await this.databaseService.upload('products/'+this.addProductForm.value.name+'/images/jpegLarge',event)
  //   this.fileCounter +=1;
  //   return url;
  // }

  // calculateSize(img, maxWidth, maxHeight) {
  //   let width = img.width;
  //   let height = img.height;

  //   // calculate the width and height, constraining the proportions
  //   if (width > height) {
  //     if (width > maxWidth) {
  //       height = Math.round((height * maxWidth) / width);
  //       width = maxWidth;
  //     }
  //   } else {
  //     if (height > maxHeight) {
  //       width = Math.round((width * maxHeight) / height);
  //       height = maxHeight;
  //     }
  //   }
  //   return [width, height];
  // }

  // // Utility functions for demo purpose

  // displayInfo(label, file) {
  //   const p = document.createElement('p');
  //   p.innerText = `${label} - ${this.readableBytes(file.size)}`;
  //   document.getElementById('root')!.append(p);
  // }

  // readableBytes(bytes) {
  //   const i = Math.floor(Math.log(bytes) / Math.log(1024)),
  //     sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  //   return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  // }
}
