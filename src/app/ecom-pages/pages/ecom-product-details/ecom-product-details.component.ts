import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/service/product.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DTOProduct } from '../../shared/dto/DTOProduct';
import { DTOSize } from '../../shared/dto/DTOSize';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NotiService } from '../../shared/service/noti.service';
import { DTOGuessCartProduct } from '../../shared/dto/DTOGuessCartProduct';
import { CartService } from '../../shared/service/cart.service';
import { DTOAddToCart } from '../../shared/dto/DTOAddToCart';

@Component({
  selector: 'app-ecom-product-details',
  templateUrl: './ecom-product-details.component.html',
  styleUrls: ['./ecom-product-details.component.scss']
})
export class EcomProductDetailsComponent implements OnInit {
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)
  product: DTOProduct
  idProduct: number = 0
  imageShowSelected: string = "https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
  ListSizeOfProduct: DTOSize[] = []
  sizeSelected: number = -1
  dataProductSend: DTOGuessCartProduct = {Code: 0, SelectedSize: 0, Quantity: 0}
  isLoading: boolean = false

  codeCustomer: number

  addToCart: DTOAddToCart = {
    CodeCustomer: -1,
    CodeProduct: this.idProduct,
    SelectedSize: -1,
    Quantity: -1,
    Type: 'Add'
  }

  constructor(
      private cartService: CartService,
      private productService: ProductService, 
      private notificationService: NotiService,  
    )
    {
    try{
      this.isLoading = true
      this.codeCustomer = Number(localStorage.getItem('codeCustomer'))
      const productData = localStorage.getItem('productSelected');
      if (productData) {
        const data = JSON.parse(productData) as DTOProduct;
        if (data && data.Code) {
          this.idProduct = Number(data.Code);
        }
      }
    }catch{

    }finally{
      this.isLoading = false
    }
    this.APIGetProductByID(this.idProduct)


  }

  ngOnInit(): void {

  }

  APIGetProductByID(id: number){
    this.isLoading = true
    this.productService.getProductById(id).pipe(takeUntil(this.destroy)).subscribe(data => {
      try{
        if(data.ErrorString != "" || data.StatusCode != 0){
          alert("Lỗi khi lấy api")
          return
        }
        this.product = data.ObjectReturn.Data[0]
        this.imageShowSelected = this.product.ListOfImage[0].ImgUrl
        this.ListSizeOfProduct = this.product.ListOfSize
        this.ListSizeOfProduct.sort((a, b) => a.Size - b.Size);
      }catch{

      }finally{
        this.isLoading = false
      }
     

    })
  }

  APIAddProductToCart(cart: DTOAddToCart){
    this.isLoading = true
    this.productService.addProductToCart(cart).pipe(takeUntil(this.destroy)).subscribe(data => {
      try{
        if(data.StatusCode == 0 && data.ErrorString == ""){
          if(this.codeCustomer){
            this.cartService.setTotalItemProduct(this.codeCustomer)
          }else{
            this.cartService.emitCartUpdated()
          }
          this.notificationService.Show("Yay 🥰, check your bag", "success")
        }else{
          this.notificationService.Show("Error when add your bag!", "eror")
        }
      }catch{

      }finally{
        this.isLoading = false
      }
     
    })
  }

  handleChangeImageShow(url: string){
    this.imageShowSelected = url
  }

  handleSelectedSize(code:number){
    this.sizeSelected = code
    this.dataProductSend.SelectedSize = code
  }

  handleAddToBag(){
    try{
      if(this.sizeSelected == -1){
        this.notificationService.Show("Please choose the shoe size", "warning")
        return
      }
      this.addToCart.CodeProduct = this.idProduct
      this.addToCart.SelectedSize = this.sizeSelected
      this.addToCart.Quantity = 1
      if(this.codeCustomer){
        this.addToCart.CodeCustomer = this.codeCustomer
        this.addToCart.Type = "Add"
      }else{

        const productCart = localStorage.getItem('cacheCart')
        if(productCart){
          const listData = JSON.parse(productCart) as DTOGuessCartProduct[]
          let item = listData.find(element => element.Code == this.product.Code && element.SelectedSize == this.sizeSelected)
          if(item){
            item.Quantity += 1
            localStorage.setItem('cacheCart', JSON.stringify(listData))
          }else{
            this.dataProductSend.Code = this.product.Code
            this.dataProductSend.Quantity = 1
            listData.push(this.dataProductSend)
            localStorage.setItem('cacheCart', JSON.stringify(listData))
          }
         
        }
        else{
          this.dataProductSend.Code = 125
          this.dataProductSend.Quantity = 1
          this.dataProductSend.SelectedSize = 5
          localStorage.setItem('cacheCart', JSON.stringify([this.dataProductSend]))
        }
      }
      this.APIAddProductToCart(this.addToCart)
    }catch{
      this.notificationService.Show("😭, not success", "erorr")
    }
  }

  log(){
    console.log(this.product.Code);
  }
}
