import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  users : any = []
  constructor(private dataProvider : DataProvider, private databaseService : DatabaseService) { }

  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.users = []
    this.databaseService.getUsers().then((res) => {
      res.forEach((user) => {
        this.users.push(user.data())
      })
      // console.log(this.users)
      this.dataProvider.pageSetting.blur = false;
    })
  }

}
