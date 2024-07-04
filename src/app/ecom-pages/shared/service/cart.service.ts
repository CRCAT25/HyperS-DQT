import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { DTOGetListCartRequest } from '../dto/DTOGetListCartRequest';
import { Observable } from 'rxjs';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOAddToCart } from '../dto/DTOAddToCart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  urlGetListCartProduct = "https://hypersapi.onrender.com/api/Cart/GetListCartProduct"

  cartUpdate: EventEmitter<void> = new EventEmitter<void>()

  constructor(private httpClient: HttpClient) { }

  emitCartUpdated(): void {
    this.cartUpdate.emit();
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }



  getListCartProduct(cart: DTOGetListCartRequest):Observable<DTOResponse>{
    const httpOption = this.getHttpOptions()
    const body = cart
    return this.httpClient.post<DTOResponse>(this.urlGetListCartProduct, body, httpOption).pipe()
  }

}
