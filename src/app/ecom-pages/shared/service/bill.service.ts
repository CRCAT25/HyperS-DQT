import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DTOUpdateBillRequest } from 'src/app/admin-pages/shared/dto/DTOUpdateBillRequest.dto';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private httpClient: HttpClient) { }
  urlGetBillCustomer = "https://hypersapi.onrender.com/api/bill/getlistcustomerbill"
  urlUpdateBill = "https://hypersapi.onrender.com/api/bill/UpdateBill"
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

  updateStatusBill(info: DTOUpdateBillRequest):Observable<DTOResponse>{
    const httpOption = this.getHttpOptions()
    const body = info
    return this.httpClient.post<DTOResponse>(this.urlUpdateBill, body, httpOption).pipe()
  }
}
