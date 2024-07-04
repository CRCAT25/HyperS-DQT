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
  specific: string = ""

  listPaymentMethod: DTOPaymentMethod[] = [
    {id: 0, text: "COD", icon: "fa-money-bill"},
    {id: 1, text: "QR Payment", icon: "fa-qrcode"},
    {id: 2, text: "Bank Transfer", icon: "fa-credit-card"},
  ]
  
  defaultValueProvince: DTOProvince = {province_id: "", province_name: '-- Select --',  province_type: ""}
  defaultValueWard: DTOWard = {district_id: "", ward_id: "", ward_name:"-- Select --", ward_type: ""}
  defaulValueDistrict : DTODistrict ={district_id: "", district_name: "-- Select --", district_type: "", province_id: "", lat: "", lng: ""  }

  priceSubTotal: number = 0
  priceDelivery: number = 0
  priceCoupon: number = 0
  totalPrice: number = 0


  constructor(private router: Router,private paymentService: PaymentService, private notiService: NotiService){
    this.APIGetProvince();
  }

  ngOnInit(): void {
    this.GETCaheItemSelected()
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
    console.log(this.processToPayment.ListProduct);
    this.paymentService.payment(info).pipe(takeUntil(this.destroy)).subscribe(data => {
      try{
        if(data.StatusCode == 0 && data.ErrorString == ""){
          if(data.ObjectReturn.ErrorList){
            data.ObjectReturn.ErrorList.forEach((element: any) => {
              this.notiService.Show(element, "error")
            }); 
          return
          }
          this.notiService.Show("Payment Successfully", "success")
        }else{
          this.notiService.Show("Error when payment", "error")
        }
      }catch{

      }finally{

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

  handlePayment():void{
    if(!this.name || !this.numberPhone || !this.provinceSelected || !this.districtSelected || !this.wardSelected || !this.specific || !this.paymenMethodSelected){
      this.notiService.Show("Payment error", "error")
      return
    }
    this.processToPayment.CustomerName = this.name
    this.processToPayment.PhoneNumber = this.numberPhone
    this.processToPayment.ShippingAddress = this.provinceSelected.province_name + ", " + this.districtSelected.district_name + ", " +  this.wardSelected.ward_name + ", " +  this.specific
    this.processToPayment.ListProduct = this.listProductPayment
    this.processToPayment.PaymentMethod = this.paymenMethodSelected.id
    this.processToPayment.TotalBill = this.totalPrice

    this.APIPayment(this.processToPayment)
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
  }

  log(){
    console.log(this.listProductPayment);
  }

 
}
