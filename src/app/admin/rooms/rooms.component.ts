import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms : any = [];
  constructor(private databaseService : DatabaseService, private dataProvider : DataProvider, private alertify : AlertsAndNotificationsService) { }

  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.getRooms();
  }
  getRooms(){
    this.databaseService.getRoomsForAdminPanel().then(
      (res) => {
        this.rooms = [];
        //console.log(res);
        res.forEach((roomData) => {
          console.log(roomData.data());
          this.rooms.push(roomData.data())
        })
        console.log(this.rooms)
        this.dataProvider.pageSetting.blur = false;
      }
    );
  }
  deleteRoom(roomid : string){
    Swal.fire({
      title: 'Do you want to delete the Room?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.databaseService.deleteRoom(roomid).then((res)=> {
          this.getRooms();
          this.alertify.presentToast("Room deleted.")
        })
      }
    })

  }

}
