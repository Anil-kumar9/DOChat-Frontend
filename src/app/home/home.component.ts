import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router, private _snackBar:MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openChat(){
      if( localStorage.getItem("user") !== null){
        this.router.navigate(["/chat"])
        this.openSnackBar("Enjoy the DoChat", "OK")
      }else{
         this.openSnackBar("Please login!!", "OK")
        this.openSigninDialog()
      }
  }

  openSigninDialog() {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['blue-snackbar'],
    });
  }

}
