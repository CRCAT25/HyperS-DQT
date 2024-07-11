import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { catchError } from 'rxjs/operators';
import { DTOUpdateBrandRequest } from '../dto/DTOUpdateBrandRequest.dto';

@Injectable({
    providedIn: 'root'
})
export class BrandAdminService {
    private direct = 'https://hypersapi.onrender.com';

    private urlGetListBrand = this.direct + "/api/Brand/GetAllBrands";
    private urlUpdateBrand = this.direct + "/api/Brand/UpdateBrand";

    constructor(private httpClient: HttpClient) { }

    getHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getListBrand(): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(this.urlGetListBrand, httpOptions)
    }

    updateBrand(req: DTOUpdateBrandRequest): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(this.urlUpdateBrand, req, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error updating brand:', error);
                    return throwError(error);
                })
            );
    }
}
