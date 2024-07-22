import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOCustomer } from 'src/app/shared/dto/DTOCustomer.dto';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private direct = 'https://hypersapi.onrender.com';
    private urlGetListCustomer = this.direct + "/api/Customer/GetListCustomer";
    private urlUpdateCustomer = this.direct + "/api/Customer/UpdateCustomer";
    private urlGetCustomerInfo = this.direct + "/api/Customer/GetCustomerInfo";

    constructor(private httpClient: HttpClient) { }

    getHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getListCustomer(filter: State): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(this.urlGetListCustomer, filter, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving quiz sessions:', error);
                    return throwError(error);
                })
            );
    }

    updateCustomer(req: {CodeAccount: number, CodeStatus: number}): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(this.urlUpdateCustomer, req, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error updating customer:', error);
                    return throwError(error);
                })
            );
    }

    addCustomer(req: DTOCustomer): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(this.urlUpdateCustomer, req, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error updating customer:', error);
                    return throwError(error);
                })
            );
    }

    getCustomerInfo(phoneNumber: string):Observable<DTOResponse>{
        const httpOption = this.getHttpOptions();
        const body = {PhoneNumber: phoneNumber}
        return this.httpClient.post<DTOResponse>(this.urlGetCustomerInfo, body, httpOption).pipe()
      }
}
