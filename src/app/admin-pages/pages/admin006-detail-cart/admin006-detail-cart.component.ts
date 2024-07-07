import { DTOStatus, listStatus, listStatusNoView } from '../../shared/dto/DTOStatus.dto';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DTOBillInfo } from '../../shared/dto/DTOBillInfo.dto';
import { DTOBill } from '../../shared/dto/DTOBill.dto';
import { DTOUpdateBillInfoRequest } from '../../shared/dto/DTOUpdateBillInfo.dto';
import { DTOUpdateBillRequest } from '../../shared/dto/DTOUpdateBillRequest.dto';
import { BillService } from '../../shared/service/bill.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { PaymentService } from 'src/app/ecom-pages/shared/service/payment.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { DTODistrict, DTOProvince, DTOWard } from 'src/app/ecom-pages/shared/dto/DTOProvince';
import { DTOUpdateBill } from '../../shared/dto/DTOUpdateBill.dto';


interface PaymentMethod {
  Code: number;
  Method: string;
}
@Component({
  selector: 'app-admin006-detail-cart',
  templateUrl: './admin006-detail-cart.component.html',
  styleUrls: ['./admin006-detail-cart.component.scss']
})
export class Admin006DetailCartComponent implements OnInit, OnDestroy {
  @Output() datePicked = new EventEmitter();
  @Input() listData: DTOBillInfo[];
  @Input() itemData: DTOBill;
  @Input() isAdd: boolean;

  listBillInfo: DTOBillInfo[];
  itemBill: DTOBill;
  itemBillInfo: DTOBillInfo;
  listStatus: DTOStatus[] = listStatusNoView;
  isClickButton: { [key: number]: boolean } = {};
  tempID: number;
  listNextStatus: DTOStatus[];
  objItemStatus: any;
  isShowAlert: boolean = false;
  reasonFail: string;
  isEdit: boolean = false;
  specialAddress: string;
  PaymentMethodDropDown: PaymentMethod[] = [
    {
      Code: 0,
      Method: "Ship COD"
    },
    {
      Code: 1,
      Method: "Momo"
    }
  ];

  listProvince: DTOProvince[]
  listDistrict: DTODistrict[]
  listWard: DTOWard[]
  
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  isLoadingProvince: boolean = false
  isLoadingDistrict: boolean = false
  isLoadingWard: boolean = false


  isDisableDistrict: boolean = true
  isDisableWard: boolean = true
  isDisableSpecific: boolean = true

  provinceSelected: DTOProvince
  districtSelected: DTODistrict
  wardSelected: DTOWard

  provinceBiding: string;
  districtBiding: string;
  wardBiding: string;
  isDisabled: boolean = true;

  oldProvinceBiding: string;
  oldDistrictBiding: string;
  oldWardBiding: string;
  oldSpecificBiding: string;

  defaultValueProvince: DTOProvince = {province_id: "", province_name: 'Chọn tỉnh, thành phố',  province_type: ""}
  defaultValueWard: DTOWard = {district_id: "", ward_id: "", ward_name:"Chọn huận, huyện", ward_type: ""}
  defaulValueDistrict : DTODistrict ={district_id: "", district_name: "Chọn thị xã, trấn", district_type: "", province_id: "", lat: "", lng: ""  }


  ngOnInit(): void {
    this.getListBillInfo();
    this.APIGetProvince();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }


  constructor(private billService: BillService,
    private notiService: NotiService,
    private paymentService: PaymentService){}




  getListBillInfo(){
    this.listBillInfo = this.listData;
    this.itemBill = this.itemData;
    this.specialAddress = this.getSpecialAddress(this.itemBill.ShippingAddress);
  }

  getSpecialAddress(address: string): string {
    this.wardBiding = address.split(',')[2];
    this.oldWardBiding = address.split(',')[2];
    this.districtBiding = address.split(',')[1];
    this.oldDistrictBiding = address.split(',')[1];
    this.provinceBiding = address.split(',')[0];
    this.oldProvinceBiding = address.split(',')[0];
    this.oldSpecificBiding = address.split(',')[3];
    return address.split(',')[3];
  }



