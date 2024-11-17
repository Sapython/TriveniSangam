import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import Fuse from 'fuse.js';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { Guest } from 'src/app/structures/booking.structure';
declare const UIkit: any;

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css', '../manager.util.scss'],
})
export class GuestsComponent implements OnInit {
  guests: Guest[];
  filteredGuests: Guest[];
  aadhaarImage: any;
  panImage: any;
  @ViewChild('guestSearchInput') guestSearchInput: ElementRef;
  guestToEdit: any;
  guestToDelete: any;
  guestForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    dob: new UntypedFormControl('', [Validators.required]),
    phoneNumber: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required]),
    address: new UntypedFormControl('', [Validators.required]),
    panNumber: new UntypedFormControl('', [Validators.required]),
    aadhaarNumber: new UntypedFormControl('', [Validators.required]),
  });

  constructor(
    private databaseService: DatabaseService,
    private dataProvider: DataProvider,
    private alertService: AlertsAndNotificationsService
  ) {}

  ngOnInit(): void {
    this.databaseService.getFirstGuests(10).then((docs) => {
      this.guests = [];
      docs.forEach((doc) => {
        this.guests.push({ guestId: doc.id, ...doc.data() } as Guest);
      });
      this.filteredGuests = this.guests;
    });
  }

  searchGuests() {
    const query = this.guestSearchInput.nativeElement.value.trim();
    if (query.length > 0) {
      const options = { keys: ['name', 'phoneNumber'] };
      const fuse = new Fuse(this.guests, options);
      const results = fuse.search(query);
      this.filteredGuests = [];
      results.forEach((result) => {
        this.filteredGuests.push(result.item);
      });
    } else {
      this.filteredGuests = this.guests;
    }
  }

  getDate(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getTimestamp(datetime: string) {
    const date = new Date(datetime);
    if (isNaN(date.getTime())) {
      return null;
    }
    return Timestamp.fromDate(new Date(datetime));
  }

  editGuest(guest: Guest) {
    this.guestToEdit = guest;
    const dobStr = formatDate(guest.dob.toDate(), 'yyyy-MM-dd', 'en');
    this.guestForm.patchValue({
      name: guest.name,
      dob: dobStr,
      phoneNumber: guest.phoneNumber,
      email: guest.email,
      address: guest.address,
      panNumber: guest.panNumber,
      aadhaarNumber: guest.aadhaarNumber,
    });
  }

  deleteGuest() {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService
      .deleteGuest(this.guestToDelete.guestId)
      .then(async () => {
        UIkit.modal(document.getElementById('delete-confirm-modal')).hide();
        this.dataProvider.pageSetting.blur = false;
        this.alertService.presentToast('Guest deleted successfully');
        this.ngOnInit();
      });
  }

  submit() {
    if (this.guestForm.valid) {
      this.dataProvider.pageSetting.blur = true;

      // Check if phone number doesn't already exist
      const phone = this.guestForm.get('phoneNumber')!.value.toString().trim();
      this.databaseService
        .getGuestByPhone(phone)
        .then((docs) => {
          var phoneIsUnique = true;
          if (docs.size > 0) {
            docs.forEach((doc) => {
              const guest = doc.data();
              // If we are in add mode, then we can't have the same phone number
              // If we are in edit mode, the phone number should be the same as the guest we are editing or shoule be unique
              if (!this.guestToEdit || doc.id !== this.guestToEdit.guestId) {
                this.alertService.presentToast(
                  'This number already exists. It belongs to ' + guest.name
                );
                phoneIsUnique = false;
                this.dataProvider.pageSetting.blur = false;
              } else {
              }
            });
          }
          return phoneIsUnique;
        })
        .then(async (phoneIsUnique) => {
          // If phone number is unique, add/edit that guest
          if (phoneIsUnique) {
            const guest = {
              ...this.guestForm.value,
              dob: this.getTimestamp(
                this.guestForm.get('dob')?.value
              ) as Timestamp,
              aadhaarImageUrl:await this.databaseService.upload('guests/'+this.guestForm.value.name+'/'+this.guestForm.value.dob+'/aadhaar',this.aadhaarImage.target.files[0]),
              panImageUrl: await this.databaseService.upload('guests/'+this.guestForm.value.name+'/'+this.guestForm.value.dob+'/pan',this.panImage.target.files[0]),
            };
            if (this.guestToEdit) {
              await this.databaseService.editGuest(
                this.guestToEdit.guestId,
                guest
              );
            } else {
              await this.databaseService.addGuest(guest);
            }
            UIkit.modal(document.getElementById('guest-modal')).hide();
            this.dataProvider.pageSetting.blur = false;
            if (this.guestToEdit) {
              this.alertService.presentToast('Guest edited successfully');
            } else {
              this.alertService.presentToast('Guest added successfully');
            }
            this.ngOnInit();
          }
        });
    }
  }
}
