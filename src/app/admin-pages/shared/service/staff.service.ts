import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { State } from '@progress/kendo-data-query';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StaffService {
    private direct = 'https://hypersapi.onrender.com';

    private urlGetCurrentStaffInfo = this.direct + "/api/Staff/GetCurrentStaffInfo";
    private urlGetListStaff = this.direct + "/api/Staff/GetListStaff";

    constructor(private httpClient: HttpClient) { }

    getHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getListStaff(filter: State): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(this.urlGetListStaff, filter, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving list staff:', error);
                    return throwError(error);
                })
            );
    }

    getCurrentStaffInfo(): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(this.urlGetCurrentStaffInfo, {}, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving current staff:', error);
                    return throwError(error);
                })
            );
    }

}
