import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private httpClient: HttpClient) { }

  urlGetListBanner = "https://hypersapi.onrender.com/api/banner/GetListBanner"

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        
      })
    };
  }

  getListBanner():Observable<DTOResponse>{
    const httpOption = this.getHttpOptions()
    const body = {}
    return this.httpClient.post<DTOResponse>(this.urlGetListBanner, body, httpOption).pipe()
  }
}