  formatCurrency(value: number): string {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
      return 'Invalid value';
    }
  }

  formattedCreateAt(createAt: any) {
    const date = new Date(createAt);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toTimeString().split(' ')[0];

    return `${day}/${month}/${year} - ${time}`;
  }

  formatPaymentMethod(value: any): string {
    if (value == 0) {
      return 'Ship COD';
    } else if (value == 1) {
      return 'Momo';
    } else {
      return 'Unknown';
    }
  }

  formatStatus(value: any): string {
    switch (value) {
      case 2:
        return 'Chờ xác nhận';
      case 3:
        return 'Đang đóng gói';
      case 4:
        return 'Đang vận chuyển';
      case 5:
        return 'Giao hàng thành công';
      case 6:
        return 'Đơn hàng bị hủy';
      case 7:
        return 'Giao hàng thất bại';
      case 8:
        return 'Đang trả về';
      case 9:
        return 'Đã nhận lại hàng';
      case 10:
        return 'Đã hoàn tiền';
      case 11:
        return 'Không hoàn tiền';
      default:
        return 'Unknow';
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

  handleChangeProvince(obj: any):void{
    this.provinceSelected = obj;
    this.APIGetProvince();
    this.districtBiding = this.defaulValueDistrict.district_name;
    this.wardSelected = null;
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

  handleChangeDistrict(obj: any):void{
    this.districtSelected = obj;
    this.APIGetDistrict(this.provinceSelected.province_id)
    this.wardBiding = this.defaultValueWard.ward_name;
    this.wardSelected = null;
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

  handleChangeWard(obj: any):void{
    this.APIGetWard(this.districtSelected.district_id)
    this.wardSelected = obj;
    if(this.wardSelected){
      if(this.provinceSelected.province_id != ""){
        this.isDisableSpecific = false
      }else{
        this.isDisableSpecific = true
      }

    }
  }

  setDTOAddress(type: number){
    if(type == 1){
      if(this.wardSelected){
        return {
          ward_name: this.wardSelected.ward_name
        }
      } else{
        return {
          ward_name: this.wardBiding
        }
      }
    } else if(type == 2){
      if(this.districtSelected){
        return {
          district_name: this.districtSelected.district_name
        }
      } else{
        return {
          district_name: this.districtBiding
        }
      }
    } else if(type == 3){
      if(this.provinceSelected){
        // this.districtSelected = {
        //   district_name: "",
        // };
        return {
          province_name: this.provinceSelected.province_name
        }
      } else{
        return {
          province_name: this.provinceBiding
        }
      }
      
    }
    return {}
  }

  setDTOPaymentMethod(){
    if(this.itemBill.PaymentMethod == 0){
      return {
        Code: 0,
        Method: "Ship COD"
      } 
    } else if(this.itemBill.PaymentMethod == 1){
      return {
        Code: 1,
        Method: "Momo"
      } 
    }
    return {};
  }

  ClickButtonAction(id: number, event: Event, idStatus: number) {
    const status = this.listStatus.find(status => status.Code === idStatus);
    this.listNextStatus = status ? status.ListNextStatus : null;

    if (this.tempID !== id) {
      this.isClickButton[this.tempID] = false;
    }

    this.isClickButton[id] = !this.isClickButton[id];

    this.tempID = id;

    const cells = document.querySelectorAll('td.k-table-td[aria-colindex="8"]');
    cells.forEach(cell => cell.classList.remove('active'));

    const cell = (event.target as HTMLElement).closest('td.k-table-td[aria-colindex="8"]');
    if (cell) {
      cell.classList.add('active');
    }
  }

  //Check show alert
  clickDropDownAction(item: DTOBillInfo, value: any) {
    this.itemBillInfo = item;
    this.objItemStatus = value
    this.isShowAlert = !this.isShowAlert;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.tempID !== null && !(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="8"]')) {
      this.isClickButton[this.tempID] = false;
    }
    if (this.isShowAlert == true && ((event.target as HTMLElement).closest('.buttonNoChange'))) {
      this.isShowAlert = false;
    }
    if (this.isEdit == false && ((event.target as HTMLElement).closest('.button-edit'))) {
      this.isEdit = !this.isEdit;
      this.isDisabled = false;
    }
    if (this.isEdit == true && (((event.target as HTMLElement).closest('.button-update'))) || ((event.target as HTMLElement).closest('.button-restore'))) {
      this.isEdit = false;
      this.isDisabled = !this.isDisabled;
      this.isDisableDistrict = !this.isDisableDistrict;
      this.isDisableWard = !this.isDisableWard;
      this.isDisableSpecific = !this.isDisableSpecific;
    }
  }

  //Nhận text của text-area
  receive(value: any) {
    this.reasonFail = value;
  }

  // Update status bill
  updateStatusBillInfo(obj: any) {    
    if (obj.value >= 2) {
      this.itemBill.Status = obj.value;
      const requestUpdateBill: DTOUpdateBill = {
        CodeBill: this.itemBill.Code,
        Status: obj.value,
        ListOfBillInfo: this.itemBill.ListBillInfo,
        Note: this.reasonFail,
      }

      requestUpdateBill.ListOfBillInfo.forEach(billInfo =>{
        if(billInfo.Code == this.itemBillInfo.Code){
          billInfo.Status = obj.value;
        }
      })

      const request: DTOUpdateBillRequest = {
            DTOUpdateBill: requestUpdateBill,
            DTOProceedToPayment: null
          }
      this.billService.updateBill(request).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          this.notiService.Show("Cập nhật trạng thái thành công", "success")
          this.getListBillInfo();
          this.isShowAlert = false;
        }
      }, error => {
        console.error('Error:', error);
      });
    }
  }
}
