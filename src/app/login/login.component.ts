import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface login {
  email: String,
  password: String
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userForm: FormGroup = this.fb.group({});
  public mail: String = ''
  public password: String = ''
  public loginArr: Array<login> = []
  public alert: String = ''
  public sAlert: String = ''
  constructor(public fb: FormBuilder, public router: Router) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]]
    })
  }
  get f() {
    return this.userForm.controls
  }

  submitForm() {
    let value = this.userForm.value;
    if (this.userForm.valid) {
      let data: any = localStorage.getItem('myDetails')
      let getData = JSON.parse(data)
      let myData = getData.find((val: any) => val.mail === value.email && val.password === value.password)

      if (myData) {
        this.loginArr.push(value)
        localStorage.setItem('myLogin', JSON.stringify(this.loginArr))
        Swal.fire(
          `Welcome ${myData.firstname}`,
          `!`,
          'success'
        )
        this.router.navigate([`/dashboard/${myData.id}`])
      }
      else {
        // alert('Bro you ain"t register| Kindly visit d registration page')
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Bro you ain"t register| Kindly visit d registration page!',
          footer: '<a href="#">Why do I have this issue?</a>'
        })
        this.router.navigate(['/register'])
      }
    }
  }

}
