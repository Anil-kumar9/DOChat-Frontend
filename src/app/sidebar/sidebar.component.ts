import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  @Input() files: any[] = [];
  @Output() fileDeleted = new EventEmitter<number>();
  @Output() fileSelected = new EventEmitter<number>();
  constructor(private HTTP:HttpClient) { }

  ngOnInit(): void {
  }


  deleteFile(fileId: number) {
      this.fileDeleted.emit(fileId);
        }

  selectFile(fileId: number) {
    this.fileSelected.emit(fileId);
  }
}
