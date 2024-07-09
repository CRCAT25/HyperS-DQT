import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DrawerComponent, DrawerMode, DrawerPosition } from '@progress/kendo-angular-layout';
import { DTOStatus, listStageCoupon, listStatusCoupon } from '../../shared/dto/DTOStatus.dto';
import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';
import { DTOCoupon, DTOCouponType, listActionChangeStatusCoupon, listCouponType } from '../../shared/dto/DTOCoupon.dto';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CouponService } from '../../shared/service/coupon.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { CheckboxlistComponent } from '../../shared/component/checkboxlist/checkboxlist.component';
import { DatepickerComponent } from '../../shared/component/datepicker/datepicker.component';
import { TextDropdownComponent } from 'src/app/shared/component/text-dropdown/text-dropdown.component';
import { SearchBarComponent } from 'src/app/shared/component/search-bar/search-bar.component';
import { DTOUpdateCouponRequest } from '../../shared/dto/DTOUpdateCouponRequest.dto';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOGroupCustomer, listGroupCustomer } from 'src/app/shared/dto/DTOCustomer.dto';
import { TextInputComponent } from 'src/app/shared/component/text-input/text-input.component';
import { TextAreaComponent } from '@progress/kendo-angular-inputs';

interface GroupCustomer {
  Code: number
  Group: string
}
@Component({
  selector: 'app-admin004-manage-coupon',
  templateUrl: './admin004-manage-coupon.component.html',
  styleUrls: ['./admin004-manage-coupon.component.scss']
})
export class Admin004ManageCouponComponent implements OnInit {
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
  // Đường dẫn tới ảnh background coupon
  srcBgCoupon: string = '../../../../assets/bg-coupon.png';
  // Ngày hiện tại
  currentDate: Date = new Date();
  // Ngày nhỏ nhất có thể
  minDate: Date = new Date(1900, 1, 1);
  // Ngày lớn nhất có thể
  maxDate: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  // Ngày bắt đầu
  startDate: Date = this.minDate;
  // Ngày kết thúc
  endDate: Date = this.maxDate;
  // Số item mỗi trang
  pageSize: number = 2;
  // Loading của grid
  isLoading: boolean = true;
  // Code của coupon được chọn
  selectedCouponCode: number = 0;
  // Loại khuyến mãi được chọn
  selectedCouponType: number = -1;
  // Ngày nhỏ nhất có thể của chi tiết coupon
  minDateCoupon: Date = new Date(1900, 1, 1);
  // Ngày lớn nhất có thể của chi tiết coupon
  maxDateCoupon: Date = new Date(this.currentDate.getFullYear() + 0, 12, 30);
  // Ngày bắt đầu của chi tiết coupon
  startDateCoupon: Date = null;
  // Ngày kết thúc của chi tiết coupon
  endDateCoupon: Date = null;


  // Danh sách đầy đủ các trạng thái của coupon
  listStatusCoupon: DTOStatus[] = listStatusCoupon;
  // Danh sách đầy đủ các giai đoạn của coupon
  listStageCoupon: DTOStatus[] = listStageCoupon.filter(stage => stage.Code !== 0);
  // Danh sách các coupon
  listCoupon: GridDataResult;
  // Danh sách các pageSize
  listPageSize: number[] = [2, 3, 4];
  // Danh sách đầy đủ các đối tượng khách hàng
  listGroupCustomerApply: GroupCustomer[] = [
    {
      Code: 0,
      Group: 'Tất cả'
    },
    {
      Code: 1,
      Group: 'Có tài khoản'
    }
  ]
  // Danh sách các loại khuyến mãi
  listCouponType: DTOCouponType[] = listCouponType;
  // Danh sách nhóm khách hàng áp dụng
  listGroupCustomer: DTOGroupCustomer[] = listGroupCustomer;


