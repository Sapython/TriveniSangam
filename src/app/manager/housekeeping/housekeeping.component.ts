import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { DatabaseService } from 'src/app/services/database.service';
import { Room } from 'src/app/structures/rooms.structure';

@Component({
  selector: 'app-housekeeping',
  templateUrl: './housekeeping.component.html',
  styleUrls: ['./housekeeping.component.css'],
})
export class HousekeepingComponent implements OnInit {
  rooms: Room[];
  selectedFilters: any = {
    status: 'All',
  };

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.databaseService.getFirstRooms(20).then((docs) => {
      this.rooms = [];
      docs.forEach((doc) => {
        this.rooms.push({roomId: doc.id, ...doc.data()} as Room);
      });
    });
  }

  needsCleaning(lastCleaned: Timestamp): boolean {
    const now = new Date();
    const difference = now.getTime() - lastCleaned.toDate().getTime();
    const days = difference / (1000 * 60 * 60 * 24);
    return days > 1;
  }

  timeBeen(lastCleaned: Timestamp): string {
    const now = new Date();
    const difference = now.getTime() - lastCleaned.toDate().getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    return days.toString();
  }
}
