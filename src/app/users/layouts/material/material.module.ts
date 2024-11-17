

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';



const modulesData = [MatAutocompleteModule,MatIconModule,MatChipsModule, MatFormFieldModule,MatNativeDateModule, MatInputModule, MatButtonToggleModule, MatCheckboxModule, MatProgressSpinnerModule, MatSelectModule,MatRadioModule,MatDatepickerModule ]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    modulesData
  ],
  exports: [
    modulesData
  ]
})
export class MaterialModule { }
