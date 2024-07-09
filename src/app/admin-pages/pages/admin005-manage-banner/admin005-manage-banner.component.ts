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
  // Content bên trong drawer là gì? 'structure': Xem cấu trúc, 'update': Cập nhật, 'add': Thêm mới
  contentInDrawer: string = '';
  // Hình ảnh default
  imgDefault: string = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';
  // Hình ảnh xem trước cấu trúc
  imgStructure: string = this.imgDefault;


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
  // Item loại banner được chọn ở drawer
  selectedBannerTypeDrawer: DTOBannerType = this.defaultBannerType;


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

  // Xóa bộ lọc
  resetFilter() { }

  setFilterData(){

  }

  // Lấy giá trị từ dropdown Chọn trang hiển thị và set giá trị cho dropdown vị trí
  getPageDisplay(res: DTOPageEcom){
    this.listPositionOfPage = res.ListPosition;
  }

  // Lấy giá trị từ dropdown Chọn loại banner
  getBannerType(res: DTOBannerType){
    console.log(res);
  }

  // Lấy giá trị từ searchbar
  getValueSearch(res: string){
    // this.filterSearch = { field: 'IdCoupon', operator: 'contains', value: res };
    this.setFilterData();
  }

  // Lấy giá trị từ dropdown Chọn trang hiển thị
  getPageDisplayDrawer(res: DTOPageEcom){
    if(res.Code === -1){
      this.imgStructure = this.imgDefault;
    }
    else{
      this.imgStructure = res.ImgStructure;
    }
    this.listPositionOfPage = res.ListPosition;
  }

  // Lấy giá trị từ dropdown Chọn loại banner ở drawer
  getBannerTypeDrawer(res: DTOBannerType){
    this.selectedBannerTypeDrawer = res;
  }

  // Mở drawer để xem cấu trúc
  openDrawer(type: 'structure' | 'update' | 'add'){
    this.childDrawer.toggle();
    this.imgStructure = this.imgDefault;
    this.selectedBannerTypeDrawer = this.defaultBannerType;
    this.contentInDrawer = type;
  }

  // Hàm thêm mới banner
  addBanner(){

  }

  // Hàm cập nhật banner
  updateBanner(){
    
  }

  checkUpdatable(){

  }
}
