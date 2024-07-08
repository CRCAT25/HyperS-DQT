import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { DTOGetListCartRequest } from '../dto/DTOGetListCartRequest';
import { BehaviorSubject, Observable } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOAddToCart } from '../dto/DTOAddToCart';

@Injectable({
  providedIn: 'root'
})
export class CartService {  
  urlGetListCartProduct = "https://hypersapi.onrender.com/api/Cart/GetListCartProduct"
  urlGetCountInCart = "https://hypersapi.onrender.com/api/Cart/GetCountInCart"
  urlGetListCustomerCart = "https://hypersapi.onrender.com/api/Cart/GetListCartProduct"

  cartUpdate: EventEmitter<void> = new EventEmitter<void>()
  totalItemProduct: BehaviorSubject<any> = new BehaviorSubject<any>(0)
  totalItemProduct$: Observable<any> = this.totalItemProduct.asObservable();
  totalCartOfCustomer: number = 0

  constructor(private httpClient: HttpClient) { }

  emitCartUpdated(): void {
    this.cartUpdate.emit();
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'  // Thêm tiêu đề Access-Control-Allow-Origin
      })
    }
  }
  

  setTotalItemProduct(code: number):void{
    this.getCountInCart(code).subscribe(data => {
      this.totalItemProduct.next(data.ObjectReturn.Total) 
    })
  }

  getListCartProduct(cart: DTOGetListCartRequest):Observable<DTOResponse>{
    const httpOption = this.getHttpOptions()
    const body = cart
    return this.httpClient.post<DTOResponse>(this.urlGetListCartProduct, body, httpOption).pipe()
  }

  getCountInCart(CodeCustomer: number):Observable<DTOResponse>{
    const httpOption = this.getHttpOptions()
    const body = {CodeCustomer : CodeCustomer}
    return this.httpClient.post<DTOResponse>(this.urlGetCountInCart, body, httpOption).pipe()
  }

  getListCustomerCart(code: number):Observable<DTOResponse>{
    const httpOption = this.getHttpOptions()
    const body = {CodeCustomer: code}
    return this.httpClient.post<DTOResponse>(this.urlGetListCustomerCart, body, httpOption).pipe()
  }
}
