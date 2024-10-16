import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userCredentials: FormGroup;
  response :any
  showPassword = "password"

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient
  ) {
    this.dialog.closeAll();
    this.userCredentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {

  }

  openSignUpDialog() {
    const dialogRef = this.dialog.open(SignupComponent);
  }

  onSubmit(){
    let loginDto = {
      "username": this.userCredentials.value.email,
      "password": this.userCredentials.value.password
    }
    this.http.post("https://dochat-backend.onrender.com/users/login", loginDto ).subscribe((data)=>{
      this.response = data,
      this.openSnackBar("Login Successful", 'OK');
      this.setLogin(this.response.id, this.response.full_name)
      this.router.navigate(['chat'])
      this.dialog.closeAll()
    },
      error => {
        this.openSnackBar("Please check your credentials", 'OK');
        }
      )
  }
  setLogin(userId: any, fullName: any) {
    localStorage.setItem("user", userId)
    localStorage.setItem("name", String(fullName))
  }

  changeType(){
    if(this.showPassword === "text" ){
      this.showPassword = "password"
    }else{
      this.showPassword="text"
      setTimeout(() => {
        this.showPassword="password"
      }, 2000);
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['blue-snackbar'],
    });
  }
}
