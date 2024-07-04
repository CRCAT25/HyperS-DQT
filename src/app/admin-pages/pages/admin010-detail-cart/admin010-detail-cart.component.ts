import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DTOBillInfo } from '../../shared/dto/DTOBillInfo.dto';
import { DTOBill } from '../../shared/dto/DTOBill.dto';

@Component({
  selector: 'app-admin010-detail-cart',
  templateUrl: './admin010-detail-cart.component.html',
  styleUrls: ['./admin010-detail-cart.component.scss']
})
export class Admin010DetailCartComponent implements OnInit {
  @Output() datePicked = new EventEmitter();
  @Input() listData: DTOBillInfo[];
  @Input() itemData: DTOBill;
  listBillInfo: DTOBillInfo[];
  itemBill: DTOBill;


  ngOnInit(): void {
    this.listBillInfo = this.listData;
    this.itemBill = this.itemData;
    // this.itemData.ListBillInfo = this.listBillInfo;
    // console.log('a');
    // console.log(this.itemData);
    // console.log(this.itemData.ListBillInfo);

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
}
