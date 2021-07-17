import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  public show: any = new BehaviorSubject(true)
  public showPhone: any = new BehaviorSubject(false)

  constructor(public route: ActivatedRoute) { }

  getUser() {
    return this.show
  }
}