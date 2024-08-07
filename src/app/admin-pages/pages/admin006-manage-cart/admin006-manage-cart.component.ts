import { listAction } from './../../shared/dto/DTOStatus.dto';

import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DTOStatus, listStatus, filteredStatusList } from '../../shared/dto/DTOStatus.dto';
import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';
import { GridDataResult, SelectionEvent } from '@progress/kendo-angular-grid';
import { BillService } from 'src/app/admin-pages/shared/service/bill.service'
import { catchError, takeUntil } from 'rxjs/operators';
import { of, ReplaySubject } from 'rxjs';
import { TextDropdownComponent } from 'src/app/shared/component/text-dropdown/text-dropdown.component';
import { formatDate } from '@progress/kendo-angular-intl';
import { DTOBill } from '../../shared/dto/DTOBill.dto';
import { DTOBillInfo } from '../../shared/dto/DTOBillInfo.dto';
import { DTOUpdateBillRequest } from '../../shared/dto/DTOUpdateBillRequest.dto';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { SearchBarComponent } from 'src/app/shared/component/search-bar/search-bar.component';
import { DatepickerComponent } from '../../shared/component/datepicker/datepicker.component';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { LayoutService } from '../../shared/service/layout.service';
import { Router } from '@angular/router';
import { DTOProcessToPayment } from 'src/app/ecom-pages/shared/dto/DTOProcessToPayment';
import { DTOUpdateBill } from '../../shared/dto/DTOUpdateBill.dto';
import { isValidNumber } from 'src/app/shared/utils/utils';
import { StaffService } from '../../shared/service/staff.service';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';

@Component({
  selector: 'app-admin006-manage-cart',
  templateUrl: './admin006-manage-cart.component.html',
  styleUrls: ['./admin006-manage-cart.component.scss']
})
export class Admin006ManageCartComponent implements OnInit, OnDestroy {

  currentDate: Date = new Date();
  minDate: Date = new Date(1900, 1, 1);
  maxDate: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  startDate: Date = this.currentDate;
  endDate: Date = this.currentDate;
  listAction: DTOStatus[] = listAction;
  listFilterStatus: DTOStatus[] = filteredStatusList;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  listBillPage: GridDataResult;
  listBillAllDate: GridDataResult;
  listBillWaitingAllDate: GridDataResult;
  listBillNowDate: GridDataResult;
  pageSize: number = 5;
  listPageSize: number[] = [5, 10, 15];
  idButton: number;
  isClickButton: { [key: number]: boolean } = {};
  tempID: number;
  valueSearch: string;
  valueMulti: DTOStatus[] = [
    {
      Code: 1,
      Status: "Chờ xác nhận",
      Icon: "fa-share",
      IsChecked: false,
    }
  ];
  listNextStatus: DTOStatus[];
  isShowAlert: boolean = false;
  isAdd: boolean = false;
  iconPopUp: string;
  objItemStatus: any;
  itemBill: DTOBill;
  listBillNew: DTOBill[];
  statusCounts: { [key: number]: number } = {};
  // statusCountsAllDate: { [key: number]: number } = {};
  statusCountsAllDate: { [statusCode: string]: { count: number; earliestDate: string } } = {};
  listBillPageAllStatus: GridDataResult;
  reasonFail: string = "";
  isDetail: boolean = false;
  listBillInfo: DTOBillInfo[];
  isShowAlertStatus: boolean = false;
  countBillWaiting: number = 0;
  countBillNowDate: number = 0;
  earliestDate: string;
  nowDate: string;
  earliestDates: Date;
  obj = document.getElementsByClassName("numberCount");
  resultAdd: number = 1;

