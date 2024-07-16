import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOGetAnalysticRequest } from '../dto/DTOGetAnalysticRequest.dto';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private direct = 'https://hypersapi.onrender.com';
  private urlGetBillAnalystic = this.direct + "/api/Bill/GetBillAnalystic";
  private urlGetAnalysticRequest = this.direct + "/api/Bill/GetMonthYearAnalystic";
  // private urlGetAnalysticRequest = this.direct + "/api/Bill/GetMonthYearAnalystic";

  constructor(private httpClient: HttpClient) { }

  getHttpOptions() {
    return {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
}

  getListTotalBill(): Observable<DTOResponse> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post<DTOResponse>(this.urlGetBillAnalystic, httpOptions)
}

  filterDashboard(req: DTOGetAnalysticRequest): Observable<any> {
  const httpOptions = this.getHttpOptions();
  return this.httpClient.post(this.urlGetAnalysticRequest, req, httpOptions)
      .pipe(
          catchError(error => {
              console.error('Error filter dashboard:', error);
              return throwError(error);
          })
      );
}
}
