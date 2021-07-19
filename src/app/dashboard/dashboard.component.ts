import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { setInterval } from 'timers';
import { BankService } from '../Services/bank.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public deposit = ''
  public transferAcct = ''
  public transferPasssword = ''
  public amount = ''
  public Contact = ''
  public data: any = ''
  public user: any = ''
  public user_balance = ''
  public user_profile: any = []
  public user_history: any = []
  public user_wallet: any = []
  public user_beneficiary: any = []
  public user_request: any = ''
  public walletName = ''
  public walletAmt = ''
  public loanAcct = ''
  public loanAmt = ''
  public all_users: any = []
  public input = ''
  public LTrans: any = []
  public usd: any = 0
  public show: any = ''
  public showPhone: any = false
  constructor(public _test: BankService, public actRoute: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this._test.show.subscribe((data: any) => (
      this.show = data
    ))
    this.actRoute.paramMap.subscribe(param => {
      this.data = param.get('id')
      let dataFromLS: any = localStorage.getItem('myDetails')
      let myData = JSON.parse(dataFromLS)
      let d: any = myData.find((val: any) => val.id === Number(this.data))
      let myLogin: any = localStorage.getItem('myLogin')
      let jl: any = JSON.parse(myLogin)

      if (jl) {
        if (d) {
          let access: any = jl.find((val: any) => val.email === d.mail && val.password === d.password)
          if (!access) {
            this.router.navigate(['**'])
          }
        }
        else {
          this.router.navigate(['**'])
        }
      }
      else {
        alert('Kindly Login')
        this.router.navigate(['/login '])
      }

    })

    let dataFromLS: any = localStorage.getItem('myDetails')
    let myData = JSON.parse(dataFromLS)
    let a = myData.filter((val: any) => val.id !== Number(this.data))

    this.all_users = a
    let d: any = myData.find((val: any) => val.id === Number(this.data))

    this.user_history = d.history
    this.user_balance = d.acctBal
    let num = Number(d.acctBal) / Number(411.50)
    this.usd = num.toFixed(2)
    this.user_wallet = d.wallet
    this.user_request = d.loan
    this.user_beneficiary = d.beneficiaries
    this.LTrans = d.requests
    this.user_profile.push(d)
    this.user = d
    this.myFunc()
  }

  searchUser() {
    let a = this.user_history.filter((val: any) => {
      return val.details.toLowerCase().includes(this.input.toLowerCase())
    })
    if (this.input) {
      this.user_history = a
    }
    else {
      let dataFromLS: any = localStorage.getItem('myDetails')
      let myData = JSON.parse(dataFromLS)
      let d: any = myData.find((val: any) => val.id === Number(this.data))
      this.user_history = d.history
    }
  }

  cashDeposit() {
    let time = new Date()

    let dataFromLS: any = localStorage.getItem('myDetails')
    let myData = JSON.parse(dataFromLS)

    let myDetails: any = myData.find((val: any) => val.id === Number(this.data))
    let index = myData.indexOf(myDetails)
    if (this.transferPasssword === myDetails.password) {
      let balance = eval(Number(this.deposit) + myDetails.acctBal)
      Swal.fire(
        `Hey ${myDetails.firstname}`,
        `you have succsfully deposited ${this.deposit} into your account, your new account balance is ${balance}`,
        'success'
      )

      this.user_balance = balance
      myDetails.acctBal = balance
      myDetails.history.unshift({
        details: `You Deposited ${this.deposit} into Your Account`,
        time: time,
        type: "deposit"
      })

      this.user_history.unshift({
        details: `You Deposited ${this.deposit} into Your Account`,
        time: time,
        type: "deposit"
      })
      this.deposit = ''
      this.transferPasssword = ''
      myData[index] = myDetails
      localStorage.setItem('myDetails', JSON.stringify(myData))
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid Password!',
        footer: '<a href="#">Why do I have this issue?</a>'
      })
    }
  }

  cashTransfer() {
    // if (this.transferAcct !== '' && this.amount !== '') {      
    let time = new Date()
    let dataFromLS: any = localStorage.getItem('myDetails')
    let myData = JSON.parse(dataFromLS)

    let myDetails: any = myData.find((val: any) => val.id === Number(this.data))
    let receiverDetails: any = myData.find((val: any) => val.acctNo === Number(this.transferAcct))

    let index = myData.indexOf(myDetails)
    let rIndex = myData.indexOf(receiverDetails)

    if (Number(this.transferAcct) === myDetails.acctNo) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You can"t Transfer funds to your account!',
        footer: '<a href="#">Why do I have this issue?</a>'
      })
    }

    else {
      if (this.transferPasssword === myDetails.password) {
        if ((this.transferAcct.toString().length) !== 10) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Account No. not valid kindly check again and retry again!',
            footer: '<a href="#">Why do I have this issue?</a>'
          })
        }
        else {
          if (this.amount === '') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Please input an amount to transfer!',
              footer: '<a href="#">Why do I have this issue?</a>'
            })
          }
          else {
            if (Number(this.amount) > myDetails.acctBal) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Insufficient Funds, Kindly fund your Account!',
                footer: '<a href="#">Why do I have this issue?</a>'
              })
            }
            else {
              myDetails.acctBal = myDetails.acctBal - Number(this.amount)

              this.user_balance = myDetails.acctBal

              myDetails.history.unshift({
                details: `You Transfered ${this.amount} from ya Account`,
                to: receiverDetails.firstname,
                time: time,
                type: "transfer"
              })

              myDetails.requests.unshift({
                type: "Debit",
                time: time,
                amt: this.amount
              })
              this.LTrans.unshift({
                type: 'Debit',
                time: time,
                amt: this.amount
              })

              receiverDetails.requests.unshift({
                type: 'Credit',
                time: time,
                amt: this.amount
              })

              this.user_history.unshift({
                details: `You Transfered ${this.amount} from ya Account`,
                to: receiverDetails.firstname,
                from: myDetails.firstname,
                time: time,
                type: "transfer",
              })

              receiverDetails.history.unshift({
                details: `You Received ${this.amount} into Your Account`,
                from: myDetails.firstname,
                time: time,
                type: "transfer"
              })
              this.amount = ''
              this.transferPasssword = ''
              this.transferAcct = ''


              myData[index] = myDetails
              myData[rIndex] = receiverDetails

              localStorage.setItem('myDetails', JSON.stringify(myData))
              let a = myDetails.beneficiaries.find((val: any) => val.name === receiverDetails.firstname)
              if (a) {
                myDetails.beneficiaries = a
              }
              else {
                Swal.fire({
                  title: 'Are you sure?',
                  text: "Save as Beneficiary!",
                  icon: 'success',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes!'
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire(
                      'Done.',
                      'Succesfullly saved as beneficiary!',
                      'success'
                    )
                  }
                })
                myDetails.beneficiaries.unshift({
                  name: receiverDetails.firstname,
                  acctNo: receiverDetails.acctNo
                })

                this.user_beneficiary.unshift({
                  name: receiverDetails.firstname,
                  acctNo: receiverDetails.acctNo
                })
                myData[index] = myDetails
                localStorage.setItem('myDetails', JSON.stringify(myData))
              }
            }
          }
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Wrong Password, Kindly check and try again!',
          footer: '<a href="#">Why do I have this issue?</a>'
        })
        this.transferPasssword = ''
      }
    }
    // }
  }

  createWalleet() {
    let time = new Date()

    let dataFromLS: any = localStorage.getItem('myDetails')
    let myData = JSON.parse(dataFromLS)

    let myDetails: any = myData.find((val: any) => val.id === Number(this.data))
    let index = myData.indexOf(myDetails)

    if (this.walletName !== '' && this.walletAmt !== '' && this.transferPasssword === myDetails.password) {
      if (myDetails.acctBal < this.walletAmt) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Insufficient Funds, Kindly fund your Account!',
          footer: '<a href="#">Why do I have this issue?</a>'
        })
      }
      else {
        myDetails.acctBal = myDetails.acctBal - Number(this.walletAmt)
        this.user_balance = myDetails.acctBal

        myDetails.wallet.unshift({
          walletName: this.walletName,
          walletBalance: this.walletAmt,
          myAcctNo: myDetails.acctNo,
          timeCreated: time
        })
        myDetails.history.unshift({
          details: `You created a new Wallet with the nname ${this.walletName}`,
          time: time,
          type: 'wallet'
        })
        this.user_history.unshift({
          details: `You created a new Wallet with the nname ${this.walletName}`,
          time: time,
          type: 'wallet'
        })
        this.user_wallet.unshift({
          walletName: this.walletName,
          walletBalance: this.walletAmt,
          myAcctNo: myDetails.acctNo,
          timeCreated: time
        })
        this.walletAmt = ''
        this.walletName = ''
        this.transferPasssword = ''
        myData[index] = myDetails
        localStorage.setItem('myDetails', JSON.stringify(myData))
        Swal.fire(
          'Done.',
          `${this.walletName} Wallet Created!`,
          'success'
        )
      }
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all fields!',
        footer: '<a href="#">Why do I have this issue?</a>'
      })
      this.walletAmt = ''
      this.walletName = ''
      this.transferPasssword = ''
    }
  }

  deleteBeneficiary(beneficiary: any, i: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let dataFromLS: any = localStorage.getItem('myDetails')
        let myData = JSON.parse(dataFromLS)
        let myDetails: any = myData.find((val: any) => val.id === Number(this.data))
        let index = myData.indexOf(myDetails)
        myDetails.history.splice(i, 1)

        this.user_beneficiary.splice(i, 1)
        myData[index] = myDetails

        localStorage.setItem('myDetails', JSON.stringify(myData))
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  delWallet(wallet: any, i: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let dataFromLS: any = localStorage.getItem('myDetails')
        let myData = JSON.parse(dataFromLS)
        let a = myData.find((val: any) => val.acctNo === wallet.myAcctNo)

        let index = myData.indexOf(a)

        a.acctBal = a.acctBal + Number(wallet.walletBalance)
        this.user_balance = a.acctBal

        a.wallet.splice(i, 1)

        this.user_wallet.splice(i, 1)
        myData[index] = a

        localStorage.setItem('myDetails', JSON.stringify(myData))
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  deleteHistory(history: any, i: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let dataFromLS: any = localStorage.getItem('myDetails')
        let myData = JSON.parse(dataFromLS)
        let myDetails: any = myData.find((val: any) => val.id === Number(this.data))
        let index = myData.indexOf(myDetails)
        myDetails.history.splice(i, 1)

        this.user_history.splice(i, 1)

        myData[index] = myDetails

        localStorage.setItem('myDetails', JSON.stringify(myData))

        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  requestLoan() {
    let time = new Date()
    let dataFromLS: any = localStorage.getItem('myDetails')
    let myData = JSON.parse(dataFromLS)

    let myDetails: any = myData.find((val: any) => val.id === Number(this.data))
    let receiverDetails: any = myData.find((val: any) => val.acctNo === Number(this.loanAcct))

    let index = myData.indexOf(myDetails)
    let rIndex = myData.indexOf(receiverDetails)
    console.log(myDetails);

    if (this.transferPasssword === myDetails.password) {
      myDetails.loan.unshift({
        type: 'myRequest',
        details: `you requested a loan ${this.loanAmt} from ${this.loanAcct}`,
        time: time,
        to: Number(this.loanAcct),
        loanAmount: this.loanAmt
      })

      receiverDetails.loan.unshift({
        type: 'loanRequest',
        details: `${myDetails.acctNo} requested a loan of ${this.loanAmt} from you`,
        time: time,
        from: myDetails.acctNo,
        loanAmount: this.loanAmt
      })

      receiverDetails.history.unshift({
        type: 'loanRequest',
        details: `${myDetails.acctNo} requested a loan of ${this.loanAmt} from you`,
        time: time,
        from: myDetails.acctNo,
        loanAmount: this.loanAmt
      })

      myDetails.history.unshift({
        details: `you requested a loan ${this.loanAmt} from ${this.loanAcct}`,
        time: time,
        type: 'myRequest',
        to: this.loanAcct,
        loanAmount: this.loanAmt
      })

      this.user_history.unshift({
        details: `you requested a loan ${this.loanAmt} from ${this.loanAcct}`,
        time: time,
        type: 'myRequest',
        to: Number(this.loanAcct),
        loanAmount: this.loanAmt
      })

      this.user_request.unshift({
        details: `you requested a loan ${this.loanAmt} from ${this.loanAcct}`,
        time: time,
        type: 'myRequest',
        to: Number(this.loanAcct),
        loanAmount: this.loanAmt
      })
      Swal.fire(
        `Loan Succesfully Requested`,
        `you have succesfully requested ${this.loanAmt} from  ${this.loanAcct}`,
        'success'
      )
      this.loanAcct = ''
      this.loanAmt = ''
      this.transferPasssword = ''
      myData[index] = myDetails
      myData[rIndex] = receiverDetails

      localStorage.setItem('myDetails', JSON.stringify(myData))
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid Password!',
        footer: '<a href="#">Why do I have this issue?</a>'
      })
      this.transferPasssword = ''
    }
  }

  acceptLoan(index: any, request: any) {
    let time = new Date()

    let dataFromLS: any = localStorage.getItem('myDetails')
    let myData = JSON.parse(dataFromLS)

    let myDetails: any = myData.find((val: any) => val.id === Number(this.data))
    let loanRcv = myData.find((val: any) => val.acctNo === request.from)

    let ind = myData.indexOf(myDetails)
    let rIndex = myData.indexOf(loanRcv)
    if (this.transferPasssword = myDetails.password) {
      if (myDetails.acctBal < Number(request.loanAmount)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Insufficient Funds, Kindly fund your Account!',
          footer: '<a href="#">Why do I have this issue?</a>'
        })
      }
      else if (myDetails.acctBal >= Number(request.loanAmount)) {
        Swal.fire({
          title: 'Are you sure?',
          text: "You wanna accept the loan!",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!'
        }).then((result) => {
          if (result.isConfirmed) {
            myDetails.acctBal = myDetails.acctBal - Number(request.loanAmount)
            loanRcv.acctBal = loanRcv.acctBal + Number(request.loanAmount)

            myDetails.history.unshift({
              details: `you accepted and transfered a loan of ${(Number(request.loanAmount))} to ${request.to}`,
              time: time,
            })

            loanRcv.history.unshift({
              details: `you loan request has been accepted and ${(Number(request.loanAmount))} has been added to your acoountBal`,
              time: time,
            })

            this.user_balance = myDetails.acctBal

            this.user_history.unshift({
              details: `you accepted and transfered a loan of ${(Number(request.loanAmount))} to ${request.to}`,
              time: time,
            })
            myDetails.loan.splice(index, 1)
            this.user_request.splice(index, 1)
            myData[ind] = myDetails
            myData[rIndex] = loanRcv

            localStorage.setItem('myDetails', JSON.stringify(myData))
            Swal.fire(
              'Done.',
              `You have succesfully accepted and Transfered d loan of ${request.loanAmount} to ${request.to}`,
              'success'
            )
          }
        })
      }

    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid Password!',
        footer: '<a href="#">Why do I have this issue?</a>'
      })
      this.transferPasssword = ''
    }
  }

  quickTransfer(user: any, i: any) {
    let a = user.acctNo
    this.transferAcct = a
    console.log(this.transferAcct);

  }

  myFunc() {
    var date = new Date();
    var h: any = date.getHours();
    var m: any = date.getMinutes();
    var s: any = date.getSeconds();
    var session = "AM"
    if (Number(h) >= 12) {
      session = "PM"
    }
    if (Number(h) < 10) {
      h = "0" + h;
    }
    if (Number(m) < 10) {
      m = "0" + m;
    }
    if (Number(s) < 10) {
      s = "0" + s;
    }
    const red: any = document.getElementById('red')
    var time = h + ' : ' + m + ' : ' + s + " " + session;
    red.innerText = time;
    setInterval(this.myFunc, 1000)
  }


  logout() {
    localStorage.removeItem('myLogin')
    this.router.navigate(['/home'])
  }

  goToProfile(url: any, userId: any, cmp: any) {
    this._test.show.next(false)
  }
  goToP(url: any, userId: any, cmp: any) {
    this._test.show.next(false)
    let a: any = document.getElementsByClassName('navbar')[0]
    if (a.style.display === 'block') {
      a.style.display = 'none'
    }
    else {
      a.style.display = 'block'
    }
  }
  goToD(url: any, userId: any, cmp: any) {
    this._test.show.next(true)
    let a: any = document.getElementsByClassName('navbar')[0]
    if (a.style.display === 'block') {
      a.style.display = 'none'
    }
    else {
      a.style.display = 'block'
    }
  }
  showPhoneDash() {
    let a: any = document.getElementsByClassName('navbar')[0]

    if (a.style.display === 'block') {
      a.style.display = 'none'
    }
    else {
      a.style.display = 'block'
    }
  }
}