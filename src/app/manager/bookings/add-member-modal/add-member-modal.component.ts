import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatabaseService } from 'src/app/services/database.service';
import Fuse from 'fuse.js';
import { DataProvider } from 'src/app/providers/data.provider';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { Guest } from 'src/app/structures/booking.structure';
import { doc } from 'firebase/firestore';

@Component({
  selector: 'app-add-member-modal',
  templateUrl: './add-member-modal.component.html',
  styleUrls: ['./add-member-modal.component.css'],
})
export class AddMemberModalComponent implements OnInit {
  aadhaarImage: any;
  panImage: any;
  allGuests: Guest[];
  filteredGuests: Guest[];

  memberForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    address: new FormControl(''),
    aadhaarNumber: new FormControl(''),
    aadhaarImage: new FormControl(null),
    panNumber: new FormControl(''),
    panImage: new FormControl(null),
  });

  @Output() addMember = new EventEmitter<any>();

  constructor(
    private databaseService: DatabaseService,
    private dialog: MatDialog,
    private dataProvider: DataProvider,
    private alertify: AlertsAndNotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: { primary: boolean }
  ) {}

  ngOnInit(): void {
    if (this.data.primary) {
      this.memberForm.controls['phoneNumber'].addValidators([
        Validators.required,
      ]);
      this.memberForm.controls['email'].addValidators([Validators.required]);
      this.memberForm.controls['address'].addValidators([Validators.required]);
      this.memberForm.controls['aadhaarNumber'].addValidators([
        Validators.required,
      ]);
      this.memberForm.controls['aadhaarImage'].addValidators([
        Validators.required,
      ]);
      this.memberForm.controls['panNumber'].addValidators([
        Validators.required,
      ]);
      this.memberForm.controls['panImage'].addValidators([Validators.required]);
    } else {
      this.memberForm.controls['phoneNumber'].removeValidators([
        Validators.required,
      ]);
      this.memberForm.controls['email'].removeValidators([Validators.required]);
      this.memberForm.controls['address'].removeValidators([
        Validators.required,
      ]);
      this.memberForm.controls['aadhaarNumber'].removeValidators([
        Validators.required,
      ]);
      this.memberForm.controls['aadhaarImage'].removeValidators([
        Validators.required,
      ]);
      this.memberForm.controls['panNumber'].removeValidators([
        Validators.required,
      ]);
      this.memberForm.controls['panImage'].removeValidators([
        Validators.required,
      ]);
    }

    this.databaseService.getAllGuests().then((guestDocs) => {
      this.allGuests = [];
      guestDocs.forEach((guestDoc) => {
        this.allGuests.push({
          guestId: guestDoc.id,
          ...(guestDoc.data() as Guest),
        });
      });
      this.filteredGuests = this.allGuests;
    });
  }

  searchGuests(event: Event) {
    const query = (event.target as HTMLInputElement).value.trim();
    if (query.length > 0) {
      const options = { keys: ['name'] };
      const fuse = new Fuse(this.allGuests, options);
      const results = fuse.search(query);
      this.filteredGuests = [];
      results.forEach((result: any) => {
        this.filteredGuests.push(result.item);
      });
    } else {
      this.filteredGuests = this.allGuests;
    }
  }

  selectGuest(guest: Guest) {
    this.dialog.closeAll();
    this.memberForm.reset();
    this.addMember.emit(guest);
  }

  async submit(data: any) {
    if (this.memberForm.valid) {
      this.dataProvider.pageSetting.blur = true;

      data.dob = new Date(data.dob);
      if (this.memberForm.get('aadhaarImage')?.value) {
        console.log(this.aadhaarImage);
        data.aadhaarImageUrl = await this.databaseService.upload(
          'guests/' + data.name + '/' + this.memberForm.value.dob + '/aadhaar',
          this.aadhaarImage.target.files[0]
        );
      }
      if (this.memberForm.get('panImage')?.value) {
        console.log(this.panImage);
        data.panImageUrl = await this.databaseService.upload(
          'guests/' + data.name + '/' + this.memberForm.value.dob + '/pan',
          this.panImage.target.files[0]
        );
      }

      await this.databaseService
        .addGuest(data)
        .then(() => {
          this.memberForm.reset();
          this.dialog.closeAll();
          this.addMember.emit(data);
          this.dataProvider.pageSetting.blur = false;
          this.alertify.presentToast('Guest added successfully');
        })
        .catch((err) => {
          console.log(err);
          this.memberForm.reset();
          this.dialog.closeAll();
          this.dataProvider.pageSetting.blur = false;
          this.alertify.presentToast('Error adding member', 'error');
        });
    }
  }
}
