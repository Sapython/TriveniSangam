import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunction } from 'src/app/common';
import { DataProvider } from 'src/app/providers/data.provider';
import { AuthencationService } from 'src/app/services/authencation.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { Order, OrderProduct } from 'src/app/structures/method.structure';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

declare var $: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  zoom = 20;
  currentLatLang: { lat: number; lng: number } = { lat: 0, lng: 0 };
  WindowRef: any;
  markers: any[] = [];
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
  };
  formType: boolean = true;
  checkoutType: string;
  screenWidth: number = window.innerWidth;
  addressForm: UntypedFormGroup;
  offlineCheckout: UntypedFormGroup;
  offlineCheckoutRoom: UntypedFormGroup;
  offlineProductCheckout:UntypedFormGroup;
  validationMessages: any;
  offlinevalidationMessages: any;
  recieptId: string;
  orderId: string;
  minDate: Date = new Date();
  formErrors: any = {
    area: '',
    address: '',
    instructions: '',
    nickname: '',
  };
  offlineformErrors: any = {
    name: '',
    mobile: '',
    email:'',
    numberofguests: '',
    address: '',
    typeofBooking: '',
    payment: '',
    amount: '',
    roomNumber: '',
    checkinDate: '',
    checkoutDate: '',
    checkinTime: '',
  };
  userID: string | undefined;
  delivery_addresses: any = [];
  checkoutData: any;
  selectedAddress: string | undefined;
  constructor(
    private fb: UntypedFormBuilder,
    public dataProvider: DataProvider,
    private databaseService: DatabaseService,
    private authService: AuthencationService,
    private https: HttpClient,
    private alertify: AlertsAndNotificationsService,
    private router: Router
  ) {
    this.addressForm = fb.group({
      area: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      address: [null, Validators.compose([Validators.required])],
      instructions: [null],
      nickname: [null],
    });
    this.offlineCheckout = fb.group({
      name: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      mobile: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required,Validators.email])],
      payment: [null, Validators.compose([Validators.required])],
      checkinDate: [null, Validators.compose([Validators.required])],
      checkoutDate: [null, Validators.compose([Validators.required])],
      aadhaarNo: [null, Validators.compose([Validators.required])],
    });
    this.offlineCheckoutRoom = fb.group({
      name: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      mobile: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required,Validators.email])],
      payment: [null, Validators.compose([Validators.required])],
      checkinDate: [null, Validators.compose([Validators.required])],
      checkoutDate: [null, Validators.compose([Validators.required])],
      aadhaarNo: [null, Validators.compose([Validators.required])],
    });
    this.offlinevalidationMessages = {
      name: {
        required: `Please Enter ?Name`,
        maxLength: `Maximum 100 characters allowed.`,
      },
      mobile: {
        required: `Please Enter Mobile Number`,
      },
      numberofguests: {
        required: `Please Enter Number of Guests`,
      },
      address: {
        required: `Please Enter Address`,
        maxLength: `Maximum 200 characters allowed.`,
      },
      typeofBooking: {
        required: `Please Enter Type of Booking`,
      },
      payment: {
        required: `Please Select Payment Mode`,
      },
      amount: {
        required: `Please Enter Amount`,
      },
      roomNumber: {
        required: `Please Enter Room Number`,
      },
      checkinDate: {
        required: `Please Select Check In date`,
      },
      checkoutDate: {
        required: `Please Select Check Out date`,
      },
      checkinTime: {
        required: `Please Select Check In Time`,
      },
    };
    this.validationMessages = {
      area: {
        required: `Please Enter Area`,
        maxLength: `Maximum 100 characters allowed.`,
      },
      address: {
        required: `Please Enter Address`,
      },
    };
    this.checkoutType = this.dataProvider.checkoutType;
    this.checkoutData = this.dataProvider.checkoutData;
    console.log('checkoutData', this.checkoutData);
  }
  positionMarkerOptions: google.maps.MarkerOptions = {
    animation: google.maps.Animation.DROP,
    draggable: true,
  };
  getMarkerPositon(event: any, event2: any) {
    //  console.log(event,event2);
    //  console.log(event2.latLng.lat(),event2.latLng.lng());
    this.currentLatLang = {
      lat: event2.latLng.lat(),
      lng: event2.latLng.lng(),
    };
  }
  locationmarker: any = {
    label: {
      color: 'red',
      text: 'Your Position ' + (this.markers.length + 1),
    },
    title: 'Your Position ' + (this.markers.length + 1),
    options: this.positionMarkerOptions,
  };
  ngOnInit(): void {
    this.WindowRef = this.MainWindowRef;
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.currentLatLang = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.markers = [];
      this.locationmarker = {
        position: {
          lat: this.center.lat,
          lng: this.center.lng,
        },
        label: {
          color: 'red',
          text: 'Your Position ' + (this.markers.length + 1),
        },
        title: 'Your Position ' + (this.markers.length + 1),
        options: this.positionMarkerOptions,
      };
      // console.log('locationmarker', this.locationmarker,this.locationmarker.getPosition());
      this.markers.push(this.locationmarker);
    });
    this.dataProvider.pageSetting.blur = true;
    this.authService.getUser.subscribe((res) => {
      this.userID = res?.uid;
      this.databaseService.getDeliveryAddress().subscribe((response) => {
        this.delivery_addresses = [];
        // console.log('resres', response);
        response.forEach((data) => {
          let a = {
            id: data.id,
            address: data.data().address,
            area: data.data().area,
            instructions: data.data().instructions,
            nickname: data.data().nickname,
            coordinates: data.data().coordinates,
          };
          this.delivery_addresses.push(a);
        });
        // console.log(this.delivery_addresses);
        this.dataProvider.pageSetting.blur = false;
      });
    });
    // this.handlePayment({razorpay_payment_id: '123456789'});
  }
  proceedPayment(event: any, amount: number,roomdata?:any) {
    this.recieptId = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
    let orderDetails = {
      amount: amount * 100,
      receipt: this.recieptId,
    };
    console.log('OrderDetails', orderDetails);
    this.createOrder(orderDetails).subscribe(
      (order) => {
        console.log('order', order);
        var rzp1 = new this.WindowRef.Razorpay(
          this.preparePaymentDetails(order, orderDetails,roomdata)
        );
        rzp1.open();
        event.preventDefault();
      },
      (error) => {
        this.alertify.presentToast(
          'Something went wrong from our side you can try again later.',
          'error'
        );
        this.dataProvider.pageSetting.blur = false;
      }
    );
  }
  preparePaymentDetails(order: any, orderDetails: any,roomdata?:any) {
    var ref = this;
    this.orderId = order.id;
    return {
      key: environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: orderDetails.amount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
      name: 'Pay',
      currency: order.currency,
      order_id: order.id, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
      image: 'https://beemadukaan.web.app/assets/images/logo-main.jpg',
      handler: function (response: any) {
        ref.handlePayment(response,roomdata);
      },
      prefill: {
        name: roomdata ? roomdata.name : this.checkoutData.name,
        email: roomdata ? roomdata.email : this.checkoutData.email,
        contact: roomdata ? roomdata.phone : this.checkoutData.phone,
      },
      theme: {
        color: '#002244',
      },
    };
  }
  handlePayment(response: any,room?:any) {
    this.alertify.presentToast('Payment Completed Successfully', 'info');
    console.log('response', response);
    if (this.checkoutType === 'room') {
      let roomdata = {
        roomid: this.checkoutData.id,
        roomname: this.checkoutData.name,
        price: this.checkoutData.price,
        roomNo: room?.roomNo,
        roomType: this.checkoutData.roomtype,
        paymentType:'online',
        type:'room',
        name:room.name,
        email:room.email,
        phone:room.phone,
        roomStart:room.roomStart,
        roomEnd:room.roomEnd,
      };
      console.log('roomdata', roomdata);
      this.completeOrder(roomdata);
    } else {
      const order: Order = {
        orderId: this.orderId,
        amount: this.checkoutData.totalAmount,
        paymentId: response.razorpay_payment_id,
        paymentStatus: 'paid',
        address: this.dataProvider.selectedDeliveryAddress,
        coordinates: this.currentLatLang,
        dateOfOrder: new Date(),
        products: this.dataProvider.cartProducts,
        type:'product',
        paymentType:'online',
      };
      this.completeOrder(order);
      this.emptyCart();
    }
  }
  get MainWindowRef() {
    return window;
  }
  async emptyCart() {
    await this.databaseService.emptyCart();
  }
  updateCheckout(type: boolean) {
    this.formType = type;
    console.log(this.formType);
  }
  addAddress(formdata: any) {
    console.log(formdata);
    this._generateErrors('addressForm');
    let data = formdata.value;
    data['coordinates'] = this.currentLatLang;
    this.databaseService.addDeliveryAddress(data).then((res) => {
      console.log(res);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'New Address Added!',
        showConfirmButton: false,
        timer: 1500,
      });
      $('#exampleModal').modal('hide');
    });
  }
  makeOfflineBooking(formdata: any) {
    // TODO
    this._generateErrors('offlineCheckoutRoom');
    if(formdata.valid){
      const order: Order = {
        orderId: this.orderId,
        amount: this.checkoutData.totalAmount,
        paymentId: '',
        paymentStatus: 'unpaid',
        address: '',
        coordinates: {lat:0,lng:0},
        dateOfOrder: new Date(),
        products: this.dataProvider.cartProducts,
        type:'product',
        paymentType:'offline',
      };
      this.completeOrder(order);
      this.emptyCart();
    } else {
      this.alertify.presentToast('Please fill all the fields', 'error');
    }
  }
  // TO BOOK ROOM
  roomBooking(formdata: any, event) {
    this.dataProvider.pageSetting.blur = true;
    this._generateErrors('offlineCheckout');
    let checkoutuserDetails: any = [];
    if (formdata.valid) {
      this.databaseService.getOccupiedRooms().then(async (res: any) => {
        let roomAvailable = this.dataProvider.checkoutData.roomNumbers;
        res.data().occupiedRooms.forEach((roomNo) => {
          if (roomAvailable.includes(roomNo)) {
            roomAvailable.splice(roomAvailable.indexOf(roomNo), 1);
          }
        });
        if (roomAvailable.length > 0) {
          this.databaseService.occupyRoom(roomAvailable[0]).then((res:any) => {
            let roomdata = {
              roomid: this.checkoutData.id,
              roomname: this.checkoutData.name,
              price: this.checkoutData.price,
              roomNo: roomAvailable[0],
              roomType: this.checkoutData.roomtype,
              paymentType:'offline',
              type:'room',
              name: formdata.value.name,
              email: formdata.value.email,
              phone: formdata.value.mobile,
              roomStart: formdata.value.checkinDate,
              roomEnd: formdata.value.checkoutDate,
            };
            if (formdata.value.payment === 'online') {
              // DO PAYMENT GATEWAY SETUP
              this.proceedPayment(event, this.checkoutData.price,roomdata);
            } else if (formdata.value.payment === 'cash') {
              // DO CASH PAYMENT INTEGRATION
              this.completeOrder(roomdata);
            }
          }).catch((err) => {
            this.alertify.presentToast('Some Error Occured', 'error');
          this.dataProvider.pageSetting.blur = false;
          return;
          });
        } else {
          this.alertify.presentToast('All Rooms are Occupied', 'error');
          this.dataProvider.pageSetting.blur = false;
          return;
        }
      });
    }
  }
  // ERROR GENERATIONS
  private _generateErrors(formname: string) {
    // Check validation and set errors
    if (formname == 'addressForm') {
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // Set errors for fields not inside datesGroup
          // Clear previous error message (if any)
          this.formErrors[field] = '';
          CommonFunction._setErrMsgs(
            this.addressForm.get(field),
            this.formErrors,
            field,
            this.validationMessages
          );
        }
      }
    } else if (formname == 'offlineCheckout') {
      for (const field in this.offlineformErrors) {
        if (this.offlineformErrors.hasOwnProperty(field)) {
          // Set errors for fields not inside datesGroup
          // Clear previous error message (if any)
          this.offlineformErrors[field] = '';
          CommonFunction._setErrMsgs(
            this.offlineCheckout.get(field),
            this.offlineformErrors,
            field,
            this.offlinevalidationMessages
          );
        }
      }
    }
  }
  deleteDeliveryAddress(id: any) {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteDeliveryAddress(id).then((res) => {
      this.dataProvider.pageSetting.blur = false;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Deleted',
        showConfirmButton: false,
        timer: 1500,
      });
    });
  }
  confirmCheckout(event: any) {
    this.dataProvider.pageSetting.blur = true;
    this.proceedPayment(event, this.checkoutData.totalAmount);
  }

  createOrder(orderDetails: any) {
    alert('Invocated creation');
    return this.https.post(
      environment.cloudFunctions.createOrder,
      orderDetails
    );
  }
  capturePayment(paymentDetails: any) {
    alert('Invocated capture');
    return this.https.post(
      environment.cloudFunctions.capturePayment,
      paymentDetails
    );
  }
  checkAddress(id: any) {
    console.log(id);
    this.dataProvider.selectedDeliveryAddress = id;
  }
  completeOrder(checkOutData: any) {
    this.databaseService
      .addCheckoutData(checkOutData)
      .then((res) => {
        this.dataProvider.pageSetting.blur = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Order Confirmed!',
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          this.router.navigate(['']);
        }, 1500);
      })
      .catch((error) => {
        this.dataProvider.pageSetting.blur = false;
        console.log('error', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Something is not right, Try again later.',
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          this.router.navigate(['']);
        }, 1500);
      });
  }
}
