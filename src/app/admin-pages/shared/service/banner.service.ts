import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOUpdateBannerRequest } from '../dto/DTOUpdateBannerRequest.dto';

@Injectable({
    providedIn: 'root'
})
export class BannerService {
    private direct = 'https://hypersapi.onrender.com';
    private urlGetListBanner = this.direct + "/api/Banner/GetListBanner";
    private urlUpdateBanner = this.direct + "/api/Banner/UpdateBanner";
    private urlAddBanner = this.direct + "/api/Banner/UpdateBanner";
     

    constructor(private httpClient: HttpClient) { }

    getHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getListBanner(filter: State): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(this.urlGetListBanner, filter, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving list banner:', error);
                    return throwError(error);
                })
            );
    }

    updateBanner(req: DTOUpdateBannerRequest): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(this.urlUpdateBanner, req, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error updating banner:', error);
                    return throwError(error);
                })
            );
    }

    addBanner(req: DTOUpdateBannerRequest): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(this.urlAddBanner, req, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error adding banner:', error);
                    return throwError(error);
                })
            );
    }
}
