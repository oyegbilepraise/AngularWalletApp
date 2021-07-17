import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  constructor(public fb: FormBuilder, private socialAuthService: SocialAuthService, public router: Router) { }

  public socialUser: any = ''
  public userForm: FormGroup = this.fb.group({});
  public alert: String = ''
  public sAlert: String = ''
  public detailsArr: any = []
  public date: any = ''

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fName: ["", [Validators.required]],
      lName: ['', [Validators.required]],
      phone: ['', [Validators.minLength(11), Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      date: this.date,
      balance: 0,
    })
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user
      console.log(this.socialUser);
      // this.router.navigate([`/dashboard/${this.socialUser.id}`])
    })
  }

  get f() {
    return this.userForm.controls
  }
  submitForm() {
    let id = Math.floor(Math.random() * 1000000)
    let acct = Math.floor(Math.random() * 10000000000)
    let value = this.userForm.value;

    if (this.userForm.valid) {
      this.detailsArr.push({
        firstname: value.fName, lastname: value.lName,
        phoneNo: value.phone, mail: value.email,
        password: value.password, id: id, dob: value.date,
        acctNo: acct, history: [], wallet: [], loan: [], acctBal: 0,
        beneficiaries: [], requests: []
      })
      if (localStorage.getItem('myDetails') === null) {
        localStorage.setItem('myDetails', JSON.stringify(this.detailsArr));
      }
      else {
        let Contact: any = localStorage.getItem("myDetails")
        let contactData = JSON.parse(Contact)
        contactData.push(this.detailsArr[this.detailsArr.length - 1])
        localStorage.setItem('myDetails', JSON.stringify(contactData))
      }
      value.fName = ''
      value.lName = ''
      value.phone = ''
      value.email = ''
      value.password = ''
      value.date = ''
      Swal.fire(
        'Succesfully Registered!',
        `You Account No is ${acct}!`,
        'success'
      )
    }
  }
}