  // Đối tượng áp dụng mặc định
  defaultGroupCustomerApply: GroupCustomer = { Code: -1, Group: '-- Chọn nhóm khách hàng --' };
  // Coupon được chọn để hiển thị trên drawer
  selectedCoupon: DTOCoupon = {
    Code: -1,
    IdCoupon: '',
    Description: '',
    StartDate: null,
    EndDate: null,
    Quantity: 0,
    RemainingQuantity: 0,
    MinBillPrice: 0,
    MaxBillDiscount: 0,
    Status: 0,
    Stage: 0,
    CouponType: -1,
    DirectDiscount: 0,
    PercentDiscount: 0,
    ApplyTo: -1
  }
  reviewCoupon: DTOCoupon = {
    Code: -1,
    IdCoupon: '',
    Description: '',
    StartDate: null,
    EndDate: null,
    Quantity: 0,
    RemainingQuantity: 0,
    MinBillPrice: 0,
    MaxBillDiscount: 0,
    Status: 0,
    Stage: 0,
    CouponType: -1,
    DirectDiscount: 0,
    PercentDiscount: 0,
    ApplyTo: -1
  };
  // Loại coupon mặc định
  defaultCouponType: DTOCouponType = { Code: -1, Type: '-- Chọn loại khuyến mãi --' };
  // Nhóm khách hàng áp dụng mặc định
  defaultGroupCustomer: DTOGroupCustomer = { Code: -1, Group: '-- Chọn nhóm khách hàng --' };


  // Filter cho trạng thái khuyến mãi
  filterStatus: CompositeFilterDescriptor = { logic: 'or', filters: [{ field: 'Status', operator: 'eq', value: 0 }] };
  // Filter cho giai đoạn của khuyến mãi
  filterStage: CompositeFilterDescriptor = { logic: 'or', filters: [] };
  // Filter cho ngày
  filterDate: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  // Filter cho search
  filterSearch: FilterDescriptor = { field: 'IdCoupon', operator: 'contains', value: null, ignoreCase: true };
  // Filter cho nhóm khách hàng
  filterGroupCustomer: FilterDescriptor = { field: 'ApplyTo', operator: 'eq', value: -1, ignoreCase: true };


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


  // ViewChild drawer content
  @ViewChild('status') childStatus!: CheckboxlistComponent;
  @ViewChild('stage') childStage!: CheckboxlistComponent;
  @ViewChild('search') chidlSearch!: SearchBarComponent;
  @ViewChild('rangeDateStart') chidlStartDate!: DatepickerComponent;
  @ViewChild('rangeDateEnd') chidlEndDate!: DatepickerComponent;
  @ViewChild('group') childGroup!: TextDropdownComponent;
  @ViewChild('drawer') childDrawer!: DrawerComponent;
  // ViewChild drawer
  @ViewChild('idCoupon') childIdCoupon!: TextInputComponent;
  @ViewChild('startDateCouponView') childStartDateCoupon!: DatepickerComponent;
  @ViewChild('endDateCouponView') childEndDateCoupon!: DatepickerComponent;
  @ViewChild('quantityCoupon') childQuantity!: TextInputComponent;
  @ViewChild('remainingQuantityCoupon') childRemainingQuantity!: TextInputComponent;
  @ViewChild('minBillPrice') childMinBillPrice!: TextInputComponent;
  @ViewChild('couponType') childCouponType!: TextDropdownComponent;
  @ViewChild('maxBillDiscount') childMaxBillPrice!: TextInputComponent;
  @ViewChild('percentDiscount') childPercentDiscount!: TextInputComponent;
  @ViewChild('directDiscount') childDirectDiscount!: TextInputComponent;
  @ViewChild('applyTo') childApplyTo!: TextDropdownComponent;
  @ViewChild('description') childDescription!: TextAreaComponent;

  constructor(private couponService: CouponService, private notiService: NotiService) { }

  ngOnInit(): void {
    this.getListCoupon();
  }

