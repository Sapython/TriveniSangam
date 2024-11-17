import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Subject } from 'rxjs';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { Booking, Guest } from 'src/app/structures/booking.structure';
import { Room } from 'src/app/structures/rooms.structure';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberModalComponent } from './add-member-modal/add-member-modal.component';
import { DomSanitizer } from '@angular/platform-browser';
declare const UIkit: any;

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css', '../manager.util.scss'],
})
export class BookingsComponent implements OnInit {
  bookings: Booking[];
  roomNumbers: { [key: string]: string };
  guestId: any;
  guests: any;
  registeredGuests: any[] = [];
  checkOutBooking: any;
  viewBooking: any;
  bookingToDelete: any;
  dataLoaded: Subject<boolean> = new Subject();
  roomTypes: any[];
  @ViewChild('roomTypeSelect') roomTypeSelect: ElementRef;
  typeSelected: any;
  checkOutDate: string = '';
  checkInDate: string = '';
  bookingType: 'single' | 'couple' | 'family' | 'group' = 'single';
  familyMembers: any[] = [];
  roomMembers: any[] = [];
  groupMembers: any[] = [];
  panImage: File | undefined;
  aadhaarImage: File | undefined;
  singleBookingForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    phoneNumber: new UntypedFormControl('', [Validators.required]),
    aadhaarNumber: new UntypedFormControl('', [Validators.required]),
    panNumber: new UntypedFormControl('', [Validators.required]),
    dateOfBirth: new UntypedFormControl('', [Validators.required]),
    address: new UntypedFormControl('', [Validators.required]),
  });
  coupleBookingForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    phoneNumber: new UntypedFormControl('', [Validators.required]),
    aadhaarNumber: new UntypedFormControl('', [Validators.required]),
    panNumber: new UntypedFormControl('', [Validators.required]),
    dateOfBirth: new UntypedFormControl('', [Validators.required]),
    address: new UntypedFormControl('', [Validators.required]),
    spouseName: new UntypedFormControl('', Validators.required),
    spouseEmail: new UntypedFormControl('', [
      Validators.required,
      Validators.email,
    ]),
    spousePhoneNumber: new UntypedFormControl('', [Validators.required]),
    spouseAadhaarNumber: new UntypedFormControl('', [Validators.required]),
    spousePanNumber: new UntypedFormControl('', [Validators.required]),
    spouseDateOfBirth: new UntypedFormControl('', [Validators.required]),
  });
  familyMembersForm: FormGroup = new FormGroup({});
  familyBookingForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    phoneNumber: new UntypedFormControl('', [Validators.required]),
    aadhaarNumber: new UntypedFormControl('', [Validators.required]),
    panNumber: new UntypedFormControl('', [Validators.required]),
    dateOfBirth: new UntypedFormControl('', [Validators.required]),
    address: new UntypedFormControl('', [Validators.required]),
    familyMembers: this.familyMembersForm,
  });
  groupMembersForm: FormGroup = new FormGroup({});
  groupBookingForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    institution: new UntypedFormControl(''),
    phoneNumber: new UntypedFormControl('', [Validators.required]),
    aadhaarNumber: new UntypedFormControl('', [Validators.required]),
    panNumber: new UntypedFormControl('', [Validators.required]),
    dateOfBirth: new UntypedFormControl('', [Validators.required]),
    address: new UntypedFormControl('', [Validators.required]),
    groupMembers: this.groupMembersForm,
  });
  roomMemberForm: FormGroup = new FormGroup({});
  bookingForm: UntypedFormGroup = new UntypedFormGroup({
    checkInDate: new UntypedFormControl('', [Validators.required]),
    checkOutDate: new UntypedFormControl(''),
    roomId: new UntypedFormControl(null, [Validators.required]),
    paymentStatus: new UntypedFormControl(null, [Validators.required]),
    roomPrice: new UntypedFormControl(null, [Validators.required]),
  });
  availableRooms: any[];
  currentRoom: any;

  constructor(
    private databaseService: DatabaseService,
    private alertService: AlertsAndNotificationsService,
    private dataProvider: DataProvider,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _sanitizer: DomSanitizer
  ) {
    this.route.queryParams.subscribe(
      (routeData: any) => {
        console.log(routeData);
        if (routeData.rooms) {
          this.openStartModal(routeData);
          // this.dataProvider.pageSetting.blur = true;
          // const bookingID = JSON.parse(data.rooms)[0].id;
          // this.bookingForm.controls.roomId.setValue(bookingID);
          // const dates: Date[] = [];
          // JSON.parse(data.rooms).forEach((data: any) => {
          //   dates.push(new Date(data.date));
          // });
          // this.automated = true;
          // // get max date
          // this.startDate = new Date(
          //   Math.max(...dates.map((date: Date) => date.getTime()))
          // );
          // // get min date
          // this.endDate = new Date(
          //   Math.min(...dates.map((date: Date) => date.getTime()))
          // );
          // console.log(this.endDate, this.startDate);
          // this.roomNumbers = {};
          // this.rooms = [];
          // this.databaseService
          //   .getRoom(bookingID)
          //   .then((doc: any) => {
          //     this.roomNumbers[bookingID] = (doc.data() as Room).number;
          //     this.bookingForm.value.checkInDate = new Date();
          //     this.checkInDate =
          //       this.endDate.getFullYear() +
          //       '-' +
          //       ('0' + (this.endDate.getMonth() + 1)).slice(-2) +
          //       '-' +
          //       ('0' + this.endDate.getDate()).slice(-2);
          //     this.checkOutDate =
          //       this.startDate.getFullYear() +
          //       '-' +
          //       ('0' + (this.startDate.getMonth() + 1)).slice(-2) +
          //       '-' +
          //       ('0' + this.startDate.getDate()).slice(-2);
          //     console.log(this.checkInDate, this.checkOutDate);
          //     this.typeSelected = true;
          //     this.databaseService
          //       .getRoomTypes()
          //       .then((roomData: any) => {
          //         this.roomTypes = roomData.data().types;
          //         this.roomType = doc.data().type;
          //         console.log(this.roomType);
          //         this.databaseService
          //           .getAvailableRooms()
          //           .then((roomsCollection) => {
          //             this.bookingForm.controls.roomId.setValue(bookingID);
          //             roomsCollection.forEach((doc: any) => {
          //               this.rooms.push({
          //                 roomId: doc.id,
          //                 ...doc.data(),
          //               } as Room);
          //             });
          //             console.log(this.rooms);
          //             UIkit.modal(
          //               document.getElementById('add-booking-modal')
          //             ).show();
          //             this.dataProvider.pageSetting.blur = false;
          //           });
          //       })
          //       .catch(() => {
          //         this.dataProvider.pageSetting.blur = false;
          //       });
          //   })
          //   .catch(() => {
          //     this.dataProvider.pageSetting.blur = false;
          //   });
        }
      },
      (error) => {
        this.dataProvider.pageSetting.blur = false;
      }
    );
  }

  ngOnInit(): void {
    this.databaseService.getFirstBookings(10).then((docs) => {
      this.bookings = [];
      this.roomNumbers = {};
      this.guests = {};

      docs.forEach((doc) => {
        const booking = doc.data() as Booking;
        this.bookings.push({ bookingId: doc.id, ...doc.data() } as Booking);

        // Get room numbers
        if (!(booking.roomId in this.roomNumbers)) {
          this.databaseService.getRoom(booking.roomId).then((doc) => {
            this.roomNumbers[booking.roomId] = (doc.data() as Room).number;
          });
        }

        // Get guest names
        if (!(booking.guests[0] in this.guests)) {
          this.databaseService.getGuest(booking.guests[0]).then((doc) => {
            const guest = doc.data() as Guest;
            this.guests[booking.guests[0]] = {
              name: guest.name,
              phoneNumber: guest.phoneNumber,
            };
          });
        }
      });
    });
  }

  openStartModal(routeData: any) {
    this.dataProvider.pageSetting.blur = true;
    this.openAddBookingModal();
    this.dataLoaded.subscribe((data) => {
      if (data === true) {
        const rooms = JSON.parse(routeData.rooms);
        this.bookingForm.controls.roomId.setValue(rooms[0].id);
        this.bookingForm.controls.roomType.setValue(rooms[0].type);
        this.typeSelected = this.roomTypes.find(
          (type) => type.name === rooms[0].type
        );
        const dates: Date[] = [];
        rooms.forEach((data: any) => {
          dates.push(new Date(data.date));
        });
        // get max date
        const startDate = new Date(
          Math.max(...dates.map((date: Date) => date.getTime()))
        );
        // get min date
        const endDate = new Date(
          Math.min(...dates.map((date: Date) => date.getTime()))
        );
        console.log(startDate, endDate);
        this.checkInDate =
          endDate.getFullYear() +
          '-' +
          ('0' + (endDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + endDate.getDate()).slice(-2);
        this.checkOutDate =
          startDate.getFullYear() +
          '-' +
          ('0' + (startDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + startDate.getDate()).slice(-2);
        this.bookingForm.controls.checkInDate.setValue(startDate);
        this.bookingForm.controls.checkOutDate.setValue(endDate);
        console.log(this.bookingForm);
        // console.log(document.getElementById('add-booking-modal'));
        // UIkit.modal(document.getElementById('add-booking-modal')).show();
        this.dataProvider.pageSetting.blur = false;
      }
    });
  }

  openAddBookingModal() {
    this.dataProvider.pageSetting.blur = true;
    // this.resetBookingModal();
    this.databaseService.getRoomTypes().then((doc: any) => {
      this.roomTypes = doc.data().types;
      UIkit.modal(document.getElementById('add-booking-modal')).show();
      this.dataProvider.pageSetting.blur = false;
    });
  }

  loadAvailableRooms() {
    this.availableRooms = [];

    const checkInDate = Timestamp.fromDate(
      new Date(this.bookingForm.get('checkInDate')?.value)
    );
    const checkOutDate = Timestamp.fromDate(
      new Date(this.bookingForm.get('checkOutDate')?.value)
    );

    if (!isNaN(checkInDate.seconds)) {
      const inDate = checkInDate.toDate();
      const outDate = checkOutDate.toDate();
      const today = new Date();
      if (
        inDate <= today &&
        !(
          inDate.getDate() == today.getDate() &&
          inDate.getMonth() == today.getMonth() &&
          inDate.getFullYear() == today.getFullYear()
        )
      ) {
        this.alertService.presentToast(
          'You cannot check-in in the past',
          'error'
        );
        this.bookingForm.patchValue({ checkInDate: '' });
      } else if (!isNaN(checkOutDate.seconds) && inDate >= outDate) {
        this.alertService.presentToast(
          'Check-out date must be after check-in date',
          'error'
        );
      } else {
        this.dataProvider.pageSetting.blur = true;
        this.databaseService
          .getAvailableRooms(checkInDate, checkOutDate)
          .then((rooms) => {
            this.dataLoaded.next(true);
            this.availableRooms = rooms;
            this.dataProvider.pageSetting.blur = false;
            if (this.availableRooms.length === 0) {
              this.alertService.presentToast(
                'No rooms are available for this time period'
              );
            }
          });
      }
    }
  }

  addFamilyMember() {
    const dialogRef = this.dialog.open(AddMemberModalComponent);
    dialogRef.componentInstance.addMember.subscribe((member: any) => {
      // this.familyMembers.push(member);
      var local = new Date(member.dob);
      local.setMinutes(
        member.dob.getMinutes() - member.dob.getTimezoneOffset()
      );
      const date = local.toJSON().slice(0, 10);
      const nameControl = new FormControl(member.name, [Validators.required]);
      const dobControl = new FormControl(date, [Validators.required]);
      const emailControl = new FormControl(member.email);
      const phoneControl = new FormControl(member.phone);
      this.familyMembersForm.addControl(
        this.familyMembers.length.toString() + 'name',
        nameControl
      );
      this.familyMembersForm.addControl(
        this.familyMembers.length.toString() + 'dob',
        dobControl
      );
      this.familyMembersForm.addControl(
        this.familyMembers.length.toString() + 'email',
        emailControl
      );
      this.familyMembersForm.addControl(
        this.familyMembers.length.toString() + 'phone',
        phoneControl
      );
      this.familyMembers.push({
        name: nameControl,
        dob: dobControl,
        email: emailControl,
        phone: phoneControl,
      });
    });
  }

  removeFamilyMember(index) {
    this.familyMembersForm.removeControl(index + 'name');
    this.familyMembersForm.removeControl(index + 'dob');
    this.familyMembers.splice(index, 1);
  }

  addGroupMember() {
    const dialogRef = this.dialog.open(AddMemberModalComponent);
    dialogRef.componentInstance.addMember.subscribe((member: any) => {
      // this.familyMembers.push(member);
      var local = new Date(member.dob);
      local.setMinutes(
        member.dob.getMinutes() - member.dob.getTimezoneOffset()
      );
      const date = local.toJSON().slice(0, 10);
      const nameControl = new FormControl(member.name, [Validators.required]);
      const dobControl = new FormControl(date, [Validators.required]);
      const emailControl = new FormControl(member.email);
      const phoneControl = new FormControl(member.phone);
      this.groupMembersForm.addControl(
        this.groupMembers.length.toString() + 'name',
        nameControl
      );
      this.groupMembersForm.addControl(
        this.groupMembers.length.toString() + 'dob',
        dobControl
      );
      this.groupMembersForm.addControl(
        this.groupMembers.length.toString() + 'email',
        emailControl
      );
      this.groupMembersForm.addControl(
        this.groupMembers.length.toString() + 'phone',
        phoneControl
      );
      this.groupMembers.push({
        name: nameControl,
        dob: dobControl,
        email: emailControl,
        phone: phoneControl,
      });
    });
  }

  removeGroupMember(index) {
    this.groupMembersForm.removeControl(index + 'name');
    this.groupMembersForm.removeControl(index + 'dob');
    this.groupMembers.splice(index, 1);
  }

  setCurrentRoom() {
    const room = this.availableRooms.find(
      (room) => room.roomId == this.bookingForm.value.roomId
    );
    console.log('ROOMS', room);
    this.currentRoom = room;
    this.bookingForm.controls['roomPrice'].setValue(
      this.currentRoom.ratePerDay
    );
  }
  getDate(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getTime(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  checkOutRoomNow() {
    this.dataProvider.pageSetting.blur = true;
    this.checkOutBooking.checkOutTime = Timestamp.fromDate(new Date());
    this.databaseService
      .editBooking(this.checkOutBooking.bookingId, this.checkOutBooking)
      .then(() => {
        UIkit.modal(document.getElementById('checkout-confirm-modal')).hide();
        this.dataProvider.pageSetting.blur = false;
        this.alertService.presentToast(
          'Checked out of Room ' +
            this.roomNumbers[this.checkOutBooking.roomId] +
            '.'
        );
        this.checkOutBooking = null;
      });
  }

  resetBookingModal() {
    this.roomTypeSelect.nativeElement.selectedIndex = 0;
    this.typeSelected = null;
    this.bookingForm.reset();
    (this.bookingForm.get('guests') as UntypedFormArray).clear();
  }

  onTypeSelect(event: any, directValue?: string) {
    console.log('Changed', event, directValue);
    const value =
      directValue === undefined ? event!.target!['value'] : directValue;
    console.log('VAlUE', value);
    const type = this.roomTypes.find((type) => type.name === value);
    console.log(type);
    for (const room of this.availableRooms) {
      if (room.type === value) {
        this.typeSelected = type;
        return;
      }
    }
    this.alertService.presentToast(
      type.name + ' rooms are not available at the moment.'
    );
    this.typeSelected = null;
  }

  loadGuest() {
    const phone = this.bookingForm.get('phoneNumber')?.value.trim();
    if (phone) {
      this.dataProvider.pageSetting.blur = true;
      this.databaseService.getGuestByPhone(phone).then((docs) => {
        if (docs.size > 0) {
          (this.bookingForm.get('guests') as UntypedFormArray).clear();
          docs.forEach((doc) => {
            this.guestId = doc.id;
            const guest = doc.data();
            const name = guest.name;
            const dobStr = formatDate(guest.dob.toDate(), 'yyyy-MM-dd', 'en');
            this.addGuest(name, dobStr);
            this.alertService.presentToast('This number belongs to ' + name);
          });
        } else {
          this.guestId = null;
        }
        this.dataProvider.pageSetting.blur = false;
      });
    } else {
      this.guestId = null;
    }
  }

  addGuest(name: string, dob: string): void {
    const guestsArr = this.bookingForm.get('guests') as UntypedFormArray;
    if (guestsArr.length >= this.typeSelected.maxPersons) {
      this.alertService.presentToast(
        `You can add upto ${this.typeSelected.maxPersons} guests only.`
      );
    } else {
      guestsArr.push(
        new UntypedFormGroup({
          name: new UntypedFormControl(name, [Validators.required]),
          dob: new UntypedFormControl(dob, [Validators.required]),
        })
      );
    }
  }

  deleteGuest(guest: any) {
    const index = this.roomMembers.indexOf(guest);
    if (index == 0) {
      if (confirm('Deleting the primary guest will delete all the guests')) {
        this.roomMembers = [];
      }
    } else if (index != -1) {
      this.roomMembers.splice(this.roomMembers.indexOf(guest));
    }
  }

  addRoomMember() {
    const dialogRef = this.dialog.open(AddMemberModalComponent, {
      data: { primary: this.roomMembers.length == 0 },
    });
    dialogRef.componentInstance.addMember.subscribe((member: any) => {
      if (typeof member.panImage === 'object') {
        console.log(member.panImage);
        // member['panImageUrl'] = this._sanitizer.bypassSecurityTrustUrl(
        //   window.URL.createObjectURL(member.panImage)
        // );
        // member['aadhaarImageUrl'] = this._sanitizer.bypassSecurityTrustUrl(
        //   window.URL.createObjectURL(member.aadhaarImage)
        // );
      }
      console.log(member);
      this.roomMembers.push(member);
    });
  }
  checkInNow() {
    const now = new Date();
    const dateStr =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0');
    const timeStr =
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0');
    this.bookingForm.patchValue({
      checkInDate: dateStr,
      checkInTime: timeStr,
    });
    this.loadAvailableRooms();
  }

  checkOutNow() {
    const now = new Date();
    const dateStr =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0');
    const timeStr =
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0');
    this.bookingForm.patchValue({
      checkOutDate: dateStr,
      checkOutTime: timeStr,
    });
    this.loadAvailableRooms();
  }

  getTimestamp(datetime: string) {
    const date = new Date(datetime);
    if (isNaN(date.getTime())) {
      return null;
    }
    return Timestamp.fromDate(new Date(datetime));
  }

  async checkAndAddGuest(guest: any) {
    const guestName = guest.name;
    const guestDob = guest.dob;
    if (guestName && guestDob) {
      const docs = await this.databaseService.getAllGuests();
      console.log('Got docs', docs);
      let found = false;
      docs.forEach((doc) => {
        if (
          doc.data().name === guestName &&
          doc.data().dob.toDate() === guestDob
        ) {
          found = true;
          this.guestId = doc.id;
          return this.guestId;
        }
      });
      console.log('Searched docs', 'not found');
      if (!found) {
        console.log('Adding Guest');
        const doc = await this.databaseService.addGuest(guest);
        console.log('Added Guest', doc);
        this.guestId = doc.id;
        return this.guestId;
      }
    }
  }
  async submit() {
    console.log('BookingDetails', this.bookingForm);
    if (this.bookingForm.valid && this.aadhaarImage && this.panImage) {
      this.dataProvider.pageSetting.blur = true;
      console.log('BookingDetails', 'step1');
      console.log('BookingDetails', 'step2');
      const persons: any[] = [];
      var data: any = {};
      const checkInTime = new Date(this.checkInDate);
      checkInTime.setHours(12);
      checkInTime.setMinutes(0);
      const checkOutTime = new Date(this.checkOutDate);
      checkOutTime.setHours(24);
      checkOutTime.setMinutes(0);
      const memberIds: string[] = [];
      this.roomMembers.forEach(async (member) => {
        const id = await this.checkAndAddGuest({
          name: member.name,
          dob: new Date(member.dob),
        });
        memberIds.push(id);
      });
      this.roomMembers.forEach(async (member) => {
        persons.push({
          name: member.name,
          dob: new Date(member.dob),
          email: member.email,
          phoneNumber: member.phoneNumber,
          aadhaarNumber: member.aadhaarNumber,
          panNumber: member.panNumber,
          aadhaarImageUrl: await this.databaseService.upload(
            'guests/' + member.name + '/' + member.dob + '/aadhaar',
            member.panImage
          ),
          panImageUrl: await this.databaseService.upload(
            'guests/' + member.name + '/' + member.dob + '/pan',
            member.panImage
          ),
        });
      });
      data = {
        roomId: this.bookingForm.get('roomId')!.value,
        persons: persons,
        bookingType: this.bookingType,
        checkInTime: Timestamp.fromDate(checkInTime),
        checkOutTime: Timestamp.fromDate(checkOutTime),
        paymentStatus: this.bookingForm.get('paymentStatus')!.value,
        price: this.bookingForm.get('roomPrice')!.value,
      };
      console.log('BookingDetails', 'step3-4');
      console.log('BookingDetails', 'step4');
      if (memberIds.length > 0) {
        data['guestIds'] = memberIds;
        this.alertService.presentToast('Please wait...', 'info', 2000);
        this.databaseService.addBooking(data).then((doc) => {
          this.alertService.presentToast(
            'Just a moment while we are processing your booking...',
            'info',
            2000
          );
          // this.databaseService
          //   .assignBooking(doc.id, data.roomId, id)
          //   .then(() => {
          //     this.alertService.presentToast('Booking added successfully');
          //     this.dataProvider.pageSetting.blur = false;
          //   });
        });
      } else {
        this.alertService.presentToast('Some error occured');
      }

      // if (this.bookingType === 'single') {
      //   persons.push(this.singleBookingForm.value);
      //   const id = await this.checkAndAddGuest({
      //     ...this.singleBookingForm.value,
      //     dob: new Date(this.singleBookingForm.get('dateOfBirth')!.value),
      //   });
      //   data = {
      //     roomId: this.bookingForm.get('roomId')!.value,
      //     persons: persons,
      //     aadhaarImage: await this.databaseService.upload(
      //       'guests/' + id + '/aadhaarImage',
      //       this.aadhaarImage
      //     ),
      //     panImage: await this.databaseService.upload(
      //       'guests/' + id + '/panImage',
      //       this.panImage
      //     ),
      //     bookingType: this.bookingType,
      //     checkInTime: Timestamp.fromDate(checkInTime),
      //     checkOutTime: Timestamp.fromDate(checkOutTime),
      //     paymentStatus: this.bookingForm.get('paymentStatus')!.value,
      //   };
      //   console.log('BookingDetails', 'step3-4');
      //   console.log('BookingDetails', 'step4');
      //   if (id) {
      //     data['guestId'] = id;
      //     this.alertService.presentToast('Please wait...', 'info', 2000);
      //     this.databaseService.addBooking(data).then((doc) => {
      //       this.alertService.presentToast(
      //         'Just a moment while we are processing your booking...',
      //         'info',
      //         2000
      //       );
      //       this.databaseService
      //         .assignBooking(doc.id, data.roomId, id)
      //         .then(() => {
      //           this.alertService.presentToast('Booking added successfully');
      //           this.dataProvider.pageSetting.blur = false;
      //         });
      //     });
      //   } else {
      //     this.alertService.presentToast('Some error occured');
      //   }
      // } else if (this.bookingType === 'couple') {
      //   persons.push({
      //     name: this.coupleBookingForm.get('name')!.value,
      //     email: this.coupleBookingForm.get('email')!.value,
      //     phone: this.coupleBookingForm.get('phone')!.value,
      //     aadhaarNumber: this.coupleBookingForm.get('aadhaarNumber')!.value,
      //     panNumber: this.coupleBookingForm.get('panNumber')!.value,
      //     address: this.coupleBookingForm.get('address')!.value,
      //     dob: new Date(this.coupleBookingForm.get('dateOfBirth')!.value),
      //   });
      //   persons.push({
      //     name: this.coupleBookingForm.get('spouseName')!.value,
      //     email: this.coupleBookingForm.get('spouseEmail')!.value,
      //     phone: this.coupleBookingForm.get('spousePhoneNumber')!.value,
      //     aadhaarNumber: this.coupleBookingForm.get('spouseAadhaarNumber')!
      //       .value,
      //     panNumber: this.coupleBookingForm.get('spousePanNumber')!.value,
      //     dob: new Date(this.coupleBookingForm.get('spouseDateOfBirth')!.value),
      //   });
      //   console.log('BookingDetails', 'step3-4');
      //   const id = await this.checkAndAddGuest({
      //     name: this.coupleBookingForm.get('name')!.value,
      //     email: this.coupleBookingForm.get('email')!.value,
      //     phone: this.coupleBookingForm.get('phone')!.value,
      //     aadhaarNumber: this.coupleBookingForm.get('aadhaarNumber')!.value,
      //     panNumber: this.coupleBookingForm.get('panNumber')!.value,
      //     address: this.coupleBookingForm.get('address')!.value,
      //     dob: new Date(this.coupleBookingForm.get('dateOfBirth')!.value),
      //   });
      //   const spouseId = await this.checkAndAddGuest({
      //     name: this.coupleBookingForm.get('spouseName')!.value,
      //     email: this.coupleBookingForm.get('spouseEmail')!.value,
      //     phone: this.coupleBookingForm.get('spousePhoneNumber')!.value,
      //     aadhaarNumber: this.coupleBookingForm.get('spouseAadhaarNumber')!
      //       .value,
      //     panNumber: this.coupleBookingForm.get('spousePanNumber')!.value,
      //     dob: new Date(this.coupleBookingForm.get('spouseDateOfBirth')!.value),
      //   });
      //   data = {
      //     roomId: this.bookingForm.get('roomId')!.value,
      //     persons: persons,
      //     aadhaarImage: await this.databaseService.upload(
      //       'guests/' + id + '/aadhaarImage',
      //       this.aadhaarImage
      //     ),
      //     panImage: await this.databaseService.upload(
      //       'guests/' + id + '/panImage',
      //       this.panImage
      //     ),
      //     bookingType: this.bookingType,
      //     checkInTime: Timestamp.fromDate(checkInTime),
      //     checkOutTime: Timestamp.fromDate(checkOutTime),
      //     paymentStatus: this.bookingForm.get('paymentStatus')!.value,
      //   };
      //   console.log('BookingDetails', 'step4');
      //   if (id) {
      //     data['guestId'] = id;
      //     this.alertService.presentToast('Please wait...', 'info', 2000);
      //     this.databaseService.addBooking(data).then((doc) => {
      //       this.alertService.presentToast(
      //         'Just a moment while we are processing your booking...',
      //         'info',
      //         2000
      //       );
      //       this.databaseService
      //         .assignBooking(doc.id, data.roomId, id)
      //         .then(() => {
      //           this.alertService.presentToast('Booking added successfully');
      //           this.dataProvider.pageSetting.blur = false;
      //         });
      //     });
      //   } else {
      //     this.alertService.presentToast('Some error occured');
      //   }
      // } else if (this.bookingType === 'group') {
      //   this.groupMembers.forEach((member) => {
      //     persons.push({
      //       name: member.name.value,
      //       dob: this.getTimestamp(member.dob.value) as Timestamp,
      //       phone: member.phone.value || '',
      //       email: member.email.value || '',
      //     });
      //   });
      //   console.log('BookingDetails', 'step3-4');
      //   const id = await this.checkAndAddGuest({
      //     name: this.groupBookingForm.get('name')!.value,
      //     email: this.groupBookingForm.get('email')!.value,
      //     phone: this.groupBookingForm.get('phone')!.value,
      //     aadhaarNumber: this.groupBookingForm.get('aadhaarNumber')!.value,
      //     panNumber: this.groupBookingForm.get('panNumber')!.value,
      //     address: this.groupBookingForm.get('address')!.value,
      //     dob: new Date(this.groupBookingForm.get('dateOfBirth')!.value),
      //   });
      //   const spouseId = await this.checkAndAddGuest({
      //     name: this.groupBookingForm.get('spouseName')!.value,
      //     email: this.groupBookingForm.get('spouseEmail')!.value,
      //     phone: this.groupBookingForm.get('spousePhoneNumber')!.value,
      //     aadhaarNumber: this.groupBookingForm.get('spouseAadhaarNumber')!
      //       .value,
      //     panNumber: this.groupBookingForm.get('spousePanNumber')!.value,
      //     dob: new Date(this.groupBookingForm.get('spouseDateOfBirth')!.value),
      //   });
      //   data = {
      //     roomId: this.bookingForm.get('roomId')!.value,
      //     persons: persons,
      //     aadhaarImage: await this.databaseService.upload(
      //       'guests/' + id + '/aadhaarImage',
      //       this.aadhaarImage
      //     ),
      //     panImage: await this.databaseService.upload(
      //       'guests/' + id + '/panImage',
      //       this.panImage
      //     ),
      //     bookingType: this.bookingType,
      //     checkInTime: Timestamp.fromDate(checkInTime),
      //     checkOutTime: Timestamp.fromDate(checkOutTime),
      //     paymentStatus: this.bookingForm.get('paymentStatus')!.value,
      //   };
      //   console.log('BookingDetails', 'step4');
      //   if (id) {
      //     data['guestId'] = id;
      //     this.alertService.presentToast('Please wait...', 'info', 2000);
      //     this.databaseService.addBooking(data).then((doc) => {
      //       this.alertService.presentToast(
      //         'Just a moment while we are processing your booking...',
      //         'info',
      //         2000
      //       );
      //       this.databaseService
      //         .assignBooking(doc.id, data.roomId, id)
      //         .then(() => {
      //           this.alertService.presentToast('Booking added successfully');
      //           this.dataProvider.pageSetting.blur = false;
      //         });
      //     });
      //   } else {
      //     this.alertService.presentToast('Some error occured');
      //   }
      // } else if (this.bookingType === 'family') {
      //   this.familyMembers.forEach((member) => {
      //     persons.push({
      //       name: member.name.value,
      //       dob: this.getTimestamp(member.dob.value) as Timestamp,
      //       phone: member.phone.value || '',
      //       email: member.email.value || '',
      //     });
      //   });
      //   console.log('BookingDetails', 'step3-4');
      //   const id = await this.checkAndAddGuest({
      //     name: this.groupBookingForm.get('name')!.value,
      //     email: this.groupBookingForm.get('email')!.value,
      //     phone: this.groupBookingForm.get('phone')!.value,
      //     aadhaarNumber: this.groupBookingForm.get('aadhaarNumber')!.value,
      //     panNumber: this.groupBookingForm.get('panNumber')!.value,
      //     address: this.groupBookingForm.get('address')!.value,
      //     dob: new Date(this.groupBookingForm.get('dateOfBirth')!.value),
      //   });
      //   const spouseId = await this.checkAndAddGuest({
      //     name: this.groupBookingForm.get('spouseName')!.value,
      //     email: this.groupBookingForm.get('spouseEmail')!.value,
      //     phone: this.groupBookingForm.get('spousePhoneNumber')!.value,
      //     aadhaarNumber: this.groupBookingForm.get('spouseAadhaarNumber')!
      //       .value,
      //     panNumber: this.groupBookingForm.get('spousePanNumber')!.value,
      //     dob: new Date(this.groupBookingForm.get('spouseDateOfBirth')!.value),
      //   });
      //   data = {
      //     roomId: this.bookingForm.get('roomId')!.value,
      //     persons: persons,
      //     aadhaarImage: await this.databaseService.upload(
      //       'guests/' + id + '/aadhaarImage',
      //       this.aadhaarImage
      //     ),
      //     panImage: await this.databaseService.upload(
      //       'guests/' + id + '/panImage',
      //       this.panImage
      //     ),
      //     bookingType: this.bookingType,
      //     checkInTime: Timestamp.fromDate(checkInTime),
      //     checkOutTime: Timestamp.fromDate(checkOutTime),
      //     paymentStatus: this.bookingForm.get('paymentStatus')!.value,
      //   };
      //   console.log('BookingDetails', 'step4');
      //   if (id) {
      //     data['guestId'] = id;
      //     this.alertService.presentToast('Please wait...', 'info', 2000);
      //     this.databaseService.addBooking(data).then((doc) => {
      //       this.alertService.presentToast(
      //         'Just a moment while we are processing your booking...',
      //         'info',
      //         2000
      //       );
      //       this.databaseService
      //         .assignBooking(doc.id, data.roomId, id)
      //         .then(() => {
      //           this.alertService.presentToast('Booking added successfully');
      //           this.dataProvider.pageSetting.blur = false;
      //         });
      //     });
      //   } else {
      //     this.alertService.presentToast('Some error occured');
      //   }
      // }
      console.log('BookingDetails', data);
      // this.databaseService
      //   .addBooking({
      //     roomId: this.bookingForm.get('roomId')!.value,
      //     guestId: this.guestId,
      //     persons: persons,
      //     checkInTime: Timestamp.fromDate(checkInTime),
      //     checkOutTime: Timestamp.fromDate(checkOutTime),
      //     paymentStatus: this.bookingForm.get('paymentStatus')!.value,
      //   })
      //   .then(() => {
      //     UIkit.modal(document.getElementById('add-booking-modal')).hide();
      //     this.dataProvider.pageSetting.blur = false;
      //     this.alertService.presentToast('Booking added successfully');
      //     this.resetBookingModal();
      //     this.ngOnInit();
      //   });
    } else {
      Object.keys(this.bookingForm.controls).forEach((element) => {
        if (this.bookingForm.get(element)!.status === 'INVALID') {
          this.alertService.presentToast('Error with ' + element);
        }
      });
    }
  }

  deleteBooking() {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService
      .deleteBooking(this.bookingToDelete.bookingId)
      .then(async () => {
        UIkit.modal(document.getElementById('delete-confirm-modal')).hide();
        this.dataProvider.pageSetting.blur = false;
        this.alertService.presentToast('Booking deleted successfully');
        this.ngOnInit();
      });
  }
  setAadhaarImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      // check type for image is image and size less than 1mb
      const file = event.target.files[0];
      if (file.type.startsWith('image') && file.size < 1000000) {
        this.aadhaarImage = event.target.files[0];
      } else {
        event.value = '';
        this.aadhaarImage = undefined;
        this.alertService.presentToast(
          'Invalid file type or size, Should be an image less than 1MB'
        );
      }
    } else {
      event.value = '';
      this.aadhaarImage = undefined;
      this.alertService.presentToast('Invalid image');
    }
  }
  setPanImage($event: any) {
    if ($event.target.files && $event.target.files[0]) {
      // check type for image is image and size less than 1mb
      const file = $event.target.files[0];
      if (file.type.startsWith('image') && file.size < 1000000) {
        this.panImage = $event.target.files[0];
      } else {
        $event.value = '';
        this.alertService.presentToast(
          'Invalid file type or size, Should be an image less than 1MB'
        );
      }
    } else {
      this.panImage = undefined;
      $event.value = '';
      this.alertService.presentToast('No File Selected');
    }
  }
}
