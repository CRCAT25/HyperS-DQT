import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaymentService } from '../../shared/service/payment.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NotiService } from '../../shared/service/noti.service';
import { DTOResponeAddress } from '../../shared/dto/DTOResponeAddress';
import { DTODistrict, DTOProvince, DTOWard } from '../../shared/dto/DTOProvince';
import { FormControl, FormGroup } from '@angular/forms';
import { qrCodeIcon } from '@progress/kendo-svg-icons';
import { DTOPaymentMethod } from '../../shared/dto/DTOPaymentMethod';
import { DTOProductInCart } from '../../shared/dto/DTOProductInCart';
import { Router } from '@angular/router';
import { DTOProcessToPayment } from '../../shared/dto/DTOProcessToPayment';
import { DTOGuessCartProduct } from '../../shared/dto/DTOGuessCartProduct';
import { UserService } from '../../shared/service/user.service';
import { CartService } from '../../shared/service/cart.service';
import { DTOCustomer } from 'src/app/shared/dto/DTOCustomer.dto';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {
  listProvince: DTOProvince[]
  listDistrict: DTODistrict[]
  listWard: DTOWard[]
  listProductPayment: DTOProductInCart[]
  processToPayment: DTOProcessToPayment ={
    CustomerName: "",
    OrdererPhoneNumber: "",
    PhoneNumber: "",
    ListProduct: [],
    ShippingAddress: "",
    PaymentMethod: -1,
    TotalBill: 0,
    IsGuess: true
  }
  provinceSelected: DTOProvince
  districtSelected: DTODistrict
  wardSelected: DTOWard
  paymenMethodSelected: DTOPaymentMethod
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)
  isLoadingProvince: boolean = false
  isLoadingDistrict: boolean = false
  isLoadingWard: boolean = false
  isDisableDistrict: boolean = true
  isDisableWard: boolean = true
  isDisableSpecific: boolean = true
  name:string = ""
  numberPhone: string = ""
  recipientPhone: string = ""
  road: string = ""
  specific: string = ""
  listPaymentMethodUser: DTOPaymentMethod[] = [
    {id: 0, text: "COD", icon: "fa-money-bill"},
    {id: 1, text: "QR Payment", icon: "fa-qrcode"},
    {id: 2, text: "Bank Transfer", icon: "fa-credit-card"},
  ]

  listPaymentMethodGuess: DTOPaymentMethod[] = [
    // {id: 0, text: "COD", icon: "fa-money-bill"},
    {id: 1, text: "QR Payment", icon: "fa-qrcode"},
    {id: 2, text: "Bank Transfer", icon: "fa-credit-card"},
  ]


  defaultValueProvince: DTOProvince = {province_id: "", province_name: '-- Select --',  province_type: ""}
  defaultValueWard: DTOWard = {district_id: "", ward_id: "", ward_name:"-- Select --", ward_type: ""}
  defaulValueDistrict : DTODistrict ={district_id: "", district_name: "-- Select --", district_type: "", province_id: "", lat: "", lng: ""  }
  dataProvineFilter: DTOProvince[]
  dataDistrictFilter: DTODistrict[]
  dataWardFilter: DTOWard[]
  priceSubTotal: number = 0
  priceDelivery: number = 0
  priceCoupon: number = 0
  totalPrice: number = 0
  codeCustomer: number = 0
  dataCustomer: DTOCustomer[]
  isBuyOther: boolean = false

  constructor(private cartService: CartService,private userService: UserService ,private router: Router,private paymentService: PaymentService, private notiService: NotiService){
    this.APIGetProvince();
    this.codeCustomer = userService.codeCustomer
  }

  ngOnInit(): void {
    this.GETCaheItemSelected()
    if(this.codeCustomer){
      this.APIGetUser()
    }

  }

  GETCaheItemSelected():void{
    const data = localStorage.getItem("cacheCheckout")
    try{
      if(data){
        this.listProductPayment = JSON.parse(data)
      }
    }catch{

    }finally{
      this.handleCalTotalPrice()
    }
  }

  APIGetProvince():void{
    this.isLoadingProvince = true
    this.paymentService.getProvince().pipe(takeUntil(this.destroy)).subscribe((data) => {
      try{
        if(data){
          this.listProvince = data.results
          this.dataProvineFilter = this.listProvince
        }else{
          this.notiService.Show("Error when fetching data", "error")
        }
      }catch{

      }finally{
        this.isLoadingProvince = false
      }
      
    })
  }

  APIGetDistrict(idProvince: string):void{
    this.isLoadingDistrict = true
    this.paymentService.getDistrict(idProvince).pipe(takeUntil(this.destroy)).subscribe((data) => {
      try{
        if(data){
          this.listDistrict = data.results
          this.dataDistrictFilter = this.listDistrict
        }else{
          this.notiService.Show("Error when fetching data", "error")
        }
      }catch{

      }finally{
        this.isLoadingDistrict = false
      }
      
    })
  }

  APIGetWard(idDistrict: string):void{
    this.isLoadingWard = true
    this.paymentService.getWard(idDistrict).pipe(takeUntil(this.destroy)).subscribe((data) => {
      try{
        if(data){
          this.listWard = data.results
          this.dataWardFilter = this.listWard
        }else{
          this.notiService.Show("Error when fetching data", "error")
        }
      }catch{

      }finally{
        this.isLoadingWard = false
      }
      
    })
  }

  APIPayment(info: DTOProcessToPayment):void{
    this.paymentService.payment(info).pipe(takeUntil(this.destroy)).subscribe(data => {
      console.log(data);
      try{
        if(data.StatusCode == 0){
          if(data.ObjectReturn.ErrorList){
            data.ObjectReturn.ErrorList.forEach((element: any) => {
              this.notiService.Show(element, "error")
            }); 
          return
          }
          if(this.codeCustomer == 0){
            this.listProductPayment.forEach(element => {
              this.handleDeleteItemCart(element.Product.Code, element.SizeSelected.Code)
            });
          }
          console.log(data.ObjectReturn.RedirectUrl);
          window.location.href = data.ObjectReturn.RedirectUrl
          // this.cartService.getCountInCart(this.codeCustomer)
          // this.cartService.emitCartUpdated()
          // this.notiService.Show("Payment Successfully", "success")
          // this.router.navigate(['ecom/home'])
        
        }else{
          this.notiService.Show("Error when payment", "error")
        }
      }catch{

      }finally{

      }
    })
  }

  APIGetUser():void{
    this.userService.getMyInfo().pipe(takeUntil(this.destroy)).subscribe(data => {
      if(data.StatusCode == 0 && data.ErrorString == "" && data.ObjectReturn.Data){
        this.dataCustomer = data.ObjectReturn.Data
        this.numberPhone = this.dataCustomer[0].PhoneNumber
      }else{
        this.notiService.Show("Error Check out", "error")
        this.router.navigate(["ecom/cart"])
      }
    })
  }
  
  handleCalTotalPrice():void{
    this.priceCoupon = 0
    this.priceDelivery = 0
    this.priceSubTotal = 0
    this.totalPrice = 0
    this.listProductPayment.forEach(element => {
      this.priceSubTotal += element.TotalPriceOfProduct
    });
    this.totalPrice = (this.priceSubTotal + this.priceDelivery) - this.priceCoupon
  }

  handleChangeProvince():void{
    if(this.provinceSelected){
      this.districtSelected = null
      this.wardSelected = null
      this.isDisableWard = true
      if(this.provinceSelected.province_id != ""){
        this.isDisableDistrict = false
      }else{
        this.isDisableDistrict = true
      }

      this.APIGetDistrict(this.provinceSelected.province_id)
      return
    }
  }

  handleChangeDistrict():void{
    if(this.districtSelected){  
      this.wardSelected = null
      if(this.provinceSelected.province_id != ""){
        this.isDisableWard = false
      }else{
        this.isDisableWard = true
      }
      this.isDisableWard = false
      this.APIGetWard(this.districtSelected.district_id)
      return
    }
  }

  handleChangeWard():void{
    if(this.wardSelected){
      if(this.provinceSelected.province_id != ""){
        this.isDisableSpecific = false
      }else{
        this.isDisableSpecific = true
      }
    }
  }

  handleSelectedPaymentMethod(item: DTOPaymentMethod):void{
    this.paymenMethodSelected = item
  }

  navigate(route: string) {
    this.router.navigate([route])
  }

  handleDeleteProduct(item: DTOProductInCart):void{
    const data = localStorage.getItem("cacheCheckout")
    if(data){
      const lstData = JSON.parse(data) as DTOProductInCart[];
      const index = lstData.findIndex(product => product.Product.Code == item.Product.Code && item.SizeSelected.Code == product.SizeSelected.Code)
      if(index != -1){
        lstData.splice(index, 1) 
        this.listProductPayment = lstData
        localStorage.setItem("cacheCheckout", JSON.stringify(this.listProductPayment) )
        this.handleCalTotalPrice()
        if(this.listProductPayment.length <= 0){
          this.navigate("ecom/cart")
          return
        }
      }
    }
  }

  handleDeleteItemCart(code: number, size: number){
    const productCart = localStorage.getItem('cacheCart')
    const listData = JSON.parse(productCart) as DTOGuessCartProduct[]
    const index = listData.findIndex(element => element.Code === code && element.SelectedSize === size);
    if(index != -1){
      try{
        listData.splice(index, 1);
        localStorage.setItem('cacheCart', JSON.stringify(listData))
        this.cartService.emitCartUpdated()
      }catch{
        this.notiService.Show("Xóa sản phẩm không thành công", "error")
      }
    }
    else{
      this.notiService.Show("Xóa sản phẩm không thành công", "error")
    }
    this.cartService.setTotalItemProduct(this.codeCustomer)
  }

  handlePayment():void{
    if(!this.name || !this.numberPhone || !this.provinceSelected || !this.districtSelected || !this.wardSelected || !this.specific || !this.paymenMethodSelected){
      if(this.isBuyOther){
        if(!this.recipientPhone){
          this.notiService.Show("Payment error", "error")
          return
        }
      }else{
        this.notiService.Show("Payment error", "error")
          return
      }
    }
  
    if(this.codeCustomer == 0){
      this.processToPayment.OrdererPhoneNumber = this.numberPhone
      this.processToPayment.IsGuess = true
      this.processToPayment.PhoneNumber = this.numberPhone
    }else{
      if(this.isBuyOther == true){
        this.processToPayment.OrdererPhoneNumber = this.dataCustomer[0].PhoneNumber
        this.processToPayment.PhoneNumber = this.recipientPhone
      }else{
        this.processToPayment.OrdererPhoneNumber = this.dataCustomer[0].PhoneNumber
        this.processToPayment.PhoneNumber = this.dataCustomer[0].PhoneNumber
      }
      this.processToPayment.IsGuess = false
    }
    this.processToPayment.CustomerName = this.name
    this.processToPayment.ShippingAddress = this.provinceSelected.province_name + ", " + this.districtSelected.district_name + ", " +  this.wardSelected.ward_name + ", " + this.road + ", " +this.specific
    this.processToPayment.ListProduct = this.listProductPayment
    this.processToPayment.PaymentMethod = this.paymenMethodSelected.id
    this.processToPayment.TotalBill = this.totalPrice
    this.APIPayment(this.processToPayment)
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
  }

  hanldeFilterProvine(value: any){
    this.dataProvineFilter = this.listProvince.filter((s) => s.province_name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) != -1)
  }

  
  hanldeFilterDistrict(value: any){
    this.dataDistrictFilter = this.listDistrict.filter((s) => s.district_name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) != -1)
  }

  hanldeFilterWard(value: any){
    this.dataWardFilter = this.listWard.filter((s) => s.ward_name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) != -1)
  }

  log(){
    console.log(this.isBuyOther);
  }

 
}
