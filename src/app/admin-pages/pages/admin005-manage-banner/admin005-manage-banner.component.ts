import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DrawerComponent, DrawerMode, DrawerPosition } from '@progress/kendo-angular-layout';
import { ReplaySubject } from 'rxjs';
import { DTOStatus } from '../../shared/dto/DTOStatus.dto';
import { DTOBanner, DTOBannerType, DTOPageEcom, DTOPositionInPage, listActionChangeStatusBanner, listBannerType, listPageEcom, listStatusBanner } from '../../shared/dto/DTOBanner.dto';
import { BannerService } from '../../shared/service/banner.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';
import { takeUntil } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { CheckboxlistComponent } from '../../shared/component/checkboxlist/checkboxlist.component';
import { TextDropdownComponent } from 'src/app/shared/component/text-dropdown/text-dropdown.component';
import { SearchBarComponent } from 'src/app/shared/component/search-bar/search-bar.component';
import { TextInputComponent } from 'src/app/shared/component/text-input/text-input.component';
import { TextAreaComponent } from 'src/app/shared/component/text-area/text-area.component';
import { ImportImageComponent } from '../../shared/component/import-image/import-image.component';
import { isEmpty } from 'src/app/shared/utils/utils';
import { DTOUpdateBannerRequest } from '../../shared/dto/DTOUpdateBannerRequest.dto';

@Component({
  selector: 'app-admin005-manage-banner',
  templateUrl: './admin005-manage-banner.component.html',
  styleUrls: ['./admin005-manage-banner.component.scss']
})
export class Admin005ManageBannerComponent implements OnInit, OnDestroy {
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
  pageSize: number = 5;
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
  // Danh sách các vị trí của trang trong drawer
  listPositionOfPageDrawer: DTOPositionInPage[];
  // Danh sách các loại banner
  listBannerType: DTOBannerType[] = listBannerType;
  // Danh sách số trang có thể đổi
  listPageSize: number[] = [5, 10, 15];


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
  // banner được chọn để cập nhật
  selectedBannerToUpdate: DTOBanner;


  // ViewChild bên content
  @ViewChild('drawer') childDrawer!: DrawerComponent;
  @ViewChild('status') childStatus!: CheckboxlistComponent;
  @ViewChild('search') childSearch!: SearchBarComponent;
  @ViewChild('bannerType') childBannerType!: TextDropdownComponent;
  @ViewChild('pageDisplay') childPageDisplay!: TextDropdownComponent;
  @ViewChild('position') childPosition!: TextDropdownComponent;
  // ViewChild trong drawer
  @ViewChild('pageDrawer') childPageDrawer!: TextDropdownComponent;
  @ViewChild('positionDrawer') childPositionDrawer!: TextDropdownComponent;
  @ViewChild('titleDrawer') childTitleDrawer!: TextInputComponent;
  @ViewChild('bannerTypeDrawer') childBannerTypeDrawer!: TextDropdownComponent;
  @ViewChild('imgDrawer') childImgDrawer!: ImportImageComponent;
  @ViewChild('videoURLdrawer') childVideoURLdrawer!: TextInputComponent;


