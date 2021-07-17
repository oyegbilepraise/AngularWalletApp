import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankService } from '../Services/bank.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() show: any = ''
  public data: any = ''
  public user:any = ''
  constructor(public route: ActivatedRoute, public router: Router, public _test: BankService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.data = param.get('id')
    })
      let dataFromLS: any = localStorage.getItem('myDetails')
      let myData = JSON.parse(dataFromLS)
    let d: any = myData.find((val: any) => val.id === Number(this.data))
    this.user = d
  }
  back() {
    this._test.show.next(true)
  }
}
