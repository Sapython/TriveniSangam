import { MatChipInputEvent } from '@angular/material/chips';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs';import { CommonFunction } from 'src/app/common';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { Product } from 'src/app/structures/method.structure';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DataProvider } from 'src/app/providers/data.provider';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('roomInput') roomInput: ElementRef<HTMLInputElement>;
  addProductForm : UntypedFormGroup;
  validationMessages : any;
  img1:File;
  img2:File;
  img3:File;
  img4:File;
  fileCounter:number = 0;
  vegetarian : boolean = false;
  formErrors : any = {
    name: '',
    price: '',
    description: '',
    category: '',
    vendor : '',
  };
  pageType : any = 'Add';
  productEditID : string = '';
  routeSub : Subscription = Subscription.EMPTY;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new UntypedFormControl();
  roomCtrl = new UntypedFormControl();
  filteredFruits: Observable<string[]>;
  filteredRooms: Observable<string[]>;
  fruits: string[] = ['Air Conditioner', 'Attach Bathroom'];
  rooms: string[] = [];
  allFruits: string[] = ['Great View', 'Frigde', '24 Hours Service', 'Parking', 'Restaurant Orders', 'Split TV', 'Sanitized Room'];
  // array os 201 to 224
  allRooms : string[] = ['201', '202', '203', '204', '205', '206', '207', '208', '209','210','211','212','214','215','216','217','218','219','220','221','222','223','224'];
  // allRooms : string[] = ['101', '102', '103', '104', '105', '106', '107', '108', '109','110',];
  constructor(private route : ActivatedRoute, private fb : UntypedFormBuilder, private databaseService:DatabaseService, private alertify:AlertsAndNotificationsService, private dataProvider : DataProvider) {
    this.routeSub = this.route.params.subscribe(params => {
      console.log(params['id']) //log the value of id
      this.productEditID = params['id'];
      if(this.productEditID != undefined && this.productEditID != ''){
        this.pageType = 'Edit';
        this.getEditProductData(this.productEditID);
      }
    });
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
      adults : [
        null,
        Validators.compose([Validators.required, Validators.min(1), Validators.max(6)]),
      ],
      children : [
        null
      ],
      roomtype : [
        null
      ]
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
      adults: {
        required: `Please Enter Description.`,
        min: `Minimum 1 person allow.`,
        max: `Maximum 6 person allow.`
      }
    };
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit, 'f') : this.allFruits.slice())),
    );
    this.filteredRooms = this.roomCtrl.valueChanges.pipe(
      startWith(null),
      map((room: string | null) => (room ? this._filter(room, 'r') : this.allRooms.slice())),
    );
  }
  vendors:any = [];
  categories:any = [];
  categorySubscription: Subscription;
  ngOnInit(): void {
  }
  ngOnDestroy(): void {

  }
  getEditProductData(id){
    if(id){
      this.databaseService.getRoomData(id).then((res) => {
        console.log(res.data());
        let roomData : any = res.data();
        this.addProductForm.patchValue({
          name : roomData.name,
          price : roomData.price,
          description : roomData.description,
          adults : roomData.adults,
          children : roomData.children,
          roomtype : roomData.roomtype,
        });
        if(roomData.images.img1){
          this.img1 = roomData.images.img1;
        }if(roomData.images.img2){
          this.img2 = roomData.images.img2;
        }if(roomData.images.img3){
          this.img3 = roomData.images.img3;
        }if(roomData.images.img4){
          this.img4 = roomData.images.img4;
        }
        this.fruits = [];
        this.fruits = roomData.facilities;
        this.rooms = roomData.roomNumbers;
      }).catch((error) => {
        this.alertify.presentToast("No product found. Add new", 'error')
      });
    }
  }
  setImage(name:string,format:'jpg'|'webp',event:any){
    if (name==='img1'){
      this.img1 = event.target.files[0];
    }
    else if(name==='img2'){
      this.img2 = event.target.files[0];
    }
    else if(name==='img3'){
      this.img3 = event.target.files[0];
    }
    else if(name==='img4'){
      this.img4 = event.target.files[0];
    } else {
      this.alertify.presentToast('Invalid File Format','error');
    }
  }
  async addProduct(formdata : any){
    console.log(formdata);
    this._generateErrors();
    if(this.pageType === 'Add' && formdata.valid){
      if (this.img1!=undefined){
        if(formdata.errors===null && confirm('Are you sure you wan to upload this data')){
          this.dataProvider.pageSetting.blur = true;
          let imagesList : any;
          let img2path;
          let img3path;
          let img4path;
          let img1path = await this.databaseService.upload('rooms/'+this.addProductForm.value.name+'/images/img1',this.img1);
          imagesList = {
            img1 : img1path
          }
          if(this.img2 != undefined){
            img2path = await this.databaseService.upload('rooms/'+this.addProductForm.value.name+'/images/img2',this.img2)
          }
          if(this.img3 != undefined){
            img3path = await this.databaseService.upload('rooms/'+this.addProductForm.value.name+'/images/img3',this.img3)
          }
          if(this.img4 != undefined){
            img4path = await this.databaseService.upload('rooms/'+this.addProductForm.value.name+'/images/img4',this.img4)
          }
          if(img1path && img2path){
            imagesList = {
              img1 : img1path,
              img2 : img2path
            }
          }else if(img1path && img2path && img3path){
            imagesList = {
              img1 : img1path,
              img2 : img2path,
              img3 : img3path
            }
          }else if(img1path && img2path && img3path &&  img4path){
            imagesList = {
              img1 : img1path,
              img2 : img2path,
              img3 : img3path,
              img4 : img4path
            }
          }else {
            imagesList = {
              img1 : img1path
            }
          }
          console.log("img upload done")
          if (typeof img1path == 'string'){
            console.log("creating obj")
            let product : any = {
              name : this.addProductForm.value.name,
              price : this.addProductForm.value.price,
              description : this.addProductForm.value.description,
              facilities : this.fruits,
              adults : this.addProductForm.value.adults,
              children : this.addProductForm.value.children,
              roomtype : this.addProductForm.value.roomtype,
              roomNumbers : this.rooms,
              images : imagesList,
              id:'',
              dateOfPublish:new Date()
            }
            console.log('Product data',product);
            this.databaseService.addRoom(product).then(()=>{
              console.log("sending data");
              this.dataProvider.pageSetting.blur = false;
              this.alertify.presentToast('Product Added Successfully','info');
              this.resetForm();
            }).catch((err)=>{
              console.log(err)
              this.alertify.presentToast('Something went wrong','error');
            })
          }
        } else {
          this.alertify.presentToast('Please fill all the fields correctly','error');
        }
      } else {
        this.alertify.presentToast('Please upload atleast one image','error');
      }
    }else if(this.pageType === 'Edit' && formdata.valid){
      console.log("Editing product")
      if (this.img1!=undefined){
        if(formdata.errors===null && confirm('Are you sure you wan to upload this data')){
          this.dataProvider.pageSetting.blur = true;
          let imagesList : any;
          let img2path;
          let img3path;
          let img4path;
          let img1path = await this.databaseService.upload('rooms/'+this.addProductForm.value.name+'/images/img1',this.img1);
          imagesList = {
            img1 : img1path
          }
          if(this.img2 != undefined){
            img2path = await this.databaseService.upload('rooms/'+this.addProductForm.value.name+'/images/img2',this.img2)
          }
          if(this.img3 != undefined){
            img3path = await this.databaseService.upload('rooms/'+this.addProductForm.value.name+'/images/img3',this.img3)
          }
          if(this.img4 != undefined){
            img4path = await this.databaseService.upload('rooms/'+this.addProductForm.value.name+'/images/img4',this.img4)
          }
          if(img1path && img2path){
            imagesList = {
              img1 : img1path,
              img2 : img2path
            }
          }else if(img1path && img2path && img3path){
            imagesList = {
              img1 : img1path,
              img2 : img2path,
              img3 : img3path
            }
          }else if(img1path && img2path && img3path &&  img4path){
            imagesList = {
              img1 : img1path,
              img2 : img2path,
              img3 : img3path,
              img4 : img4path
            }
          }else {
            imagesList = {
              img1 : img1path
            }
          }
          console.log("img upload done")
          if (typeof img1path == 'string'){
            console.log("creating obj")
            let product : any = {
              name : this.addProductForm.value.name,
              price : this.addProductForm.value.price,
              description : this.addProductForm.value.description,
              facilities : this.fruits,
              adults : this.addProductForm.value.adults,
              children : this.addProductForm.value.children,
              roomtype : this.addProductForm.value.roomtype,
              roomNumbers : this.rooms,
              images : imagesList,
              id:this.productEditID,
              dateOfPublish:new Date()
            }
            console.log('Product data',product);
            this.databaseService.updateRoom(product).then(()=>{
              console.log("sending data");
              this.dataProvider.pageSetting.blur = false;
              this.alertify.presentToast('Product Added Successfully','info');
              this.resetForm();
            }).catch((err)=>{
              console.log(err)
              this.alertify.presentToast('Something went wrong','error');
            })
          }
        } else {
          this.alertify.presentToast('Please fill all the fields correctly','error');
        }
      } else {
        this.alertify.presentToast('Please upload atleast one image','error');
      }
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

  private _filter(value: string, type : string): string[] {
    const filterValue = value.toLowerCase();
    let returnResponse : any = [];
    if(type == 'f'){
      returnResponse = this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
    }
    else if(type == 'r'){
      returnResponse = this.allRooms.filter(fruit => fruit.toLowerCase().includes(filterValue));
    }
    return returnResponse;
  }
  add(event: MatChipInputEvent, type : string): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      if(type == 'f'){
        this.fruits.push(value);
      }else if(type == 'r'){
        this.rooms.push(value);
      }
    }
    // Clear the input value
    event.chipInput!.clear();
    if(type == 'f'){
      this.fruitCtrl.setValue(null);
    }else if(type == 'r'){
      this.roomCtrl.setValue(null);
    }

    console.log("fruits",this.fruits)
    console.log("rooms",this.rooms)
  }

  remove(fruit: string, type : string ): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      if(type == 'f'){
        this.fruits.splice(index, 1);
      }else if(type == 'r'){
        this.rooms.splice(index, 1);
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent, type : string): void {
    if(type == 'f'){
      this.fruits.push(event.option.viewValue);
      this.fruitInput.nativeElement.value = '';
      this.fruitCtrl.setValue(null);
      console.log("fruits",this.fruits)
    }else if(type == 'r'){
      this.rooms.push(event.option.viewValue);
      this.roomInput.nativeElement.value = '';
      this.roomCtrl.setValue(null);
      console.log("rooms",this.rooms)
    }

  }
}
