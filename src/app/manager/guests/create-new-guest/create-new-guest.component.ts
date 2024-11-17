import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-new-guest',
  templateUrl: './create-new-guest.component.html',
  styleUrls: ['./create-new-guest.component.css']
})
export class CreateNewGuestComponent implements OnInit {
  selectedFilters: any = {
    availabilty: 'Single',
    type: 'Single',
  };

  constructor() { }

  ngOnInit(): void {
  }

}
