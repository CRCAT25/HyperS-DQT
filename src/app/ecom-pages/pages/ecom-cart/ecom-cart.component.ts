import { Component, OnInit } from '@angular/core';
import { DTOCart } from '../../shared/dto/DTOCart';

import { NotificationService } from '@progress/kendo-angular-notification';
import { CartService } from '../../shared/service/cart.service';
import { DTOGuessCartProduct } from '../../shared/dto/DTOGuessCartProduct';
import { ReplaySubject } from 'rxjs';
import { DTOGetListCartRequest } from '../../shared/dto/DTOGetListCartRequest';
import { takeUntil } from 'rxjs/operators';
import { NotiService } from '../../shared/service/noti.service';
import { DTOProductInCart } from '../../shared/dto/DTOProductInCart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ecom-cart',
  templateUrl: './ecom-cart.component.html',
  styleUrls: ['./ecom-cart.component.scss']
})
export class EcomCartComponent implements OnInit{
  cart: DTOCart 
  listGuessCartProduct: DTOGuessCartProduct[] = []
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)
  requestGetListCart: DTOGetListCartRequest = {CodeCustomer: null, ListGuessCartProduct: []}
  listItemSelected: DTOProductInCart[] = []
  subTotalItem: number = 0
  totalPrice: number = 0
  totalItem: number = 0
  isLoading: boolean = false


  constructor(private router: Router,private cartService: CartService, private notificationService: NotiService){
    this.getDataInCache()

  }
  
  ngOnInit(): void {
    this.APIGetListCartProduct()
  }

  getDataInCache(){
    const data = localStorage.getItem('cacheCart')
    if(data){
      this.listGuessCartProduct = JSON.parse(data) as DTOGuessCartProduct[]
      this.requestGetListCart.ListGuessCartProduct = this.listGuessCartProduct
    }
  }

  APIGetListCartProduct(){
    this.cartService.getListCartProduct(this.requestGetListCart).pipe(takeUntil(this.destroy)).subscribe(data =>{
      if(data.ErrorString != "" || data.StatusCode != 0){

        this.notificationService.Show("😭, Erorr when fetching data", "error")
      }
      console.log(data);
      this.cart = data.ObjectReturn
    })
  }

  handleAddQuantityProduct(code: number, size: number){
    const productCart = localStorage.getItem('cacheCart')
    const listData = JSON.parse(productCart) as DTOGuessCartProduct[]
    let item = listData.find(element => element.Code == code && element.SelectedSize == size)
    if(item){
      if(item.Quantity >= 10){
        this.notificationService.Show("This maximun you can pick 🥳", "success")
        return
      }
      item.Quantity += 1
      localStorage.setItem('cacheCart', JSON.stringify(listData))
      this.getDataInCache()
      this.APIGetListCartProduct()
    }
    this.handleUnCheckItem(code)
  }

  handleMinusQuantityProduct(code: number, size: number){
    const productCart = localStorage.getItem('cacheCart')
    const listData = JSON.parse(productCart) as DTOGuessCartProduct[]
    let item = listData.find(element => element.Code == code && element.SelectedSize == size )
    if(item){
      if(item.Quantity == 1){
        var answer = window.confirm("Bạn có muốn xóa sản phẩm này không?");
        if (answer) {
          const index = listData.findIndex(element => element.Code === code && element.SelectedSize === size);
          listData.splice(index, 1);
          this.notificationService.Show("Xóa sản phẩm thành công", "error")
          this.getDataInCache()
          this.APIGetListCartProduct()
        }
        else {
          return
        }
      }
      item.Quantity -= 1
      localStorage.setItem('cacheCart', JSON.stringify(listData))
      this.getDataInCache()
      this.APIGetListCartProduct()
    }
    this.handleUnCheckItem(code)
  }



  handleDeleteItem(code: number, size: number){
    const productCart = localStorage.getItem('cacheCart')
    const listData = JSON.parse(productCart) as DTOGuessCartProduct[]
    const index = listData.findIndex(element => element.Code === code && element.SelectedSize === size);
    if(index != -1){
      try{
        listData.splice(index, 1);
        this.notificationService.Show("Xóa sản phẩm thành công", "success")
        localStorage.setItem('cacheCart', JSON.stringify(listData))
        this.getDataInCache()
        this.APIGetListCartProduct()
      }catch{
        this.notificationService.Show("Xóa sản phẩm không thành công", "error")
      }
    }
    else{
      this.notificationService.Show("Xóa sản phẩm không thành công", "error")
    }
  }

  handleUnCheckItem(codeGet: number){
    this.listItemSelected = []
    this.handleCalPrice()
  }

  handleCheckItem(itemGet: DTOProductInCart){
    const index = this.listItemSelected.findIndex(item =>item.Product.Code == itemGet.Product.Code && item.SizeSelected.Code == itemGet.SizeSelected.Code)
    if(index != -1){
      this.listItemSelected.splice(index, 1)
    }else{
      this.listItemSelected.push(itemGet)
    }
    this.handleCalPrice()
  }

  handleCheckout():void{
    localStorage.setItem('cacheCheckout', JSON.stringify(this.listItemSelected) )
    this.navigate("ecom/payment")
  }

  navigate(route: string) {
    if(this.listItemSelected.length > 0){
      this.router.navigate([route])
    }else{
      this.notificationService.Show("Vui lòng chọn hàng muốn thanh toán!", "warning")
    }

  }

  handleCalPrice(){
    let subtotal:number = 0
    let totalItem: number = 0
    this.listItemSelected.forEach(element => {
      subtotal += element.TotalPriceOfProduct
      totalItem += element.Quantity
    });
    this.subTotalItem = subtotal
    this.totalPrice = subtotal
    this.totalItem = totalItem
  }
}
