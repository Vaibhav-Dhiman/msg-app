import { Component, OnInit } from '@angular/core';
import { MsgServiceService } from './msg-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private service: MsgServiceService) {}
  message = '';
  userName = '';
  msgs:any[] = [];

  ngOnInit() {
    this.service.getMsg().subscribe(msg => {
      if(msg) {
        this.msgs = msg;
      }
    });
  }

  post() {
    if(this.message) {
      this.service.saveMsg(this.message, this.userName).subscribe(data => {
        if(data) {
          this.service.getMsg().subscribe(msg => {
            if(msg) {
              this.msgs = msg;
            }
          });
        };
    });
    }
  }
}
