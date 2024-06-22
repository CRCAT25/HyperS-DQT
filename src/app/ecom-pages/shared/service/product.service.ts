import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DTOProduct } from '../dto/DTOProduct';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { State } from '@progress/kendo-data-query';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  urlGetListProduct = "https://hypersapi.onrender.com/api/Product/GetListProduct"
  urlGetProductByID = "https://hypersapi.onrender.com/api/Product/GetProduct"
  urlGetListProductType = "https://hypersapi.onrender.com/api/Product/GetListProductType"
  urlGetListBrand = "https://hypersapi.onrender.com/api/Brand/GetAllBrands"


  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  constructor(private httpClient: HttpClient) { }
  
  // getListProduct():Observable<DTOResponse>{
  //   const httpOption = this.getHttpOptions()
  //   const body = {}
  //   return this.httpClient.post<DTOResponse>(this.urlGetListProduct, body, httpOption)
  //   .pipe(
  //   );
  // }

  getListProduct( filter: State): Observable<DTOResponse> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post<DTOResponse>(this.urlGetListProduct, filter, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error retrieving quiz sessions:', error);
          return throwError(error);
        })
      );
  }

  getProductById(id: number): Observable<DTOResponse>{
    const httpOptions = this.getHttpOptions();
    const body ={
      'Code': id
    }
    return this.httpClient.post<DTOResponse>(this.urlGetProductByID, body, httpOptions)
    .pipe();
  }

  getListProductType():Observable<DTOResponse>{
    const httpOptions = this.getHttpOptions();
    const body = {}
    return this.httpClient.post<DTOResponse>(this.urlGetListProductType, body, httpOptions)
  }

  getListBrand():any{
    const httpOptions = this.getHttpOptions();
    const body = {}
    return this.httpClient.post<DTOResponse>(this.urlGetListBrand, body, httpOptions)
  }

}
