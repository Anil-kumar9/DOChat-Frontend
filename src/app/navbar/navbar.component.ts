import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router, private dialog: MatDialog,private _snackBar:MatSnackBar) { }
  isLoggedIn = false
  fullName = ''
name:any
  ngOnInit(): void {
    console.log("anil", localStorage.getItem("user"))
    if(localStorage.getItem("user")!==null){
      this.isLoggedIn=true
      this.name = localStorage.getItem("name")
    }
  }
  openHome(){
    if(localStorage.getItem("user")!==null){
      this.isLoggedIn=true
      this.router.navigate(["chat"])
      this.name = localStorage.getItem("name")
    }else{
      alert("user not loggedin")
      this.router.navigate(["login"])
    }
  }

  openSignUpDialog() {
    const dialogRef = this.dialog.open(SignupComponent);

    dialogRef.afterClosed().subscribe((result) => {
      this.updateLoginStatus();
    });
  }


  openSigninDialog() {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);    });
  }

  updateLoginStatus() {
    if(localStorage.getItem("user") !== null){
      this.isLoggedIn = false
    }else{
      this.isLoggedIn = false
    }
  }

  logout() {
    // const dialogRef = this.dialog.open(WelcomeComponent);

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);    });
    localStorage.removeItem("user")
    localStorage.removeItem("name")
    localStorage.removeItem("file_id")
    this.router.navigate(["/home"])
    this.openSnackBar("logout successful!", "OK")
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }

}
