import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './rooms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookRoomComponent } from './book-room/book-room.component';
import { ViewEditRoomComponent } from './view-edit-room/view-edit-room.component';


@NgModule({
  declarations: [
    RoomsComponent,
    BookRoomComponent,
    ViewEditRoomComponent
  ],
  imports: [
    CommonModule,
    RoomsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class RoomsModule { }
