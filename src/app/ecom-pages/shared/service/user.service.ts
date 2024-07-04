import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  codeCustomer: number

  constructor() { 
    this.getCodeUser()
  }

  getCodeUser():void{
    this.codeCustomer = Number(localStorage.getItem("codeCustomer"))
  }
}
