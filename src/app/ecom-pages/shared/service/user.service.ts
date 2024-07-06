import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  codeCustomer: number

  urlGetProfile = "https://hypersapi.onrender.com/api/customer/GetMyInfo"

  constructor(private httpClient: HttpClient) { 
    this.getCodeUser()
  }

  getHttpOptions(){
    return{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        
      })
    }
  }

  getCodeUser():void{
    this.codeCustomer = Number(localStorage.getItem("codeCustomer"))
  }

  getMyInfo():Observable<DTOResponse>{
    const httpOption = this.getHttpOptions()
    // const body = {}
    return this.httpClient.post<DTOResponse>(this.urlGetProfile, {}, httpOption).pipe()
  }
}
