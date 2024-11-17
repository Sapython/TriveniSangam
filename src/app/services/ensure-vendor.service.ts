import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


// USER_GROUP = {
//     "INSTITUTE_ADMIN": "Institute Admin",
//     "INSTRUCTOR": "Instructor",
//     "STUDENT": "Student"
// }
@Injectable()
export class EnsureVendorService implements CanActivate {
    constructor(private router: Router) {}
    canActivate(): boolean {
        //const availableData:any = localStorage.getItem('userData');
        //const userType:any = JSON.parse(availableData);
        // console.log("userType==>",userType);
        // if (userType.user_type=='Institute Admin' || userType.user_type=='admin') {
        //     return true;
        // }
        // else {
        //     // this.sharedService.changeAuth(`${this.router.url}`, false);
        //     this.router.navigateByUrl('/signup');
        //     return false;
        //   }
        return true;
    }

}
