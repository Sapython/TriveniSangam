import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {

  feedbackSub : Subscription = Subscription.EMPTY;
  feedbackData : any = [];
  constructor(private databaseService : DatabaseService, private dataProvider : DataProvider) { }

  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;

    this.feedbackSub = this.databaseService.getFeedbacks().subscribe(
      (res) => {
        this.feedbackData = [];
        //console.log(res);
        res.forEach((data) => {
          this.feedbackData.push(data.data())
        })
        console.log(this.feedbackData);
        this.dataProvider.pageSetting.blur = false;
      }
    );
  }

}
