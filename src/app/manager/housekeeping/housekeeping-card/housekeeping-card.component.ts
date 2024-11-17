import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { DatabaseService } from 'src/app/services/database.service';
import { Room } from 'src/app/structures/rooms.structure';

@Component({
  selector: 'app-housekeeping-card',
  templateUrl: './housekeeping-card.component.html',
  styleUrls: ['./housekeeping-card.component.css']
})
export class HousekeepingCardComponent implements OnInit {

  @Input() housekeep_room_number: String = "";
  @Input() clean_status: String = "";
  @Input() timeBeen: String = "";
  @Input() room: Room;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
  }

  markClean(): void {
    this.room.lastCleaned = Timestamp.now()
    this.databaseService.editRoom(this.room.roomId!, this.room);
  }

}
