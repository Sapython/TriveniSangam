import { Injectable } from '@angular/core';
import { PageSetting } from '../structures/method.structure';
import { UserData } from '../structures/user.structure';

@Injectable()
export class DataProvider{
    public data:any;
    public pageSetting:PageSetting={
        blur:false,
        lastRedirect:'',
        message:'',
        spinner:false,
        messageType:'Error'
    };
    public userData:UserData;
    public loggedIn:boolean = false;
    public gettingUserData:boolean = false;
    public userID:string;
    public ingredientsCopy:any;
    public verifyEmail:boolean;
    public reloadPage:boolean = false;
    public checkoutData:any;
    public shippingData:any;
    public cartTotal:any;
    public cartProducts : any;
    public selectedDeliveryAddress:any;
    public checkoutType: 'product' | 'room';
    public dataFour:any;
}
