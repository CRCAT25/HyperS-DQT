import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DrawerComponent, DrawerMode, DrawerPosition } from '@progress/kendo-angular-layout';
import { ReplaySubject } from 'rxjs';
import { DTOStatus } from '../../shared/dto/DTOStatus.dto';
import { DTOBanner, DTOBannerType, DTOPageEcom, DTOPositionInPage, listActionChangeStatusBanner, listBannerType, listPageEcom, listStatusBanner } from '../../shared/dto/DTOBanner.dto';
import { BannerService } from '../../shared/service/banner.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { State } from '@progress/kendo-data-query';
import { takeUntil } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';

@Component({
  selector: 'app-admin005-manage-banner',
  templateUrl: './admin005-manage-banner.component.html',
  styleUrls: ['./admin005-manage-banner.component.scss']
})
export class Admin005ManageBannerComponent implements OnInit {
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
  // Số item hiển thị trong 1 trang
  pageSize: number = 2;
  // Danh sách có đang load hay không
  isLoading: boolean = true;
  // Code của banner được chọn
  selectedCodeBanner: number = 0;


  // Danh sách các trạng thái của banner
  listStatusBanner: DTOStatus[] = listStatusBanner;
  // Danh sách các trang của trang ecom
  listPageEcom: DTOPageEcom[] = listPageEcom;
  // Danh sách các vị trí của trang
  listPositionOfPage: DTOPositionInPage[];
  // Danh sách các loại banner
  listBannerType: DTOBannerType[] = listBannerType;
  // Danh sách số trang có thể đổi
  listPageSize: number[] = [2, 3, 4];


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
    Type: '-- Chọn loại banner --'
  };
  // Item loại banner được chọn ở drawer
  selectedBannerTypeDrawer: DTOBannerType = this.defaultBannerType;
  // GridData của danh sách các banner
  listBanner: GridDataResult;

  // Khởi tạo State
  gridState: State = {
    skip: 0,
    take: this.pageSize,
    sort: [
      {
        "field": "Code",
        "dir": "asc"
      }
    ],
    filter: {
      logic: "and",
      filters: []
    }
  }

  @ViewChild('drawer') childDrawer!: DrawerComponent;


  constructor(private bannerService: BannerService, private notiService: NotiService) { }

  ngOnInit(): void {
    this.getListBanner();
  }

  // Lấy danh sách các banner
  getListBanner() {
    this.isLoading = true;
    this.bannerService.getListBanner(this.gridState).pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        this.listBanner = { data: res.ObjectReturn.Data, total: res.ObjectReturn.Total };
        this.isLoading = false;
      }
      else {
        this.notiService.Show('Lỗi trong quá trình lấy API: ' + res.ErrorString, 'error');
      }
    })
  }

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
  resetFilter() {

  }

  // Set tất cả filter
  setFilterData() {

  }

  // Kiểm tra loại banner
  checkBannerType(banner: DTOBanner) {
    if (banner.BannerType === 0) return 'Hình ảnh';
    if (banner.BannerType === 1) return 'Đoạn video';
    return 'Lỗi loại banner'
  }

  // Kiểm tra hình ảnh hoặc video
  checkBannerImage(banner: DTOBanner) {
    if (banner.BannerType === 0) return banner.BannerUrl;
    if (banner.BannerType === 1) return 'https://i.ibb.co/kgx1bPs/vd.jpg';
    return 'Lỗi hình ảnh'
  }

  // Kiểm tra trạng thái của banner
  checkBannerStatus(banner: DTOBanner) {
    if (banner.Status === 0) return 'Đang được sử dụng';
    if (banner.Status === 1) return 'Ngưng hoạt động';
    return 'Lỗi trạng thái'
  }

  // Lấy giá trị từ dropdown Chọn trang hiển thị và set giá trị cho dropdown vị trí
  getPageDisplay(res: DTOPageEcom) {
    this.listPositionOfPage = res.ListPosition;
  }

  // Lấy giá trị từ dropdown Chọn loại banner
  getBannerType(res: DTOBannerType) {
    console.log(res);
  }

  // Lấy giá trị từ searchbar
  getValueSearch(res: string) {
    // this.filterSearch = { field: 'IdCoupon', operator: 'contains', value: res };
    this.setFilterData();
  }

  // Lấy giá trị từ dropdown Chọn trang hiển thị
  getPageDisplayDrawer(res: DTOPageEcom) {
    if (res.Code === -1) {
      this.imgStructure = this.imgDefault;
    }
    else {
      this.imgStructure = res.ImgStructure;
    }
    this.listPositionOfPage = res.ListPosition;
  }

  // Lấy giá trị từ dropdown Chọn loại banner ở drawer
  getBannerTypeDrawer(res: DTOBannerType) {
    this.selectedBannerTypeDrawer = res;
  }

  // Mở drawer để xem cấu trúc
  openDrawer(type: 'structure' | 'update' | 'add') {
    this.childDrawer.toggle();
    this.imgStructure = this.imgDefault;
    this.selectedBannerTypeDrawer = this.defaultBannerType;
    this.contentInDrawer = type;
  }

  // Hàm thêm mới banner
  addBanner() {

  }

  // Hàm cập nhật banner
  updateBanner() {

  }

  // Kiểm tra input hợp lệ hay không
  checkUpdatable() {

  }

  // Thao tác paging
  onPageChange(value: any) {
    this.gridState.skip = value.skip;
    this.gridState.take = value.take;
    this.getListBanner();
  }

  // Lấy danh sách các action có thể để chuyển trạng thái
  getListChangeStatus(status: number): DTOStatus[] {
    if (status === 0) return listActionChangeStatusBanner.filter(status => status.Code === 0);
    if (status === 1) return listActionChangeStatusBanner.filter(status => status.Code === 0 || status.Code === 1);
    return listActionChangeStatusBanner.filter(status => status.Code === 0);
  }

  // Sự kiện click vào button ... tool box
  onClickToolBox(banner: DTOBanner, event: Event) {
    if (this.selectedCodeBanner === banner.Code) {
      this.selectedCodeBanner = 0;
    }
    else {
      this.selectedCodeBanner = banner.Code;
    }

    // Remove 'active' class from all cells
    const cells = document.querySelectorAll('td.k-table-td[aria-colindex="9"]');
    cells.forEach(cell => cell.classList.remove('active'));

    // Add 'active' class to the clicked cell
    const cell = (event.target as HTMLElement).closest('td.k-table-td[aria-colindex="9"]');
    if (cell) {
      cell.classList.add('active');
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="7"]')) {
      this.selectedCodeBanner = 0;
    }
  }
}
