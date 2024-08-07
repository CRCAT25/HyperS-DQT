import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOUpdateBillRequest } from '../dto/DTOUpdateBillRequest.dto';
import { DTOProcessToPayment } from 'src/app/ecom-pages/shared/dto/DTOProcessToPayment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private direct = 'https://hypersapi.onrender.com';
  private urlGetListBill = this.direct + "/api/bill/GetListBill";
  private urlGetBill = this.direct + "/api/bill/GetBill";
  private urlUpdateBill = "https://hypersapi.onrender.com/api/bill/UpdateBill"
  private urlUpdateBillStaff = "https://hypersapi.onrender.com/api/bill/UpdateBillStaff"


  constructor(private httpClient: HttpClient) { }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getListBill(filter: State): Observable<DTOResponse> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post<DTOResponse>(this.urlGetListBill, filter, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error retrieving quiz sessions:', error);
          return throwError(error);
        })
      );
  }

  getBillByCode(code: number): Observable<DTOResponse> {
    const httpOptions = this.getHttpOptions();
    const body = {
      'Code': code
    }
    return this.httpClient.post<DTOResponse>(this.urlGetBill, body, httpOptions)
      .pipe();
  }

  updateBill(req: DTOUpdateBillRequest): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post(this.urlUpdateBill, req, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error updating product:', error);
          return throwError(error);
        })
      );
  }

  updateBillStaff(req: DTOUpdateBillRequest): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post(this.urlUpdateBillStaff, req, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error updating product:', error);
          return throwError(error);
        })
      );
  }

}