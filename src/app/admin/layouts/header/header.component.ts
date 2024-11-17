import { Component, OnInit } from '@angular/core';
import { AuthencationService } from 'src/app/services/authencation.service';

declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService : AuthencationService) { }

  ngOnInit(): void {
    $('.navbar-toggler').on('click', function(){
      $('#sidebarMenu').slideToggle( "fast", function() {
      });
    });
  }

}
