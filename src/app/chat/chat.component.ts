import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  loggedin = false
  userMessage: string = '';
  files :any
  chats:any

  chatHistory = [
    { text: 'Please upload the file using attachment symbol and start DocChat', isUser: false },
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
    this.http.get("http://localhost:8000/files/"+String(id)).subscribe(
      (data)=>{
        this.files=data
        localStorage.setItem("file_id",this.files[0].file_id)
      }
    )
  }


 get_chat_history(id:any){
  this.http.get("http://localhost:8000/chat_history/"+String(id)).subscribe(
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

  // Function to handle file upload (mock)
  onFileSubmit() {
    if (this.file) {
      let id = localStorage.getItem("user")
      console.log(id)

      const formData: FormData = new FormData();
      formData.append("file",this.file)
      this.http.post("http://localhost:8000/upload/"+id,formData).subscribe(
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
    this.http.delete(`http://localhost:8000/files/${file_id}`).subscribe(
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
    console.log(this.userQuestion)
    this.userQuestion = form.value.userQuestion
    let params = new HttpParams().set("question", this.userQuestion)
    setTimeout(() => form.reset(), 0);
    console.log(this.userQuestion, form.value.userQuestion)
    if (this.userQuestion.trim()) {
      this.chatHistory.push({
        isUser: true,
        text: this.userQuestion
      });

      let questionDto = {
        "question": this.userQuestion
      }

      this.http.post(`http://localhost:8000/chat/${id}`, questionDto).subscribe((data)=>{
        this.response = String(data)
        this.chatHistory.push({
          isUser: false,
          text: `Answer for: ${this.response}`
        })
      })

    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }


}

