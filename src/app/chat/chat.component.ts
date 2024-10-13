import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';


interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  loggedin = false
  userMessage: string = '';
  files :any
  chats:any
  isSidenavOpen: boolean = false;
  isLogin = false

  chatHistory = [
    { text: 'Please upload the file using attachment symbol and start DoChat', isUser: false },
  ];
  constructor(private http:HttpClient, private router:Router, private _snackBar: MatSnackBar){}
  ngOnInit(): void {
    console.log("hi");
    if(localStorage.getItem("user")===null){
       this.openSnackBar("please login!", "OK")
       this.router.navigate(["/home"])
    }else{
    this.getFilesForUser()
    let file_id = localStorage.getItem("file_id")
    if(file_id === null){
     file_id = this.files[0].file_id
    }
    this.get_chat_history(file_id)
    }
  }

  getFilesForUser(){
    let id = localStorage.getItem("user")
    this.http.get("https://dochat-backend.onrender.com/files/"+String(id)).subscribe(
      (data)=>{
        this.files=data
        localStorage.setItem("file_id",this.files[0].file_id)
      }
    )
  }


 get_chat_history(id:any){
  this.http.get("https://dochat-backend.onrender.com/chat_history/"+String(id)).subscribe(
    (data)=>{
      this.chats=data
      for(let chat of this.chats){
         this.chatHistory.push({isUser:true, text:chat.message})
         this.chatHistory.push({isUser:false, text:chat.response})
      }
    }
  )
 }

  response:any
  file: File | null = null;
  userQuestion: string = '';
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
    }
    this.onFileSubmit();
  }
  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen
  }

  onFileSubmit() {
    if (this.file) {
      let id = localStorage.getItem("user")
      console.log(id)

      const formData: FormData = new FormData();
      formData.append("file",this.file)
      this.http.post("https://dochat-backend.onrender.com/upload/"+id,formData).subscribe(
        data=>{ console.log(data)
        this.response = data
        localStorage.setItem("file_id", this.response.file_id)
        this.openSnackBar("file uploaded successfully", "OK")
        this.chatHistory = [
          { text: 'Please upload the file using attachment symbol and start DocChat', isUser: false },
        ];
        this.getFilesForUser()
        }
      )
      this.file = null;
    }
  }

  getFileChatHistory(id:number){
    this.chatHistory =  [
      { text: 'Please upload the file using attachment symbol and start DocChat', isUser: false },
    ];
       this.get_chat_history(id)
       localStorage.setItem("file_id",String(id))
  }

  deletefile(file_id:any){
    this.http.delete(`https://dochat-backend.onrender.com/files/${file_id}`).subscribe(
      (data)=>{
        this.getFilesForUser()
        this.openSnackBar("file deleted successfully", "OK")
        if(localStorage.getItem("file_id")==file_id){
          this.chatHistory =  [
            { text: 'Please upload the file using attachment symbol and start DocChat', isUser: false },
          ];
          this.get_chat_history(this.files[0].file_id)
          localStorage.setItem("file_id",this.files[0].file_id)
        }
      }
    )
  }

  async onSubmitQuestion(form:NgForm) {
    let id = localStorage.getItem("file_id")
    this.userQuestion = form.value.userQuestion
    let params = new HttpParams().set("question", this.userQuestion)
    setTimeout(() => form.reset(), 0);
    if (this.userQuestion.trim()) {
      this.chatHistory.push({
        isUser: true,
        text: this.userQuestion
      });

      let questionDto = {
        "question": this.userQuestion
      }
      if(id !==null){
      this.http.post(`https://dochat-backend.onrender.com/chat/${id}`, questionDto).subscribe((data)=>{
        this.response = String(data)
        this.chatHistory.push({
          isUser: false,
          text: `Answer for: ${this.response}`
        })
      })
    }else{
      this.chatHistory.push({
        isUser: false,
        text:"Answer for: Please upload the file to start the conversation"
      })
    }

    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['blue-snackbar'],
    });
  }


}

