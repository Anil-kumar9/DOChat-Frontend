import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
  }

  openChat(){
      if( localStorage.getItem("user") !== null){
        this.router.navigate(["/chat"])
        this.openSnackBar("Enjoy the DocChat", "OK")
      }else{
         this.openSnackBar("Please login!!", "OK")
      }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }

}
