import { Component, ViewChild } from '@angular/core';
import { DrawerMode, DrawerPosition } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-admin004-manage-coupon',
  templateUrl: './admin004-manage-coupon.component.html',
  styleUrls: ['./admin004-manage-coupon.component.scss']
})
export class Admin004ManageCouponComponent {
  // Chế độ hiển thị của drawer
  expandMode: DrawerMode = 'overlay';
  // Drawer đang được mở hay không
  expanded = false;
  // Chiều dài của drawer
  widthDrawer: number = 550;
  // Vị trị xuất hiện của drawer
  positionDrawer: DrawerPosition = "end";
}
