
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataProvider } from '../providers/data.provider';


@Injectable()
export class EnsureAuthenticated implements CanActivate {
    constructor(private router: Router, private dataProvider : DataProvider) {
      console.log("ensuring the authenticated")
    }
    canActivate(): boolean {
      console.log("userData",this.dataProvider.userData)
      if (this.dataProvider.loggedIn) {
          return true;
      }
      else {
          this.router.navigateByUrl('/sign-up');
          return false;
      }
    //return true;
    }

}
