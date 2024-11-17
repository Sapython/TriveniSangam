import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-customer-issues',
  templateUrl: './customer-issues.component.html',
  styleUrls: ['./customer-issues.component.css']
})
export class CustomerIssuesComponent implements OnInit {
  contacts : any = []
  constructor(private dataProvider : DataProvider, private databaseService : DatabaseService) { }

  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.contacts = []
    this.databaseService.getContactReq().then((res) => {
      res.forEach((user) => {
        this.contacts.push(user.data())
      })
      console.log(this.contacts)
      this.dataProvider.pageSetting.blur = false;
    })
  }

}
