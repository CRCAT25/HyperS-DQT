import { Component, Input } from '@angular/core';
import { DTOCoupon } from 'src/app/admin-pages/shared/dto/DTOCoupon.dto';

@Component({
  selector: 'component-coupon',
  templateUrl: './component-coupon.component.html',
  styleUrls: ['./component-coupon.component.scss']
})
export class ComponentCouponComponent {
  @Input() srcBgCoupon: string = '../../../../assets/bg-coupon.png';
  @Input() coupon: DTOCoupon;

  // Format tiền tệ
  formatCurrency(value: number): string {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
      return 'Invalid value';
    }
  }

  // format date để hiển thị trên giao diện
  formatDateToDisplay(dateTime: string): string {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
