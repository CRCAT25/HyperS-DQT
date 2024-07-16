import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DTOProduct } from '../dto/DTOProduct';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { State } from '@progress/kendo-data-query';
import { catchError, map } from 'rxjs/operators';
import { DTOUpdateProductRequest } from 'src/app/shared/dto/DTOUpdateProductRequest.dto';
import { DTOAddToCart } from '../dto/DTOAddToCart';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  urlGetListProduct = "https://hypersapi.onrender.com/api/Product/GetListProduct"
  urlGetProductByCode = "https://hypersapi.onrender.com/api/Product/GetProduct"
  urlGetListProductType = "https://hypersapi.onrender.com/api/Product/GetListProductType"
  urlGetListBrand = "https://hypersapi.onrender.com/api/Brand/GetAllBrands"
  urlUpdateProduct = "https://hypersapi.onrender.com/api/Product/UpdateProduct"
  urlAddProductToCart = "https://hypersapi.onrender.com/api/Product/AddProductToCart"
  urlGetProductByID = "https://hypersapi.onrender.com/api/Product/GetProductByID"


  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  constructor(private httpClient: HttpClient) { }

  getListProduct(filter: State): Observable<DTOResponse> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post<DTOResponse>(this.urlGetListProduct, filter, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(error);
        })
      );
  }

  getProductById(id: number): Observable<DTOResponse> {
    const httpOptions = this.getHttpOptions();
    const body = {
      'Code': id
    }
    return this.httpClient.post<DTOResponse>(this.urlGetProductByCode, body, httpOptions)
      .pipe();
  }

  getListProductType(): Observable<DTOResponse> {
    const httpOptions = this.getHttpOptions();
    const body = {}
    return this.httpClient.post<DTOResponse>(this.urlGetListProductType, body, httpOptions)
  }

  getListBrand(): Observable<DTOResponse> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post<DTOResponse>(this.urlGetListBrand, httpOptions)
  }

  updateProduct(req: DTOUpdateProductRequest): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post(this.urlUpdateProduct, req, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error updating product:', error);
          return throwError(error);
        })
      );
  }

  addProductToCart(cart: DTOAddToCart):Observable<DTOResponse>{
    const httpOption = this.getHttpOptions()
    const body = cart
    return this.httpClient.post<DTOResponse>(this.urlAddProductToCart, body, httpOption).pipe()
  }

  getProductByIDProduct(id: string):Observable<DTOResponse>{
    const httpOption = this.getHttpOptions();
    const body = {id: id}
    return this.httpClient.post<DTOResponse>(this.urlGetProductByID, body, httpOption).pipe()
  }
}