  // Filter cho trạng thái của banner
  filterStatus: CompositeFilterDescriptor = { logic: 'or', filters: [{ field: 'Status', operator: 'eq', value: 0 }] };
  // Filter cho search
  filterSearch: FilterDescriptor = { field: 'Title', operator: 'contains', value: null, ignoreCase: true };
  // Filter cho search
  filterBannerType: FilterDescriptor = { field: 'BannerType', operator: 'eq', value: null, ignoreCase: true };
  // Filter cho trang hiển thị
  filterPage: FilterDescriptor = { field: 'Page', operator: 'eq', value: null, ignoreCase: true };
  // Filter cho vị trí
  filterPosition: FilterDescriptor = { field: 'Position', operator: 'eq', value: null, ignoreCase: true };


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
      filters: [this.filterStatus]
    }
  }


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
    const list: DTOStatus[] = res;
    this.filterStatus.filters = [];
    list.forEach(item => {
      if (item.IsChecked) {
        this.filterStatus.filters.push({ field: 'Status', operator: 'eq', value: item.Code });
      }
    })

    this.setFilterData();
  }

  // Push filter vào gridState
  pushToGridState(filter: FilterDescriptor, comFilter: CompositeFilterDescriptor) {
    if (filter) {
      if (filter.value !== null && filter.value !== '' && filter.value !== -1) {
        this.gridState.filter.filters.push(filter);
      }
    }
    else if (comFilter) {
      if (comFilter.filters.length > 0) {
        this.gridState.filter.filters.push(comFilter);
      }
    }
  }

  // Xóa bộ lọc
  resetFilter() {
    // Reset status
    this.childStatus.resetCheckList([
      {
        Code: 0,
        Status: 'Đang được sử dụng',
        IsChecked: true
      },
      {
        Code: 1,
        Status: 'Ngưng hoạt động',
        IsChecked: false
      }
    ])
    this.filterStatus = { logic: 'or', filters: [{ field: 'Status', operator: 'eq', value: 0 }] };

    // reset search
    this.childSearch.clearValue();
    this.filterSearch.value = null;

    // reset loại banner
    this.childBannerType.resetValue();
    this.filterBannerType.value = null;

    // reset trang hiển thị
    this.childPageDisplay.resetValue();
    this.filterPage.value = null;

    // reset vị trí theo trang
    this.childPosition.resetValue();
    this.filterPosition.value = null;

    this.pageSize = 5;
    this.gridState.skip = 0;
    this.gridState.filter.filters.push(this.filterStatus);
    this.gridState.take = 5;

    this.setFilterData();
  }

  // Set tất cả filter
  setFilterData() {
    this.gridState.filter.filters = [];
    this.pushToGridState(null, this.filterStatus);
    this.pushToGridState(this.filterSearch, null);
    this.pushToGridState(this.filterPage, null);
    this.pushToGridState(this.filterPosition, null);
    this.pushToGridState(this.filterBannerType, null);
    this.getListBanner();
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
    if (res.Code !== -1) {
      this.filterPage.value = res.Page;
    }
    this.setFilterData();
  }

  // Lấy giá trị từ dropdown Chọn loại banner và filter bannertype
  getBannerType(res: DTOBannerType) {
    this.filterBannerType.value = res.Code;
    this.setFilterData();
  }

  // Lấy giá trị từ dropdown Chọn loại banner và filter bannertype
  getBannerPosition(res: DTOPositionInPage) {
    this.filterPosition.value = res.Code;
    this.setFilterData();
  }

  // Lấy giá trị từ searchbar và filter theo title
  getValueSearch(res: string) {
    this.filterSearch = { field: 'Title', operator: 'contains', value: res };
    this.setFilterData();
  }

  // Lấy giá trị từ dropdown Chọn trang hiển thị tại drawer
  getPageDisplayDrawer(res: DTOPageEcom) {
    if (res.Code === -1) {
      this.imgStructure = this.imgDefault;
      this.listPositionOfPageDrawer = [];
      this.childPositionDrawer.value = this.defaultPosition;
    }
    else {
      this.imgStructure = res.ImgStructure;
      this.listPositionOfPageDrawer = res.ListPosition;
    }
    this.selectedBannerToUpdate.Page = res.Page;
  }

  // Lấy giá trị từ dropdown Chọn loại banner ở drawer
  getBannerTypeDrawer(res: DTOBannerType) {
    this.selectedBannerTypeDrawer = res;
  }

  // Tìm code của trang dựa trên tên trang
  findCodeFromPage(page: string) {
    const foundPage = listPageEcom.find(itemPage => itemPage.Page === page);
    if (foundPage) return foundPage.Code;
    return -1;
  }

  // Tìm danh sách các position trong trang dựa trên tên trang
  findListPositionFromPage(page: string) {
    const foundPage = listPageEcom.find(itemPage => itemPage.Page === page);
    if (foundPage) return foundPage.ListPosition;
    return [];
  }

  // Tìm tên vị trí của 1 trang dựa trên code position và trang cụ thể
  findPositionFromCode(page: string, code: number) {
    const position = this.findListPositionFromPage(page).find(pos => pos.Code === code);
    if (position) return position.Position;
    return '';
  }

  // Tìm loại banner dựa trên banner
  findBannerTypeFromBanner(banner: DTOBanner): DTOBannerType{
    const foundType = listBannerType.find(type => type.Code === banner.BannerType);
    const bannerType: DTOBannerType = {
      Code: banner.BannerType,
      Type: foundType ? foundType.Type : this.defaultBannerType.Type
    }
    return bannerType;
  }

  // Mở drawer
  openDrawer(type: 'structure' | 'update' | 'add') {
    this.childDrawer.toggle();
    this.imgStructure = this.imgDefault;
    this.selectedBannerTypeDrawer = this.defaultBannerType;
    this.contentInDrawer = type;
    this.selectedBannerToUpdate = {
      Code: 0,
      Title: '',
      BannerType: -1,
      BannerUrl: '',
      Position: -1,
      Page: '',
      Status: 0
    }
    if(type === 'add') this.listPositionOfPageDrawer = [];
  }

  // Hàm thêm mới banner
  addBanner() {
    if (this.checkUpdatable()) {
      const banneURL: string = this.childBannerTypeDrawer.value.Code === 0
        ? this.childImgDrawer.imageHandle.ImgUrl
        : this.childVideoURLdrawer.valueTextBox;
      const banner: DTOBanner = {
        Code: 0,
        Title: this.childTitleDrawer.valueTextBox,
        BannerType: this.childBannerTypeDrawer.value.Code,
        BannerUrl: banneURL,
        Position: this.childPositionDrawer.value.Code,
        Page: this.childPageDrawer.value.Page,
        Status: 0
      }
      const req: DTOUpdateBannerRequest = {
        Banner: banner,
        Properties:
          ['Title', 'BannerType', 'BannerUrl',
            'Position', 'Page', 'Status'
          ]
      }
      this.bannerService.addBanner(req).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          this.notiService.Show('Thêm mới banner thành công', 'success');
          this.childDrawer.toggle();
          this.getListBanner();
        }
      })
    }
  }

  // Hàm cập nhật banner
  updateBanner() {
    if(this.checkUpdatable()){
      const banner: DTOBanner = {
        Code: this.selectedBannerToUpdate.Code,
        Title: this.childTitleDrawer.valueTextBox,
        BannerType: this.childBannerTypeDrawer.value.Code,
        BannerUrl: '',
        Position: this.childPositionDrawer.value.Code,
        Page: this.childPageDrawer.value.Page,
        Status: 0
      }
      if(banner.BannerType === 0) banner.BannerUrl = this.childImgDrawer.imageHandle.ImgUrl;
      if(banner.BannerType === 1) banner.BannerUrl = this.childVideoURLdrawer.valueTextBox;
      const req: DTOUpdateBannerRequest = {
        Banner: banner,
        Properties: ['Title', 'BannerType', 'BannerUrl', 'Position', 'Page']
      }
      this.bannerService.updateBanner(req).subscribe((res: DTOResponse) => {
        if(res.StatusCode === 0){
          this.notiService.Show('Cập nhật banner thành công', 'success');
          this.childDrawer.toggle();
          this.getListBanner();
        }
      }, error => {
        this.notiService.Show('Lỗi hệ thống: ' + error, 'error');
      })
    }
  }

  // Cập nhật trạng thái của banner
  updateStatusBanner(res: any, banner: DTOBanner) {
    if (res.value === 1) {
      banner.Status = 0;
      const req: DTOUpdateBannerRequest = {
        Banner: banner,
        Properties: ['Status']
      }
      this.bannerService.updateBanner(req).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          this.notiService.Show('Cập nhật trạng thái thành công', 'success');
          this.getListBanner();
        }
      }, error => {
        this.notiService.Show('Lỗi hệ thống: ' + error, 'error');
      })
    }
    if (res.value === 0) {
      this.openDrawer('update');
      this.selectedBannerToUpdate = banner;
      this.listPositionOfPageDrawer = this.findListPositionFromPage(banner.Page);
      this.getBannerTypeDrawer(this.findBannerTypeFromBanner(banner));
    }
  }

  // Kiểm tra input hợp lệ hay không
  checkUpdatable() {
    if (this.childPageDrawer.value.Code === -1) {
      this.notiService.Show('Vui lòng chọn trang hiển thị', 'error');
      return false;
    }
    if (this.childPositionDrawer.value.Code === -1) {
      this.notiService.Show('Vui lòng chọn vị trí của trang', 'error');
      return false;
    }
    if (isEmpty(this.childTitleDrawer.valueTextBox)) {
      this.notiService.Show('Vui lòng nhập tiêu đề của banner', 'error');
      return false;
    }
    if (this.childBannerTypeDrawer.value.Code === -1) {
      this.notiService.Show('Vui lòng chọn loại banner', 'error');
      return false;
    }
    if (this.childBannerTypeDrawer.value.Code === 0) {
      if (this.childImgDrawer.imageHandle.ImgUrl === this.imgDefault) {
        this.notiService.Show('Vui lòng chọn hình ảnh', 'error');
        return false;
      }
    }
    if (this.childBannerTypeDrawer.value.Code === 1) {
      if (isEmpty(this.childVideoURLdrawer.valueTextBox)) {
        this.notiService.Show('Vui lòng nhập đường dẫn video', 'error');
        return false;
      }
    }
    return true;
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

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
