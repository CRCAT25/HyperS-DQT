import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { catchError } from 'rxjs/operators';
import { DTOUpdateBrandRequest } from '../dto/DTOUpdateBrandRequest.dto';
import { DTOUpdateProductType } from '../dto/DTOUpdateProductType.dto';

@Injectable({
    providedIn: 'root'
})
export class ProductTypeAdminService {
    private direct = 'https://hypersapi.onrender.com';

    private urlGetListProductType = this.direct + "/api/Product/GetListProductType";
    private urlUpdateProductType = this.direct + "/api/Product/UpdateProductType";

    constructor(private httpClient: HttpClient) { }

    getHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getListProductType(): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(this.urlGetListProductType, httpOptions)
    }

    updateProductType(req: DTOUpdateProductType): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(this.urlUpdateProductType, req, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error updating product type:', error);
                    return throwError(error);
                })
            );
    }
}
