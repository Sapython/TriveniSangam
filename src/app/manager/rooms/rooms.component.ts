import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Booking } from 'src/app/structures/booking.structure';
import { Room } from 'src/app/structures/rooms.structure';
import { DataProvider } from 'src/app/providers/data.provider';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';
declare const UIkit: any;

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css', '../manager.util.scss'],
})
export class RoomsComponent implements OnInit {
  breakpoint: number = 500;
  largeScreen: boolean = window.innerWidth > this.breakpoint;
  @ViewChild('selector') selector: any;
  selectedFilters: any = {
    type: 'All',
  };
  days: any[];
  rooms: Room[];
  bookings: Booking[];
  monthNo: number;
  year: number;
  roomTypes: any[];

  selectedRooms: any[] = [];
  roomForm: UntypedFormGroup = new UntypedFormGroup({
    number: new UntypedFormControl('', [Validators.required]),
    type: new UntypedFormControl('', [Validators.required]),
    ratePerDay: new UntypedFormControl('', [Validators.required]),
  });

  allowMultiSelect: boolean = false;
  enableDragSelect: boolean = false;
  triggeredFirstEvent: boolean = false;
  dragStartPointX: number = 0;
  dragStartPointY: number = 0;
  previousTarget: any;
  constructor(
    private databaseService: DatabaseService,
    private dataProvider: DataProvider,
    private alertService: AlertsAndNotificationsService,
    private router: Router
  ) {}

  // Drag implementation
  @HostListener('window:keydown.Control', ['$event'])
  addDrag(event$) {
    this.allowMultiSelect = true;
  }

  @HostListener('window:keyup.Control', ['$event'])
  removeDrag(event$) {
    const localSelectedRooms = JSON.parse(JSON.stringify(this.selectedRooms));
    this.selectedRooms = [];
    this.allowMultiSelect = false;
  }

  @HostListener('window:keydown.Escape', ['$event'])
  clearDrag(event$) {
    this.selectedRooms = [];
  }