  // defaultItemStatusBill: DTOStatus = {
  //   Code: -1,
  //   Status: '-- Trạng thái --',
  //   Icon: "",
  //   IsChecked: false,
  // }
  // variable CompositeFilterDescriptor
  filterDate: CompositeFilterDescriptor = {
    logic: 'and', filters: [
      { field: 'CreateAt', operator: 'gte', value: this.toLocalString(this.startDate, 'start') },
      { field: 'CreateAt', operator: 'lte', value: this.toLocalString(this.endDate, 'end') }
    ]
  };
  filterStatus: CompositeFilterDescriptor = {
    logic: 'or', filters: [
      { field: 'Status', operator: 'eq', value: 1 }
    ]
  };
  filterSearch: CompositeFilterDescriptor = { logic: 'or', filters: [] };

  // variable ViewChild
  @ViewChild('rangeDateStart') childRangeDateStart!: DatepickerComponent;
  @ViewChild('rangeDateEnd') childRangeDateEnd!: DatepickerComponent;
  @ViewChild('multielect') childStatus!: MultiSelectComponent;
  @ViewChild('search') childSearch!: SearchBarComponent;

  isLoading: boolean = true;
  gridState: State = {
    skip: 0,
    take: this.pageSize,
    sort: [
      {
        field: "Code",
        dir: "asc"
      }
    ],
    filter: {
      logic: "and",
      filters: [
        this.filterStatus,
        this.filterDate
      ]
    }
  }

  gridStateAllStatus: State = {
    skip: 0,
    sort: [
      {
        field: "Code",
        dir: "asc"
      }
    ],
    filter: {
      logic: "and",
      filters: [
        this.filterDate
      ]
    }
  }

  gridStateAllDate: State = {
    skip: 0,
    sort: [
      {
        field: "Code",
        dir: "asc"
      }
    ],
    filter: {
      logic: "and",
      filters: [
      ]
    }
  }

  gridStateWaitingAllDate: State = {
    skip: 0,
    sort: [
      {
        field: "Code",
        dir: "asc"
      }
    ],
    filter: {
      logic: "and",
      filters: [
        { field: 'Status', operator: 'eq', value: 1 }
      ]
    }
  }

  gridStateBillNowDate: State = {
    skip: 0,
    sort: [
      {
        field: "Code",
        dir: "asc"
      }
    ],
    filter: {
      logic: "and",
      filters: [
        { field: 'CreateAt', operator: 'gte', value: this.toLocalString(this.startDate, 'start') },
        { field: 'CreateAt', operator: 'lte', value: this.toLocalString(this.endDate, 'end') }
      ]
    }
  }


  // Role của tài khoản đang được đăng nhập
  permission: string;
  listPermissionAvaiable: string[] = ['Admin', 'BillManager'];


  constructor(private billService: BillService,
    private notiService: NotiService,
    private staffService: StaffService,
  ) { }
  ngOnInit(): void {
    this.getPermission();
    this.getListBill();
    this.setFilterExpStatus();
    this.getListBillNowDate();
    this.getListBillWaitingAllDate();
    this.isShowAlertStatus = !this.isShowAlertStatus;

  }

