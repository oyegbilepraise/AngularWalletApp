import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BankService } from '../Services/bank.service';

@Injectable({
  providedIn: 'root'
})
export class BankGuard implements CanActivate {

  constructor(public _test: BankService, public actRoute: ActivatedRoute) { }
  public access = ''


  canActivate(
    
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      
      return true
    //   let data:any = localStorage.getItem("myDetails")
    //   let jData = JSON.parse(data)
    //   let dataFromLS: any = localStorage.getItem('myLogin')
    //   let myData = JSON.parse(dataFromLS)
    // let access = jData.find((val: any) => {
    //     return val.mail === myData.email && val.password === myData.password
    //   })

    // if (access) {
    //   console.log(access);
    //   return true
    // }
    // else {
    //   console.log('no');
    //   return false
    // }
  }
  
}
