import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private httpClient: HttpClient) { }
  urlGetBillCustomer = "https://hypersapi.onrender.com/api/bill/getlistcustomerbill"

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        
      })
    };
  }

  getListCustomerBill():Observable<DTOResponse>{
    const httpOption = this.getHttpOptions()
    const body = {}
    return this.httpClient.post<DTOResponse>(this.urlGetBillCustomer, body, httpOption).pipe()
  }
}
