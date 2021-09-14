import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MsgServiceService {

  constructor(private http: HttpClient) { }

  saveMsg(msg: string, usrname: string) {
   return this.http.post<any>(`http://localhost:3000/api/message/`, {"msg": msg, "user": usrname});
  }

  getMsg() {
    return this.http.get<any>(`http://localhost:3000/api/message/`);
  }
}
