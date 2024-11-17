import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataProvider } from '../providers/data.provider';


// USER_GROUP = {
//     "INSTITUTE_ADMIN": "Institute Admin",
//     "INSTRUCTOR": "Instructor",
//     "STUDENT": "Student"
// }
@Injectable()
export class EnsureAdminService implements CanActivate {
    constructor(private router: Router, private dataProvider : DataProvider) {}
    canActivate(): boolean {
      const userType:any = this.dataProvider.userData.access;
      if (userType=='Admin') {
          return true;
      }
      else {
          this.router.navigateByUrl('/signup');
          return false;
      }
    }
}