  // Lấy danh sách coupon
  getListCoupon() {
    this.isLoading = true;
    this.couponService.getListCoupon(this.gridState).pipe(takeUntil(this.destroy)).subscribe(data => {
      this.listCoupon = { data: data.ObjectReturn.Data, total: data.ObjectReturn.Total }
      this.isLoading = false;
    })
  }

  // Lấy giá trị từ datepicker
  getDateFromDatePicker(value: any, type: string) {
    if (type === 'start') {
      this.startDate = value;
    }
    if (type === 'end') {
      this.endDate = value;
    }
    this.setFilterDate();
  }

  // Set filter dropdown date
  setFilterDate() {
    this.filterDate.filters = [];
    const filterFrom: FilterDescriptor = { field: 'StartDate', operator: 'gte', value: this.transformToDateString(this.startDate, 'start') };
    this.filterDate.filters.push(filterFrom);
    const filterTo: FilterDescriptor = { field: 'EndDate', operator: 'lte', value: this.transformToDateString(this.endDate, 'end') };
    this.filterDate.filters.push(filterTo);
    this.setFilterData();
  }

  // Set filter search
  setFilterSearch(res: any) {
    this.filterSearch = { field: 'IdCoupon', operator: 'contains', value: res };
    this.setFilterData();
  }

  // Chuyển ngày từ kiểu Date() sang dateString có dạng '2024-07-01T00:00:00'
  transformToDateString(dateTime: Date, type: string): string {
    // Step 1: Create a Date object
    const date = new Date(dateTime);

    // Step 2: Extract the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hoursStart = String(date.getHours()).padStart(2, '0');
    const minutesStart = String(date.getMinutes()).padStart(2, '0');
    const secondsStart = String(date.getSeconds()).padStart(2, '0');
    const hoursEnd = '23';
    const minutesEnd = '59';
    const secondsEnd = '59';

    // Step 3: Construct the desired format
    const formattedDateStart = `${year}-${month} -${day}T${hoursStart}:${minutesStart}:${secondsStart}`;
    const formattedDateEnd = `${year}-${month} -${day}T${hoursEnd}:${minutesEnd}:${secondsEnd}`;

    if (type === 'start') return formattedDateStart;
    if (type === 'end') return formattedDateEnd;
    return '';
  }

