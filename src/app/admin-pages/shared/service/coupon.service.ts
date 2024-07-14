import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOUpdateCouponRequest } from '../dto/DTOUpdateCouponRequest.dto';
import { DTOCoupon } from '../dto/DTOCoupon.dto';

@Injectable({
    providedIn: 'root'
})
export class CouponService {
    private direct = 'https://hypersapi.onrender.com';
    private urlGetListCoupon = this.direct + "/api/Coupon/GetListCoupon";
    private urlUpdateCoupon = this.direct + "/api/Coupon/UpdateCoupon";
    private urlAddCoupon = this.direct + "/api/Coupon/UpdateCoupon";
     

    constructor(private httpClient: HttpClient) { }

    getHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getListCoupon(filter: State): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(this.urlGetListCoupon, filter, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving list coupon:', error);
                    return throwError(error);
                })
            );
    }

    updateCoupon(req: DTOUpdateCouponRequest): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(this.urlUpdateCoupon, req, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error updating coupon:', error);
                    return throwError(error);
                })
            );
    }

    addCoupon(req: DTOUpdateCouponRequest): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(this.urlAddCoupon, req, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error adding coupon:', error);
                    return throwError(error);
                })
            );
    }

    getCouponByIdCoupon(id: string): Observable<DTOCoupon> {
        return this.getListCoupon({}).pipe(
            map((response: DTOResponse) => {
                const coupon = response.ObjectReturn.Data.find((item: DTOCoupon) => item.IdCoupon === id);
                if (coupon) {
                    return coupon;
                } else {
                    throw new Error('Coupon not found or inactive');
                }
            }),
            catchError(error => {
                console.error('Error retrieving coupon:', error);
                return throwError(error);
            })
        );
    }
}
