import { Component, ViewChild } from '@angular/core';
import { DrawerComponent, DrawerMode, DrawerPosition } from '@progress/kendo-angular-layout';
import { ReplaySubject } from 'rxjs';
import { DTOStatus } from '../../shared/dto/DTOStatus.dto';
import { DTOBannerType, DTOPageEcom, DTOPositionInPage, listBannerType, listPageEcom, listStatusBanner } from '../../shared/dto/DTOBanner.dto';

@Component({
  selector: 'app-admin005-manage-banner',
  templateUrl: './admin005-manage-banner.component.html',
  styleUrls: ['./admin005-manage-banner.component.scss']
})
export class Admin005ManageBannerComponent {
  // variable Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);


  // Chế độ hiển thị của drawer
  expandMode: DrawerMode = 'overlay';
  // Drawer đang được mở hay không
  expanded = false;
  // Chiều dài của drawer
  widthDrawer: number = 550;
  // Vị trị xuất hiện của drawer
  positionDrawer: DrawerPosition = "end";


  // Danh sách các trạng thái của banner
  listStatusBanner: DTOStatus[] = listStatusBanner;
  // Danh sách các trang của trang ecom
  listPageEcom: DTOPageEcom[] = listPageEcom;
  // Danh sách các vị trí của trang
  listPositionOfPage: DTOPositionInPage[];
  // Danh sách các loại banner
  listBannerType: DTOBannerType[] = listBannerType;


  // Item mặc định của dropdown chọn trang hiển thị
  defaultPageEcom: DTOPageEcom = {
    Code: -1,
    Page: '-- Chọn trang hiển thị --',
  }
  // Item mặc định của dropdown chọn vị trí
  defaultPosition: DTOPositionInPage = {
    Code: -1,
    Position: '-- Vị trí theo trang --'
  };
  // Item mặc định của dropdown loại banner
  defaultBannerType: DTOBannerType = {
    Code: -1,
    Type: '-- Chọn kiểu banner --'
  };


  @ViewChild('drawer') childDrawer!: DrawerComponent;


  // Lấy giá trị từ checklist status
  getValueFromCheckListStatus(res: any) {
    // const list: DTOStatus[] = res;
    // if (checklistType === 'status') {
    //   this.filterStatus.filters = [];
    //   list.forEach(item => {
    //     if (item.IsChecked) {
    //       this.filterStatus.filters.push({ field: 'Status', operator: 'eq', value: item.Code });
    //     }
    //   })
    // }
    // if (checklistType === 'stage') {
    //   this.filterStage.filters = [];
    //   list.forEach(item => {
    //     if (item.IsChecked) {
    //       this.filterStage.filters.push({ field: 'Stage', operator: 'eq', value: item.Code });
    //     }
    //   })
    // }

    // this.setFilterData();
  }

  // Đóng mở drawer
  toggleDrawer() {
    this.childDrawer.toggle();
  }

  // Xóa bộ lọc
  resetFilter() { }

  // Set filter search
  setFilterSearch(res: any) {
    // this.filterSearch = { field: 'IdCoupon', operator: 'contains', value: res };
    // this.setFilterData();
  }
}
