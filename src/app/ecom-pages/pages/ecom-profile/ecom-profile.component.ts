import { Component, OnInit } from '@angular/core';
import { DTOStaTusByCode } from '../../shared/dto/DTOStatusByCode';
import { UserService } from '../../shared/service/user.service';
import { DTOProfile } from '../../shared/dto/DTOProfile';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DTOCustomer } from 'src/app/shared/dto/DTOCustomer.dto';
import { BillService } from '../../shared/service/bill.service';
import { DTOBill } from 'src/app/admin-pages/shared/dto/DTOBill.dto';
import { NotiService } from '../../shared/service/noti.service';
import { DrawerMode, DrawerPosition } from '@progress/kendo-angular-layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ecom-profile',
  templateUrl: './ecom-profile.component.html',
  styleUrls: ['./ecom-profile.component.scss']
})
export class EcomProfileComponent implements OnInit {
  profile: DTOCustomer
  listBill: DTOBill[]
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)
  avatarDefault: string = "data:image/png;base64,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"
  expandMode: DrawerMode = "overlay"
  positionDrawer: DrawerPosition = "end"
  expanded: boolean = false
  billSelected: DTOBill
  isLoading: boolean = true
  

  constructor(
    private userService: UserService, 
    private billService: BillService,
    private notiService: NotiService,
    private router: Router
  ){
    this.APIGetProfile()
    this.APIGetListBillCustomer()
  }

  ngOnInit(): void {
  }

  APIGetListBillCustomer(){
    this.isLoading = true
    this.billService.getListCustomerBill().pipe(takeUntil(this.destroy)).subscribe(data => {
      try{
        if(data.StatusCode == 0 && data.ErrorString == ""){
          this.listBill = data.ObjectReturn.Data
        }
      }catch{
        this.notiService.Show("Erro when fetching Bill", "error")
      }
      finally{
        this.isLoading = false
      }
    })
  }

  APIGetProfile():void{
    this.isLoading = true
    this.userService.getMyInfo().pipe(takeUntil(this.destroy)).subscribe(data => {
      try{
        if(data.StatusCode == 0 && data.ErrorString == ""){
          this.profile = data.ObjectReturn.Data[0]
        }
      }catch{
        this.notiService.Show("Erro when fetching Profile", "error")
      }
      finally{
        this.isLoading = false
      }
    })
  }

  handleGetStatusByCode(Code: number): DTOStaTusByCode{
    let result: DTOStaTusByCode
    switch(Code){
      // case 2: 
      //   return {Code: Code ,Text: "Waiting for confirmation", Icon: "fa-hourglass-start", Color: ""}
      // case 3:
      //   return {Code: Code ,Text: "Being packed", Icon: "fa-box", Color: ""}
      // case 4:
      //   return {Code: Code ,Text: "Order canceled", Icon: "fa-xmark", Color: ""}
      // case 5:
      //   return {Code: Code ,Text: "In transit", Icon: "fa-truck", Color: ""}
      // case 6:
      //   return {Code: Code ,Text: "Delivery successful", Icon: "fa-truck-ramp-box", Color: ""}
      // case 7:
      //   return {Code: Code ,Text: "Delivery failed", Icon: "fa-ban", Color: ""}
      // case 8:
      //   return {Code: Code ,Text: "Returning", Icon: "fa-reply", Color: ""}
      // case 9:
      //   return {Code: Code ,Text: "Goods received", Icon: "fa-clipboard-check", Color: ""}
      // case 10:
      //   return {Code: Code ,Text: "Money refunded", Icon: "fa-money-bill-transfer", Color: ""}
      // case 11:
      //   return {Code: Code ,Text: "Non-refundable", Icon: "fa-money-bill-wheat", Color: ""}
      // case 12:
      //   return {Code: Code ,Text: "Requests a return/exchange", Icon: "fa-code-pull-request", Color: ""}
      // case 13:
      //   return {Code: Code ,Text: "Exchange confirmation", Icon: "fa-check-double", Color: ""}
      // case 14:
      //   return {Code: Code ,Text: "Exchange completed", Icon: "fa-check", Color: ""}
      case 1:
        return {Code: Code ,Text: "Waiting for confirmation", Icon: "fa-hourglass-start", Color: ""}
      case 2:
        return {Code: Code ,Text: "Order canceled", Icon: "fa-xmark", Color: ""}
      case 3:
        return {Code: Code ,Text: "Not confirmed", Icon: "fa-ban", Color: ""}
      case 4:
        return {Code: Code ,Text: "Confirmed", Icon: "fa-check", Color: ""}
      case 5:
        return {Code: Code ,Text: "Being packaged", Icon: "fa-box-open", Color: ""}
      case 6:
        return {Code: Code ,Text: "Packaged", Icon: "fa-box", Color: ""}
      case 7:
        return {Code: Code ,Text: "In transit", Icon: "fa-truck", Color: ""}
      case 8 :
        return {Code: Code ,Text: "Delivery successful", Icon: "fa-truck-ramp-box", Color: ""}
      case 9:
        return {Code: Code ,Text: "Delivery failed", Icon: "fa-ban", Color: ""}
      case 10:
        return {Code: Code ,Text: "Returning", Icon: "fa-reply", Color: ""}
      case 11: 
        return {Code: Code ,Text: "Accept return", Icon: "fa-dolly", Color: ""}
      case 12:
        return {Code: Code ,Text: "Money refunded", Icon: "fa-money-bill-transfer", Color: ""}
      case 13:
        return {Code: Code ,Text: "Non-refundable", Icon: "fa-money-bill-wheat", Color: ""}
      case 14:
        return {Code: Code ,Text: "Requests a return/exchange", Icon: "fa-code-pull-request", Color: ""}
      case 15:
        return {Code: Code ,Text: "Exchange confirmation", Icon: "fa-check-double", Color: ""}
      case 16:
        return {Code: Code ,Text: "Exchange completed", Icon: "fa-check", Color: ""}
      case 17:
        return {Code: Code ,Text: "Watting payment", Icon: "fa-stopwatch", Color: ""}
      }
      
      return result
  }

  hanldeGetTextPaymentMethod(code: any): any{
    switch (code){
      case 0:
        return "COD"
      case 1:
        return "QR Payment"
      case 2: 
        return "Bank Transfer"
    }
  }

  formatDateTime(dateTimeStr: any) {
    const date = new Date(dateTimeStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getBill(code:number){
    this.expanded = true
    const data = this.listBill.find(item => item.Code == code)
    if(data){
      this.billSelected = data
    }
  }

  logout():void{
    localStorage.removeItem("token")
    localStorage.removeItem("codeCustomer")
    this.router.navigate(["ecom/home"])
  }

}