  @HostListener('window:mousedown', ['$event'])
  onMouseDown(event: any) {
    console.log(event);
    this.allowMultiSelect = true;
    this.enableDragSelect = true;
  }
  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: any) {
    this.allowMultiSelect = false;
    console.log(event);
    this.enableDragSelect = false;
    this.dragStartPointX = 0;
    this.dragStartPointY = 0;
    this.triggeredFirstEvent = false;
    this.selector.nativeElement.style.width = '0px';
    this.selector.nativeElement.style.height = '0px';
    this.selector.nativeElement.hidden = true;
    this.previousTarget = null;
    console.log('TARGET:', event.target.classList.contains('room'));
    const localSelectedRooms = JSON.parse(JSON.stringify(this.selectedRooms));
    if (
      localSelectedRooms.length > 0 &&
      event.target.classList.contains('room')
    ) {
      this.router.navigate(['/RoomManager/bookings'], {
        queryParams: { rooms: JSON.stringify(localSelectedRooms) },
      });
    }
    this.selectedRooms = [];
    this.allowMultiSelect = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: any) {
    if (this.enableDragSelect) {
      if (!this.triggeredFirstEvent) {
        this.triggeredFirstEvent = true;
        const date = event.target.id.split('|')[0];
        const room = event.target.id.split('|')[1];
        const type = event.target.id.split('|')[2];
        this.selectRoom(date, room, type);
        this.previousTarget = event.target;
        console.log(event.target);
      } else {
        if (this.previousTarget.id != event.target.id) {
          this.previousTarget = event.target;
          const date = event.target.id.split('|')[0];
          const room = event.target.id.split('|')[1];
          const type = event.target.id.split('|')[2];
          this.selectRoom(date, room, type);
        }
      }
    }
  }

  selectRoom(dateId, roomId, type) {
    if (this.allowMultiSelect) {
      var rejected: boolean = false;
      if (this.selectedRooms.length > 0) {
        if (this.selectedRooms[0].id !== roomId) {
          rejected = true;
        }
        this.selectedRooms.forEach((date, index: number) => {
          if (date.date == dateId && date.id == roomId) {
            this.selectedRooms.splice(index, 1);
            rejected = true;
          }
        });
      }
      if (!rejected) {
        this.selectedRooms.push({ date: dateId, id: roomId });
      }
      if (!rejected) {
        this.selectedRooms.push({ date: dateId, id: roomId, type: type });
      }
    }
  }

  isSelected(dateId, roomId) {
    for (const room of this.selectedRooms) {
      if (room.date == dateId && room.id == roomId) {
        return true;
      }
    }
    return false;
  }
  // Drag ended

  onWindowResize() {
    this.largeScreen = window.innerWidth > this.breakpoint;
  }

  async ngOnInit() {
    this.databaseService.getRoomTypes().then((doc) => {
      this.roomTypes = doc.data()?.types;
    });

    // Alternatively color .booked-cell
    const bookedCells = document.getElementsByClassName('booked-cell');
    for (let index = 0; index < bookedCells.length; index += 2) {
      const bookedCell = bookedCells[index];
      bookedCell.classList.add('booked-cell-even');
    }

    // Load rooms
    await this.databaseService.getAllRooms().then((docs) => {
      this.rooms = [];
      docs.forEach((doc) => {
        this.rooms.push({ roomId: doc.id, ...doc.data() } as Room);
      });
    });

    // Load bookings
    await this.databaseService.getAllBookings().then((docs) => {
      this.bookings = [];
      docs.forEach((doc) => {
        this.bookings.push(doc.data() as Booking);
      });
    });

    // Load days
    const today = new Date();
    this.monthNo = today.getMonth();
    this.year = today.getFullYear();
    this.loadMonth();
  }

  loadMonth() {
    const monthDays = (() => {
      if ([0, 2, 4, 6, 7, 9, 11].includes(this.monthNo)) {
        return 31;
      }
      if ([3, 5, 8, 10].includes(this.monthNo)) {
        return 30;
      }
      if (
        this.year % 400 == 0 ||
        (this.year % 4 == 0 && this.year % 100 != 0)
      ) {
        return 29;
      }
      return 28;
    })();
    const monthName = new Date(this.year, this.monthNo).toLocaleString(
      'default',
      { month: 'short' }
    );
    this.days = [];
    for (var i = 1; i <= monthDays; i++) {
      this.days.push({
        name: `${monthName} ${i}, ${this.year}`,
      });
    }
    this.bookings.forEach((booking) => {
      const thisMonth = new Date(this.year, this.monthNo, 1);
      const nextMonth = new Date(
        this.monthNo == 11 ? this.year + 1 : this.year,
        this.monthNo == 11 ? 0 : this.monthNo + 1,
        1
      );
      const checkIn = booking.checkInTime.toDate();
      const checkOut = booking.checkOutTime?.toDate() || nextMonth;
      const checkInDate = new Date(
        checkIn.getFullYear(),
        checkIn.getMonth(),
        checkIn.getDate()
      );
      const checkOutDate = new Date(
        checkOut.getFullYear(),
        checkOut.getMonth(),
        checkOut.getDate()
      );

      for (var i = 1; i <= monthDays; i++) {
        const date = new Date(this.year, this.monthNo, i);
        if (checkInDate <= date && date <= checkOutDate) {
          this.days[i - 1][booking.roomId] = booking.guests[0];
        }
      }
    });
  }

  lastMonth() {
    this.monthNo--;
    if (this.monthNo < 0) {
      this.monthNo = 11;
      this.year--;
    }
    this.loadMonth();
  }

  nextMonth() {
    this.monthNo++;
    if (this.monthNo > 11) {
      this.monthNo = 0;
      this.year++;
    }
    this.loadMonth();
  }

  submit() {
    if (this.roomForm.valid) {
      this.dataProvider.pageSetting.blur = true;

      // Check if room number doesn't already exist
      const number = this.roomForm.get('number')!.value.trim();
      for (const room of this.rooms) {
        if (room.number === number) {
          this.dataProvider.pageSetting.blur = false;
          this.alertService.presentToast(
            'Room number ' + number + ' already exists'
          );
          return;
        }
      }
      const room = {
        ...this.roomForm.value,
        lastCleaned: Timestamp.now(),
        images: [],
      };
      this.databaseService.addRoom(room).then(() => {
        UIkit.modal(document.getElementById('room-modal')).hide();
        this.dataProvider.pageSetting.blur = false;
        this.alertService.presentToast('Room added successfully');
        this.ngOnInit();
      });
    }
  }
  bookRoom(event: any) {
    console.log(event);
  }
}
