import { Component, OnInit, Type } from '@angular/core';
import { DTOCart } from '../../shared/dto/DTOCart';

import { NotificationService } from '@progress/kendo-angular-notification';
import { CartService } from '../../shared/service/cart.service';
import { DTOGuessCartProduct } from '../../shared/dto/DTOGuessCartProduct';
import { ReplaySubject, pipe } from 'rxjs';
import { DTOGetListCartRequest } from '../../shared/dto/DTOGetListCartRequest';
import { takeUntil } from 'rxjs/operators';
import { NotiService } from '../../shared/service/noti.service';
import { DTOProductInCart } from '../../shared/dto/DTOProductInCart';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/service/product.service';
import { DTOAddToCart } from '../../shared/dto/DTOAddToCart';

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
  codeCustomer: number = 0

  addToCart: DTOAddToCart = {
    CodeCustomer: -1,
    CodeProduct: 0,
    SelectedSize: -1,
    Quantity: -1,
    Type: 'Add'
  }


  constructor(private productService: ProductService , private router: Router,private cartService: CartService, private notificationService: NotiService){
    this.codeCustomer = Number(localStorage.getItem("codeCustomer"))
    this.getDataInCache()
    
  }
  
  ngOnInit(): void {
    if(this.codeCustomer){
      this.APIGetListCustomerCart(this.codeCustomer)
    }else{
      this.APIGetListCartProduct()
    }

  }

  getDataInCache(){
    const data = localStorage.getItem('cacheCart')
    if(data){
      this.listGuessCartProduct = JSON.parse(data) as DTOGuessCartProduct[]
      this.requestGetListCart.ListGuessCartProduct = this.listGuessCartProduct
    }
  }

  APIGetListCartProduct(){
    this.isLoading = true
    this.cartService.getListCartProduct(this.requestGetListCart).pipe(takeUntil(this.destroy)).subscribe(data =>{
      if(data.ErrorString != "" || data.StatusCode != 0){
        this.notificationService.Show("😭, Erorr when fetching data", "error")
      }
      this.cart = data.ObjectReturn
      this.isLoading = false
    })
  }

  APIGetListCustomerCart(codeCustomer: number):void{
    this.isLoading = true
    this.cartService.getListCustomerCart(codeCustomer).pipe(takeUntil(this.destroy)).subscribe(data => {
      this.cart = data.ObjectReturn
      this.isLoading = false
    })
  }

  APIAddProductToCart(cart: DTOAddToCart, type: string){
    this.isLoading = true
    this.productService.addProductToCart(cart).pipe(takeUntil(this.destroy)).subscribe(data => {
      if(data.StatusCode == 0 && data.ErrorString == ''){
        if(this.codeCustomer == 0){
          if(type == "Add"){
            this.handleAddQuantityProduct(cart.CodeProduct, cart.SelectedSize)
            this.notificationService.Show("Add new product success!", "success")
          }
          this.APIGetListCartProduct()

        }else{
          if(type == "Add"){
            this.notificationService.Show("Add new product success!", "success")
          }
          else if(type == "Delete"){
            this.notificationService.Show("Delete product success!", "success")
          }
          else if(type == "Minus"){
            this.notificationService.Show("Minus product success!", "success")
          }
          this.APIGetListCustomerCart(this.codeCustomer)
        }
        this.cartService.setTotalItemProduct(this.codeCustomer)
      }else{
        this.notificationService.Show(data.ErrorString, "error")
      }
      this.isLoading = false
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
    this.cartService.emitCartUpdated()
    this.handleUnCheckItem(code)
    this.cartService.setTotalItemProduct(this.codeCustomer)
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
          this.notificationService.Show("Xóa sản phẩm thành công", "success")
          this.getDataInCache()
        }
        else {
          return
        }
      }
      item.Quantity -= 1
      localStorage.setItem('cacheCart', JSON.stringify(listData))
      this.getDataInCache()
    }

    this.cartService.emitCartUpdated()
    this.cartService.setTotalItemProduct(this.codeCustomer)
    this.handleUnCheckItem(code)
    this.APIGetListCartProduct()

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
        this.cartService.emitCartUpdated()
        this.APIGetListCartProduct()
      }catch{
        this.notificationService.Show("Xóa sản phẩm không thành công", "error")
      }
    }
    else{
      this.notificationService.Show("Xóa sản phẩm không thành công", "error")
    }
    this.cartService.setTotalItemProduct(this.codeCustomer)
  }

  handleClickFunction(item:DTOProductInCart, type: string):void{
    this.addToCart.CodeProduct = item.Product.Code
    this.addToCart.Quantity = item.Quantity
    this.addToCart.SelectedSize = item.SizeSelected.Code
    this.addToCart.Type = type
    if(this.codeCustomer){
      this.addToCart.CodeCustomer = this.codeCustomer
      if(type == "Add"){
        this.addToCart.Quantity = 1
      }else if(type == "Update"){
        if(this.addToCart.Quantity == 1){
     
          var answer = window.confirm("Bạn có muốn xóa sản phẩm này không?");
          if (answer) {
            this.addToCart.Type = "Delete"
          }
          else {
            return
          }
        }else{
          this.addToCart.Quantity = this.addToCart.Quantity - 1
        }
      }else if(type == "Delete"){
        
      }
      this.APIAddProductToCart(this.addToCart, this.addToCart.Type)
    }else{
      if(type == "Add"){
        this.APIAddProductToCart(this.addToCart, this.addToCart.Type)
      }
      else if(type == "Delete"){
        this.handleDeleteItem(item.Product.Code, item.SizeSelected.Code)
      }
      else if(type == "Update"){
        console.log('hear');
        this.handleMinusQuantityProduct(item.Product.Code, item.SizeSelected.Code);
      }
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
