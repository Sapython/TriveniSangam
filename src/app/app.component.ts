import Swiper, { Navigation, Pagination } from 'swiper';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
// import styles bundle
import 'swiper/css/bundle';
import { AuthencationService } from './services/authencation.service';
import { DataProvider } from './providers/data.provider';

declare var $:any;
declare var jQuery :any;
declare var jquery : any;
Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'TriveniSangamHotel';
  constructor(public authService:AuthencationService, public dataProvider : DataProvider){
  }
  ngOnInit(): void{
  }
}
