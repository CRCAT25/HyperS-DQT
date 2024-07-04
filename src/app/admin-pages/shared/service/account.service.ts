import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private direct = 'https://hypersapi.onrender.com';
    private urlGetListCustomer = this.direct + "/api/Customer/GetListCustomer";

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

}