  // Lấy quyền truy cập
  getPermission() {
    this.staffService.getCurrentStaffInfo().pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        const staff: DTOStaff = res.ObjectReturn.Data[0];
        this.permission = staff.Permission;
      }
    })
  }

  // Kiểm tra có permission có thể truy cập hay không
  checkPermission() {
    if (this.listPermissionAvaiable.includes(this.permission)) {
      return true;
    }
    return false;
  }

  log() {
    console.log(this.listBillAllDate);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  getDateFromDatePicker(value: any, type: string) {
    if (type === 'start') {
      this.startDate = value;
    }
    if (type === 'end') {
      this.endDate = value;
    }
    this.setFilterDate();
  }

  formatDateTime(date: Date, type: string) {
    if (type === 'start') {
      return date.toISOString().split('T')[0] + 'T00:00:00';
      // return date.setTime(0);
    }
    else {
      return date.toISOString().split('T')[0] + 'T23:59:59';
    }
  }

  toLocalString(date: Date, type: string) {
    const year = date?.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let hours, minutes, seconds;
    if (type === 'start') {
      hours = '00';
      minutes = '00';
      seconds = '00';
    } else {
      hours = '23';
      minutes = '59';
      seconds = '59';
    }
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }



  formattedCreateAt(createAt: any) {
    const date = new Date(createAt);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toTimeString().split(' ')[0];

    return `${day}/${month}/${year} - ${time}`;
  }

  formattedCreateAtNoTime(createAt: any) {
    const date = new Date(createAt);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toTimeString().split(' ')[0];

    return `${day}/${month}/${year}`;
  }


  formatCurrency(value: number): string {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
      return 'Invalid value';
    }
  }

  formatPaymentMethod(value: any): string {
    if (value == 0) {
      return 'Ship COD';
    } else if (value == 1) {
      return 'QR Payment';
    } else if (value == 2) {
      return 'Bank Transfer';
    } else {
      return 'Unknown';
    }
  }

  formatStatus(value: any): string {
    switch (value) {
      case 1:
        return 'Chờ xác nhận';
      case 2:
        return 'Đơn hàng bị hủy';
      case 3:
        return 'Không xác nhận';
      case 4:
        return 'Đã xác nhận';
      case 5:
        return 'Đang đóng gói';
      case 6:
        return 'Đã đóng gói';
      case 7:
        return 'Đang vận chuyển';
      case 8:
        return 'Giao hàng thành công';
      case 9:
        return 'Giao hàng thất bại';
      case 10:
        return 'Đơn hàng đang trả về';
      case 11:
        return 'Xác nhận đã nhận hàng';
      case 12:
        return 'Đã hoàn tiền';
      case 13:
        return 'Không hoàn tiền';
      case 14:
        return 'Yêu cầu đổi trả hàng';
      case 16:
        return 'Xác nhận đổi trả';
      case 17:
        return 'Chờ thanh toán';
      case 20:
        return 'Từ chối đổi hàng';
      case 21:
        return 'Từ chối trả hàng';
      case 22:
        return 'Hoàn tất đơn hàng';
      default:
        return 'Unknow';
    }
  }

  onSelectionChange(event: SelectionEvent): void {
    const selectedDataItems = event.selectedRows.map(row => row.dataItem);

    if (selectedDataItems.length > 0) {
      const selectedCodes = selectedDataItems.map(item => item.Code).join(', ');
      // alert(`Mã đơn hàng được chọn: ${selectedCodes}`);
    }
  }


  ClickButtonAction(id: number, event: Event, idStatus: number) {
    const action = this.listAction.find(action => action.Code === idStatus);
    this.listNextStatus = action ? action.ListNextStatus : null;

    if (this.tempID !== id) {
      this.isClickButton[this.tempID] = false;
    }

    this.isClickButton[id] = !this.isClickButton[id];

    this.tempID = id;

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
    if (this.tempID !== null && !(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="9"]')) {
      this.isClickButton[this.tempID] = false;
    }
    if ((this.isShowAlert == true || this.isShowAlertStatus == true) && ((event.target as HTMLElement).closest('.buttonNoChange'))) {
      this.getListBillWaitingAllDate();
      this.setFilterExpStatus();
      this.isShowAlert = false;
      this.isShowAlertStatus = false;
    }
    if ((this.isDetail == true || this.isAdd == true) && ((event.target as HTMLElement).closest('#icon-back'))) {
      this.getListBill();
      this.setFilterExpStatus();
      this.getListBillWaitingAllDate();

      const detailCartElement = document.querySelector('.component-detail-cart');
      if (detailCartElement) {
        detailCartElement.classList.add('slide-back');
        setTimeout(() => {
          detailCartElement.classList.remove('slide-back');
          this.isDetail = false;
          this.isAdd = false;
        }, 200);

      }
    }
    if (this.isShowAlertStatus == true && ((event.target as HTMLElement).closest('.buttonAccept'))) {
      this.getListBillWaitingAllDate();
      this.childRangeDateStart.defaultDate = this.earliestDates;
      this.startDate = this.earliestDates;
      this.setFilterDate();
      this.isShowAlertStatus = false;

    }

    if ((event.target as HTMLElement).closest('.buttonAccept')) {
      this.isLoading = true;
      setTimeout(() => {
        if (this.resultAdd == 0) {
          this.getListBill();
          this.setFilterExpStatus();
          this.getListBillWaitingAllDate();
          setTimeout(() => {
            this.isDetail = false;
            this.resultAdd = 1;
          }, 500);
        }
      }, 1500);
      this.isLoading = false;
    }

    if ((event.target as HTMLElement).closest('.button-add')) {
      this.isAdd = !this.isAdd;
    }
    if ((event.target as HTMLElement).closest('.button-addBill')) {
      this.isLoading = true;
      setTimeout(() => {
        console.log(this.resultAdd);
        if (this.resultAdd == 0) {
          this.getListBill();
          this.setFilterExpStatus();
          this.getListBillNowDate();
          this.getListBillWaitingAllDate();
          setTimeout(() => {
            this.isAdd = false;
            this.resultAdd = 1;
          }, 500);
        }
      }, 2000);
      this.isLoading = false;
    }
  }


  // Thao tác paging
  onPageChange(value: any) {
    this.gridState.skip = value.skip;
    this.gridState.take = value.take;
    this.getListBill();
  }

  // Lấy danh sách các bill
  getListBill() {
    this.isLoading = true;
    this.billService.getListBill(this.gridState).pipe(takeUntil(this.destroy)).subscribe(list => {
      const typeDTOBill: DTOBill[] = list.ObjectReturn.Data;
      this.listBillPage = { data: typeDTOBill, total: list.ObjectReturn.Total };
      this.isLoading = false;
    })
    // console.log(this.gridState)
  }

  //Lấy danh sách bill chờ xác nhận
  getListBillWaitingAllDate() {
    this.billService.getListBill(this.gridStateWaitingAllDate).pipe(takeUntil(this.destroy)).subscribe(list => {
      this.listBillWaitingAllDate = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      this.countBillWaiting = this.listBillWaitingAllDate.data.length;
      this.findEarliestDate();
    })

    this.billService.getListBill(this.gridStateAllDate).pipe(takeUntil(this.destroy)).subscribe(list => {
      this.listBillAllDate = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      this.countStatuses();
    })

  }

  getListBillNowDate() {
    this.isLoading = true;
    this.billService.getListBill(this.gridStateBillNowDate).pipe(takeUntil(this.destroy)).subscribe(list => {
      this.listBillNowDate = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      this.countBillNowDate = this.listBillNowDate.data.length;
      this.isLoading = false;
    })
  }

  //Tìm ngày xa nhất của status Chờ xác nhận
  findEarliestDate() {
    if (!this.listBillWaitingAllDate.data || this.listBillWaitingAllDate.data.length === 0) {
      return null;
    }

    const earliestDate = this.listBillWaitingAllDate.data.reduce((earliest, bill) => {
      const createDate = new Date(bill.CreateAt);
      return createDate < earliest ? createDate : earliest;
    }, new Date(this.listBillWaitingAllDate.data[0].CreateAt));

    this.earliestDate = this.formattedCreateAtNoTime(earliestDate);
    this.earliestDates = earliestDate;
    this.nowDate = this.formattedCreateAtNoTime(this.endDate);
    // console.log(this.formattedCreateAtNoTime(earliestDate));

    return earliestDate;
  }


  countStatuses() {
    if (this.listBillPageAllStatus) {
      this.statusCounts = this.listBillPageAllStatus.data.reduce((acc, bill) => {
        const status = bill.Status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
    }

    if (this.listBillAllDate) {
      this.statusCountsAllDate = this.listBillAllDate.data.reduce((acc, bill) => {
        const status = bill.Status;
        const date = bill.CreateAt;

        if (!acc[status]) {
          acc[status] = { count: 0, earliestDate: date };
        }

        acc[status].count += 1;

        if (new Date(date) < new Date(acc[status].earliestDate)) {
          acc[status].earliestDate = date;
        }

        return acc;
      }, {});
      // console.log(this.formattedCreateAtNoTime(this.statusCountsAllDate[3].earliestDate));
    }
  }

  //Lowcase string
  normalizeString(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  /**
 * 
 * @param filter 
 * @param field là field trong DTO
 * @param operator là phép so sánh field với value
 * @param valueField là trường Tên textfield của DTO được lấy từ dropdown
 * @param value là giá trị được get từ dropdown, là 1 object
 */
  setFilterProperty(filter: FilterDescriptor, field: string, operator: string, valueField: any, value: any) {
    filter.field = field;
    filter.operator = operator;
    filter.value = value[valueField];
    filter.ignoreCase = true;
    this.setFilterData();
  }

  // Set filter dropdown date
  setFilterDate() {
    this.filterDate.filters = [];
    const filterFrom: FilterDescriptor = { field: 'CreateAt', operator: 'gte', value: this.toLocalString(this.startDate, 'start') };
    this.filterDate.filters.push(filterFrom);
    const filterTo: FilterDescriptor = { field: 'CreateAt', operator: 'lte', value: this.toLocalString(this.endDate, 'end') };
    this.filterDate.filters.push(filterTo);
    this.setFilterData();
    this.setFilterExpStatus();
  }

  // Set filter status
  setFilterStatus(value: any) {
    this.filterStatus.filters = [];
    value.forEach((item: DTOStatus) => {
      this.filterStatus.filters.push({ field: 'Status', operator: 'eq', value: item.Code })
    })
    this.setFilterData();
  }

  // Set filter search
  setFilterSearch(value: any) {
    this.valueSearch = value;
    this.filterSearch.filters = [];
    this.filterSearch.filters.push({ field: 'CustomerName', operator: 'contains', value: this.valueSearch, ignoreCase: true });
    this.filterSearch.filters.push({ field: 'OrdererPhoneNumber', operator: 'contains', value: this.valueSearch, ignoreCase: true });
    this.setFilterData();
    this.setFilterExpStatus();
  }

  // Set filter tất cả
  setFilterData() {
    this.gridState.skip = 0;
    this.gridState.filter.filters = [];
    this.pushToGridState(null, this.filterDate);
    this.pushToGridState(null, this.filterStatus);
    this.pushToGridState(null, this.filterSearch);
    this.pushTogridStateAllStatus(null, this.filterDate);
    this.pushTogridStateAllStatus(null, this.filterSearch);
    this.getListBill();
    this.countStatuses();
  }

  setFilterExpStatus() {
    this.billService.getListBill(this.gridStateAllStatus).pipe(takeUntil(this.destroy)).subscribe(list => {
      this.listBillPageAllStatus = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      this.countStatuses();
    })
    // console.log(this.gridStateAllStatus);
  }

  // Push filter vào gridState
  pushToGridState(filter: FilterDescriptor, comFilter: CompositeFilterDescriptor) {
    if (filter) {
      if (filter.value && filter.value !== -1) {
        this.gridState.filter.filters.push(filter);
      }
    }
    else if (comFilter) {
      if (comFilter.filters.length > 0) {
        this.gridState.filter.filters.push(comFilter);
      }
    }
  }

  // Push filter vào gridStateAllStatus
  pushTogridStateAllStatus(filter: FilterDescriptor, comFilter: CompositeFilterDescriptor) {
    if (filter) {
      if (filter.value && filter.value !== -1) {
        this.gridStateAllStatus.filter.filters.push(filter);
      }
    }
    else if (comFilter) {
      if (comFilter.filters.length > 0) {
        this.gridStateAllStatus.filter.filters.push(comFilter);
      }
    }
  }

  // Reset tất cả các filter
  resetFilter() {

    this.childRangeDateStart.resetDate();
    this.childRangeDateEnd.resetDate();

    this.valueMulti = []
    this.filterStatus.filters = []

    this.valueSearch = '';
    this.childSearch.valueSearch = '';
    this.filterSearch.filters = [];

    // Reset state
    this.gridState.filter.filters = [];
    this.gridStateAllStatus.filter.filters = [];

    this.pageSize = 4;
    this.gridState.skip = 0;
    this.gridState.sort = [
      {
        "field": "Code",
        "dir": "asc"
      }
    ],
      this.gridState.take = this.pageSize;
    this.filterDate.filters = [
      { field: 'CreateAt', operator: 'gte', value: this.toLocalString(new Date(), 'start') },
      { field: 'CreateAt', operator: 'lte', value: this.toLocalString(new Date(), 'end') }
    ]
    this.pushToGridState(null, this.filterDate);
    this.pushToGridState(null, this.filterStatus);
    this.pushToGridState(null, this.filterSearch);
    this.pushTogridStateAllStatus(null, this.filterDate);
    this.getListBill();
    this.setFilterExpStatus();
  }

  //Check show alert
  clickDropDownAction(item: DTOBill, value: any) {
    this.itemBill = item;
    this.objItemStatus = value
    this.listBillInfo = item.ListBillInfo;
    if (this.objItemStatus.value == 0) {
      console.log(this.itemBill);
      this.isDetail = !this.isDetail;
    } else {
      this.isShowAlert = !this.isShowAlert
    }
  }

  //Nhận lí do của text-area
  receive(value: any) {
    this.reasonFail = value;

  }

  //Nhận result của add Bill
  getResultAdd(result: number) {
    console.log(result + " resultAdd");
    this.resultAdd = result;
  }

  // Update status bill
  updateStatusBill(bill: DTOBill, obj: any) {
    if (obj.value >= 1) {
      let requestUpdateBill: DTOUpdateBill;
      if (obj.value == 3 || obj.value == 9 || obj.value == 13 || obj.value == 20 || obj.value == 21) {
        if (this.reasonFail) {
          requestUpdateBill = {
            CodeBill: bill.Code,
            Status: obj.value,
            ListOfBillInfo: bill.ListBillInfo,
            Note: this.reasonFail,
            TotalBill: bill.TotalBill
          }
        } else {
          this.notiService.Show("Vui lòng nhập lí do", "warning")
          return;
        }
      } else {
        requestUpdateBill = {
          CodeBill: bill.Code,
          Status: obj.value,
          ListOfBillInfo: bill.ListBillInfo,
          Note: bill.Note,
          TotalBill: bill.TotalBill
        }
      }


      if (requestUpdateBill) {
        // if(obj.value == 22){
          // let timeDifference = this.currentDate.getTime() - bill.CreateAt.getTime();
          // const hoursDifference = timeDifference / (1000 * 60 * 60);
          // if(hoursDifference >= 24){
            requestUpdateBill.ListOfBillInfo.forEach(billInf => {
              billInf.Status = obj.value;
            });
            
            const request: DTOUpdateBillRequest = {
              DTOUpdateBill: requestUpdateBill,
              DTOProceedToPayment: null
            }

            this.isLoading = true;
            this.billService.updateBill(request).subscribe((res: DTOResponse) => {
              if (res.StatusCode === 0) {
                bill.Status = obj.value;
                this.notiService.Show("Cập nhật trạng thái thành công", "success")
                this.getListBillWaitingAllDate();
                this.getListBill();
                this.setFilterExpStatus();
                this.isShowAlert = false;
                this.isLoading = false;
              }
            }, error => {
              console.error('Error:', error);
            });
          // } else {
          //   this.notiService.Show("Thời gian tạo đơn chưa đủ 24 tiếng", "success")
          // }
        // }
      }
    }
  }

  showAlertAllDate() {
    this.isShowAlertStatus = !this.isShowAlertStatus;
  }

  returnNowDate() {
    this.startDate = this.currentDate;
    this.endDate = this.currentDate;
    this.setFilterDate();
  }


  test(obj: any) {
    console.log(obj);
  }


}