  // Filter tất cả
  setFilterData() {
    this.gridState.filter.filters = [];
    this.pushToGridState(null, this.filterStatus);
    this.pushToGridState(null, this.filterStage);
    this.pushToGridState(null, this.filterDate);
    this.pushToGridState(this.filterGroupCustomer, null);
    this.pushToGridState(this.filterSearch, null);
    this.getListCoupon();
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

  // Lấy giá trị từ checklist
  getValueFromCheckList(res: any, checklistType: string) {
    const list: DTOStatus[] = res;
    if (checklistType === 'status') {
      this.filterStatus.filters = [];
      list.forEach(item => {
        if (item.IsChecked) {
          this.filterStatus.filters.push({ field: 'Status', operator: 'eq', value: item.Code });
        }
      })
    }
    if (checklistType === 'stage') {
      this.filterStage.filters = [];
      list.forEach(item => {
        if (item.IsChecked) {
          this.filterStage.filters.push({ field: 'Stage', operator: 'eq', value: item.Code });
        }
      })
    }

    this.setFilterData();
  }

  // Lấy giá trị từ dropdown nhóm khách hàng và set filterGroupCustomer
  setFilterGroupCustomer(res: any) {
    const group: GroupCustomer = res;
    this.filterGroupCustomer.value = group.Code;

    this.setFilterData();
  }

  // Kiểm tra loại khuyến mãi
  checkCouponType(type: number) {
    if (type === 0) return 'Theo phần trăm';
    if (type === 1) return 'Giảm giá trực tiếp';
    return 'Lỗi loại khuyến mãi';
  }

  // Kiểm tra giá trị giảm giá
  checkValueDiscount(coupon: DTOCoupon) {
    if (coupon.CouponType === 0) return 'Giảm phần trăm: ' + coupon.PercentDiscount + '%';
    if (coupon.CouponType === 1) return 'Giảm trực tiếp: ' + this.formatCurrency(coupon.DirectDiscount);
    return 'Lỗi giá trị giảm giá';
  }

  // Kiểm tra khách hàng áp dụng
  checkApplyToCustomer(coupon: DTOCoupon) {
    if (coupon.ApplyTo === 0) return 'Tất cả';
    if (coupon.ApplyTo === 1) return 'Có tài khoản';
    return 'Lỗi khách hàng áp dụng'
  }

  // Kiểm tra trạng thái
  checkStatus(coupon: DTOCoupon) {
    if (coupon.Status === 0) return 'Đang tạo khuyến mãi';
    if (coupon.Status === 1) return 'Đợi duyệt';
    if (coupon.Status === 2) return 'Duyệt áp dụng';
    if (coupon.Status === 3) return 'Ngưng áp dụng';
    return 'Lỗi trạng thái';
  }

  // Kiểm tra giai đoạn
  checkStage(coupon: DTOCoupon) {
    if (coupon.Stage === 0) return 'Chưa có hiệu lực';
    if (coupon.Stage === 1) return 'Đang có hiệu lực';
    if (coupon.Stage === 2) return 'Hết hiệu lực';
    return 'Lỗi giai đoạn';
  }

  // Thao tác paging
  onPageChange(value: any) {
    this.gridState.skip = value.skip;
    this.gridState.take = value.take;
    this.getListCoupon();
  }

  // format date để hiển thị trên giao diện
  formatDateToDisplay(dateTime: Date): string {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // Sự kiện click vào button ... tool box
  onClickToolBox(coupon: DTOCoupon, event: Event) {
    if (this.selectedCouponCode === coupon.Code) {
      this.selectedCouponCode = 0;
    }
    else {
      this.selectedCouponCode = coupon.Code;
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
    if (!(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="9"]')) {
      this.selectedCouponCode = 0;
    }
  }

  // Lấy danh sách các action có thể để chuyển trạng thái
  getListChangeStatus(status: number): DTOStatus[] {
    if (status === 0) return listActionChangeStatusCoupon.filter(item => item.Code === 0 || item.Code === 2);
    if (status === 1) return listActionChangeStatusCoupon.filter(item => item.Code === 1 || item.Code === 3);
    if (status === 2) return listActionChangeStatusCoupon.filter(item => item.Code === 1 || item.Code === 4);
    if (status === 3) return listActionChangeStatusCoupon.filter(item => item.Code === 1);
    return listActionChangeStatusCoupon.filter(item => item.Code === 1);
  }

  // Reset các filter
  resetFilter() {
    // reset trạng thái
    this.childStatus.resetCheckList([
      {
        Code: 0,
        Status: 'Đang tạo khuyến mãi',
        IsChecked: true
      },
      {
        Code: 1,
        Status: 'Đợi duyệt',
        IsChecked: false
      },
      {
        Code: 2,
        Status: 'Duyệt áp dụng',
        IsChecked: false
      },
      {
        Code: 3,
        Status: 'Ngưng áp dụng',
        IsChecked: false
      }
    ]);
    this.filterStatus.filters = [{ field: 'Status', operator: 'eq', value: 0 }];

    // reset giai đoạn
    this.childStage.resetCheckList([{
      Code: 1,
      Status: 'Đang có hiệu lực',
      IsChecked: false
    },
    {
      Code: 2,
      Status: 'Hết hiệu lực',
      IsChecked: false
    }])
    this.filterStage.filters = [{ logic: 'or', filters: [] }];

    // reset tìm kiếm
    this.chidlSearch.clearValue();
    this.filterSearch.value = null;

    // reset datepicker
    this.chidlStartDate.datePicker.writeValue(null);
    this.chidlEndDate.datePicker.writeValue(null);
    this.filterDate.filters = [];

    // reset đối tượng
    this.childGroup.resetValue();
    this.filterGroupCustomer.value = -1;

    // Reset state
    this.gridState.filter.filters = [this.filterStatus];
    this.pageSize = 2;
    this.gridState.skip = 0;
    this.gridState.sort = [
      {
        "field": "Code",
        "dir": "asc"
      }
    ],
      this.gridState.take = this.pageSize;

    this.getListCoupon();
  }

  // Format tiền tệ
  formatCurrency(value: number): string {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
      return 'Invalid value';
    }
  }

  // Cập nhật trạng thái cho khuyến mãi
  updateStatusCoupon(coupon: DTOCoupon, newStatus: any) {
    if (newStatus.value === 0 || newStatus.value === 1) {
      this.selectedCoupon = coupon;
      this.childDrawer.toggle();
      this.bindingDetailCoupon();
      this.reviewCoupon = coupon;
      return;
    }
    if (newStatus.value === 2) coupon.Status = 1;
    if (newStatus.value === 3) coupon.Status = 2;
    if (newStatus.value === 4) coupon.Status = 3;

    const req: DTOUpdateCouponRequest = {
      Coupon: coupon,
      Properties: ['Status']
    }
    console.log(req);
    this.couponService.updateCoupon(req).pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        this.notiService.Show('Cập nhật trạng thái thành công', 'success');
        this.getListCoupon();
      }
    }, (error => {
      this.notiService.Show(`Cập nhật trạng thái bị lỗi ${error}`, 'error');
    }))
  }

  // Đóng drawer
  toggleDrawerToAdd() {
    this.selectedCoupon = {
      Code: -1,
      IdCoupon: '',
      Description: '',
      StartDate: null,
      EndDate: null,
      Quantity: 0,
      RemainingQuantity: 0,
      MinBillPrice: 0,
      MaxBillDiscount: 0,
      Status: 0,
      Stage: 0,
      CouponType: -1,
      DirectDiscount: 0,
      PercentDiscount: 0,
      ApplyTo: -1
    };
    this.childDrawer.toggle();
    this.startDateCoupon = null;
    this.endDateCoupon = null;
    this.selectedCouponType = -1;
    this.reviewCoupon = null;
  }

  // Chọn loại khuyến mãi
  getCouponType(res: DTOCouponType) {
    this.selectedCouponType = res.Code;
    this.childCouponType.value.Code = res.Code;
  }

  // Chọn nhóm khách hàng
  getGroupCustomer(res: DTOGroupCustomer) {
    this.childApplyTo.value.Code = res.Code;
  }

  // Lấy giá trị từ datepicker
  getDateDetailCoupon(value: any, type: string) {
    if (type === 'start') {
      this.startDateCoupon = value;
    }
    if (type === 'end') {
      this.endDateCoupon = value;
    }
  }

  // Binding dữ liệu chi tiết khuyến mãi
  bindingDetailCoupon() {
    this.startDateCoupon = new Date(this.selectedCoupon.StartDate);
    this.endDateCoupon = new Date(this.selectedCoupon.EndDate);
    this.selectedCouponType = this.selectedCoupon.CouponType;
  }

  formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần +1
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Cập nhật chi tiết khuyến mãi
  updateDetailCoupon() {
    if (this.checkUpdatable()) {
      this.reviewCoupon = {
        Code: this.selectedCoupon.Code,
        IdCoupon: this.childIdCoupon.valueTextBox,
        Description: this.childDescription.value,
        StartDate: this.formatDateToString(this.startDateCoupon),
        EndDate: this.formatDateToString(this.endDateCoupon),
        Quantity: parseInt(this.childQuantity.valueTextBox),
        RemainingQuantity: parseInt(this.childRemainingQuantity.valueTextBox),
        MinBillPrice: parseInt(this.childMinBillPrice.valueTextBox),
        MaxBillDiscount: this.childMaxBillPrice ? parseInt(this.childMaxBillPrice.valueTextBox) : null,
        Status: this.selectedCoupon.Status,
        Stage: this.selectedCoupon.Stage,
        CouponType: this.childCouponType.value.Code,
        DirectDiscount: this.childDirectDiscount ? parseInt(this.childDirectDiscount.valueTextBox) : null,
        PercentDiscount: this.childPercentDiscount ? parseInt(this.childPercentDiscount.valueTextBox) : null,
        ApplyTo: this.childApplyTo.value.Code
      }
      const req: DTOUpdateCouponRequest = {
        Coupon: this.reviewCoupon,
        Properties: [
          'IdCoupon',
          'Description',
          'StartDate',
          'EndDate',
          'Quantity',
          'RemainingQuantity',
          'MinBillPrice',
          'MaxBillDiscount',
          'CouponType',
          'DirectDiscount',
          'PercentDiscount',
          'ApplyTo'
        ]
      }
      console.log(req);
      this.couponService.updateCoupon(req).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          this.notiService.Show('Cập nhật thành công', 'success');
          this.toggleDrawerToAdd();
          this.getListCoupon();
        }
        else {
          this.notiService.Show('Lỗi: ' + res.ErrorString, 'error');
        }
      }, err => {
        this.notiService.Show('Lỗi hệ thống ' + err, 'error');
      })
    }
  }

  // Thêm mới khuyến mãi
  addCoupon() {
    if (this.checkUpdatable()) {
      this.reviewCoupon = {
        Code: 0,
        IdCoupon: this.childIdCoupon.valueTextBox,
        Description: this.childDescription.value,
        StartDate: this.formatDateToString(this.startDateCoupon),
        EndDate: this.formatDateToString(this.endDateCoupon),
        Quantity: parseInt(this.childQuantity.valueTextBox),
        RemainingQuantity: parseInt(this.childRemainingQuantity.valueTextBox),
        MinBillPrice: parseInt(this.childMinBillPrice.valueTextBox),
        MaxBillDiscount: this.childMaxBillPrice ? parseInt(this.childMaxBillPrice.valueTextBox) : null,
        Status: this.selectedCoupon.Status,
        Stage: this.selectedCoupon.Stage,
        CouponType: this.childCouponType.value.Code,
        DirectDiscount: this.childDirectDiscount ? parseInt(this.childDirectDiscount.valueTextBox) : null,
        PercentDiscount: this.childPercentDiscount ? parseInt(this.childPercentDiscount.valueTextBox) : null,
        ApplyTo: this.childApplyTo.value.Code
      }
      const req: DTOUpdateCouponRequest = {
        Coupon: this.reviewCoupon,
        Properties: [
          'IdCoupon',
          'Description',
          'StartDate',
          'EndDate',
          'Quantity',
          'RemainingQuantity',
          'MinBillPrice',
          'MaxBillDiscount',
          'CouponType',
          'DirectDiscount',
          'PercentDiscount',
          'ApplyTo'
        ]
      }
      this.couponService.updateCoupon(req).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          this.notiService.Show('Thêm mới khuyến mãi thành công', 'success');
          this.toggleDrawerToAdd();
          this.getListCoupon();
        }
        else {
          this.notiService.Show('Lỗi: ' + res.ErrorString, 'error');
        }
      }, err => {
        this.notiService.Show('Lỗi hệ thống ' + err, 'error');
      })
    }
  }

  // Cập nhật trạng thái bên trong drawer
  updateStatusDrawer(res: any) {
    if (res.value === 1 && !this.checkUpdatable()) {
      this.notiService.Show('Vui lòng nhập đủ thông tin để gửi duyệt', 'error');
      return;
    }

    if (this.checkUpdatable()) {
      const buildCoupon = (): DTOCoupon => ({
        Code: this.selectedCoupon.Code === -1 ? 0 : this.selectedCoupon.Code,
        IdCoupon: this.childIdCoupon.valueTextBox,
        Description: this.childDescription.value,
        StartDate: this.formatDateToString(this.startDateCoupon),
        EndDate: this.formatDateToString(this.endDateCoupon),
        Quantity: parseInt(this.childQuantity.valueTextBox),
        RemainingQuantity: parseInt(this.childRemainingQuantity.valueTextBox),
        MinBillPrice: parseInt(this.childMinBillPrice.valueTextBox),
        MaxBillDiscount: this.childMaxBillPrice ? parseInt(this.childMaxBillPrice.valueTextBox) : null,
        Status: res.value,
        Stage: this.selectedCoupon.Stage,
        CouponType: this.childCouponType.value.Code,
        DirectDiscount: this.childDirectDiscount ? parseInt(this.childDirectDiscount.valueTextBox) : null,
        PercentDiscount: this.childPercentDiscount ? parseInt(this.childPercentDiscount.valueTextBox) : null,
        ApplyTo: this.childApplyTo.value.Code
      });

      this.reviewCoupon = buildCoupon();

      const req: DTOUpdateCouponRequest = {
        Coupon: this.reviewCoupon,
        Properties: [
          'IdCoupon', 'Description', 'StartDate', 'EndDate',
          'Quantity', 'RemainingQuantity', 'MinBillPrice',
          'MaxBillDiscount', 'CouponType', 'DirectDiscount',
          'PercentDiscount', 'ApplyTo', 'Status'
        ]
      };

      this.couponService.updateCoupon(req).subscribe(
        (res: DTOResponse) => {
          if (res.StatusCode === 0) {
            this.notiService.Show('Cập nhật thành công', 'success');
            this.toggleDrawerToAdd();
            this.getListCoupon();
          } else {
            this.notiService.Show('Lỗi: ' + res.ErrorString, 'error');
          }
        },
        err => {
          this.notiService.Show('Lỗi hệ thống ' + err, 'error');
        }
      );
    }
  }

  // Lấy số lượng và set số lượng còn lại bằng số lượng
  getQuantityCoupon(res: any) {
    this.childRemainingQuantity.valueTextBox = this.childQuantity.valueTextBox;
  }

  // Kiểm tra các thông tin trước khi cập nhật 1 coupon
  checkUpdatable() {
    if (!this.childIdCoupon.valueTextBox) {
      this.notiService.Show('Vui lòng điền mã khuyến mãi', 'error');
      return false;
    }
    if (this.childStartDateCoupon === null) {
      this.notiService.Show('Vui lòng chọn ngày bắt đầu khuyến mãi', 'error');
      return false;
    }
    if (this.childEndDateCoupon === null) {
      this.notiService.Show('Vui lòng chọn ngày kết thúc khuyến mãi', 'error');
      return false;
    }
    if (this.childQuantity.valueTextBox === '0') {
      this.notiService.Show('Vui lòng nhập thêm số lượng khuyến mãi', 'error');
      return false;
    }
    if (this.childMinBillPrice.valueTextBox === '0') {
      this.notiService.Show('Vui lòng nhập số tiền tối thiểu áp dụng', 'error');
      return false;
    }
    if (this.childCouponType.value.Code === -1) {
      this.notiService.Show('Vui lòng chọn loại khuyến mãi', 'error');
      return false;
    }
    if (this.childCouponType.value.Code === 0) {
      if (this.childMaxBillPrice.valueTextBox === '0') {
        this.notiService.Show('Vui lòng nhập giảm tối đa', 'error');
        return false;
      }
      if (this.childPercentDiscount.valueTextBox === '0') {
        this.notiService.Show('Vui lòng nhập phần trăm giảm giá', 'error');
        return false;
      }
    }
    if (this.childCouponType.value.Code === 1) {
      if (this.childDirectDiscount.valueTextBox === '0') {
        this.notiService.Show('Vui lòng nhập số tiền giảm trực tiếp', 'error');
        return false;
      }
    }
    if (this.childApplyTo.value.Code === -1) {
      this.notiService.Show('Vui lòng chọn nhóm khách hàng', 'error');
      return false;
    }
    return true;
  }
}
