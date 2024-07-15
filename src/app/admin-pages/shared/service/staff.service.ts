import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { State } from '@progress/kendo-data-query';
import { catchError } from 'rxjs/operators';
import { DTOResponeAddress } from 'src/app/ecom-pages/shared/dto/DTOResponeAddress';
import { DTOStaff } from '../dto/DTOStaff.dto';
import { DTOUpdateStaffRequest } from '../dto/DTOUpdateStaffRequest.dto';
import { DTORole } from '../dto/DTORole.dto';
@Injectable({
    providedIn: 'root'
})
export class StaffService {
    private direct = 'https://hypersapi.onrender.com';

    private urlGetCurrentStaffInfo = this.direct + "/api/Staff/GetCurrentStaffInfo";
    private urlGetListStaff = this.direct + "/api/Staff/GetListStaff";
    private urlGetProvince = "https://vapi.vnappmob.com/api/province/"
    private urlGetDistrict = "https://vapi.vnappmob.com/api/province/district/"
    private urlGetWard = "https://vapi.vnappmob.com/api/province/ward/"
    private urlUpdateStaff = this.direct + "/api/Auth/UpdateStaff";
    private urlGetListRole = this.direct + "/api/Auth/GetListRoles";

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

    getProvince(): Observable<DTOResponeAddress> {
        const httpOption = this.getHttpOptions()
        const body = {}
        return this.httpClient.get<any>(this.urlGetProvince)
    }

    getDistrict(province_id: string): Observable<any> {
        const httpOption = this.getHttpOptions()
        const body = {}
        const url = `${this.urlGetDistrict}${province_id}`
        return this.httpClient.get<any>(url)
    }

    getWard(district_id: string): Observable<any> {
        const httpOption = this.getHttpOptions()
        const body = {}
        const url = `${this.urlGetWard}${district_id}`
        return this.httpClient.get<any>(url)
    }

    // updateStaff(req: { CodeAccount: number, CodeStatus: number }): Observable<any> {
    //     const httpOptions = this.getHttpOptions();
    //     return this.httpClient.post(this.urlUpdateStaff, req, httpOptions)
    //         .pipe(
    //             catchError(error => {
    //                 console.error('Error updating customer:', error);
    //                 return throwError(error);
    //             })
    //         );
    // }

    updateStaff(req: DTOUpdateStaffRequest): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(this.urlUpdateStaff, req, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error updating product:', error);
                    return throwError(error);
                })
            );
    }

    getListRoleStaff(): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(this.urlGetListRole, {}, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving list role:', error);
                    return throwError(error);
                })
            );
    }

}
