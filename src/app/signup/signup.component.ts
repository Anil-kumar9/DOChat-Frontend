import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  userDetails: FormGroup;
  userCredentials: FormGroup;

  checked: boolean = false;
  passwordTyped: string;
  response: any

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router
  ) {
    this.dialog.closeAll();
    this.passwordTyped = '';
    this.userDetails = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
          ),
        ],

      ],
      confirmPassword: ['', [Validators.required]],
    });

    this.userCredentials = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      checked: [false, [Validators.requiredTrue]],
    });
  }

  ngOnInit(): void {
  }

  submitDetails() {
    // Handle signup logic here
    const user = {
      username: this.userDetails.value.email,
      password: this.userDetails.value.password,
      full_name: this.userDetails.value.fullName,
    }
    console.log(user)
    this.http.post("https://dochat-backend.onrender.com/save", user).subscribe((data)=>{
      this.response = data,
      this.setLogin(this.response.id, this.response.full_name)
      this.openSnackBar('Register Successful!!!', 'OK');
      this.router.navigate(['chat'])
      this.dialog.closeAll()
    },
      error => {
        this.openSnackBar(String(error), 'OK');
      }
      )
  }
  setLogin(id:any, name:any){
    localStorage.setItem("user", String(id))
    localStorage.setItem("name", name)
  }

  onChange(): void {
    this.passwordTyped = this.userDetails.value.password;
  }

  openSigninDialog() {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }

}
