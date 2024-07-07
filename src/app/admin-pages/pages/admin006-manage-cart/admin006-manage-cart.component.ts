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
  listStatus: DTOStatus[] = listStatus;
  listFilterStatus: DTOStatus[] = filteredStatusList;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  listBillPage: GridDataResult;
  listBillAllDate: GridDataResult;
  listBillWaitingAllDate: GridDataResult;
  listBillNowDate: GridDataResult;
  pageSize: number = 4;
  listPageSize: number[] = [1, 2, 3, 4];
  idButton: number;
  isClickButton: { [key: number]: boolean } = {};
  tempID: number;
  valueSearch: string;
  valueMulti: DTOStatus[] = [
    {
      Code: 2,
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
      { field: 'Status', operator: 'eq', value: 2 }
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
        { field: 'Status', operator: 'eq', value: 2 }
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





  constructor(private billService: BillService,
    private notiService: NotiService,
    private layoutService: LayoutService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.getListBill();
    this.setFilterExpStatus();
    this.getListBillNowDate();
    this.getListBillWaitingAllDate();
    this.isShowAlertStatus = !this.isShowAlertStatus;

  }

  log(){
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
    const year = date.getFullYear();
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

  onSelectionChange(event: SelectionEvent): void {
    const selectedDataItems = event.selectedRows.map(row => row.dataItem);

    if (selectedDataItems.length > 0) {
      const selectedCodes = selectedDataItems.map(item => item.Code).join(', ');
      // alert(`Mã đơn hàng được chọn: ${selectedCodes}`);
    }
  }


  ClickButtonAction(id: number, event: Event, idStatus: number) {
    const status = this.listStatus.find(status => status.Code === idStatus);
    this.listNextStatus = status ? status.ListNextStatus : null;

    if (this.tempID !== id) {
      this.isClickButton[this.tempID] = false;
    }

    this.isClickButton[id] = !this.isClickButton[id];

    this.tempID = id;

    // Remove 'active' class from all cells
    const cells = document.querySelectorAll('td.k-table-td[aria-colindex="10"]');
    cells.forEach(cell => cell.classList.remove('active'));

    // Add 'active' class to the clicked cell
    const cell = (event.target as HTMLElement).closest('td.k-table-td[aria-colindex="10"]');
    if (cell) {
      cell.classList.add('active');
    }
  }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.tempID !== null && !(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="10"]')) {
      this.isClickButton[this.tempID] = false;
    }
    if ((this.isShowAlert == true || this.isShowAlertStatus == true) && ((event.target as HTMLElement).closest('.buttonNoChange'))) {
      this.getListBillWaitingAllDate();
      this.setFilterExpStatus();
      this.isShowAlert = false;
      this.isShowAlertStatus = false;
    }
    if ((this.isDetail == true || this.isAdd == true) && ((event.target as HTMLElement).closest('#icon-back'))) {
      this.isDetail = false;
      this.isAdd = false;
      this.getListBill();
      this.setFilterExpStatus();
      this.getListBillWaitingAllDate();
    }
    if (this.isShowAlertStatus == true && ((event.target as HTMLElement).closest('.buttonReturnDate'))) {
      this.getListBillWaitingAllDate();
      this.childRangeDateStart.defaultDate = this.earliestDates;
      this.startDate = this.earliestDates;
      this.setFilterDate();
      this.isShowAlertStatus = false;
    }
    if((event.target as HTMLElement).closest('.button-add')){
      this.isAdd = !this.isAdd;
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
      this.listBillPage = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      // console.log(this.listBillPage.data);   
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
      if(this.listBillPageAllStatus){
        this.statusCounts = this.listBillPageAllStatus.data.reduce((acc, bill) => {
          const status = bill.Status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
      }
  
      if(this.listBillAllDate){
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
        console.log(this.formattedCreateAtNoTime(this.statusCountsAllDate[3].earliestDate));
      }
      
    // this.animateValue(this.obj,this.statusCounts[2], 50000);
    // console.log(typeof(this.statusCounts[2]));

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
    this.filterSearch.filters.push({ field: 'PhoneNumber', operator: 'contains', value: this.valueSearch, ignoreCase: true });
    this.setFilterData();
    this.setFilterExpStatus();
  }

  // Set filter tất cả
  setFilterData() {
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
    this.filterDate.filters= [
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
    if (this.objItemStatus.value == 1) {
        this.isDetail = !this.isDetail;
    } else{
      this.isShowAlert = !this.isShowAlert
    }
  }

  //Nhận text của text-area
  receive(value: any){
    this.reasonFail = value;
  }

  // Update status bill
  updateStatusBill(bill: DTOBill, obj: any) {
    if (obj.value >= 2) {
      bill.Status = obj.value;
      const requestUpdateBill: DTOUpdateBill = {
        CodeBill: bill.Code,
        Status: obj.value,
        ListOfBillInfo: bill.ListBillInfo,
        Note: this.reasonFail,
      }

      requestUpdateBill.ListOfBillInfo.forEach(billInf => {
        billInf.Status = obj.value;
      });

      const request: DTOUpdateBillRequest = {
        DTOUpdateBill: requestUpdateBill,
        DTOProceedToPayment: null
      }
      this.billService.updateBill(request).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          this.notiService.Show("Cập nhật trạng thái thành công", "success")
          this.getListBillWaitingAllDate();
          this.getListBill();
          this.setFilterExpStatus();
          this.isShowAlert = false;
        }
      }, error => {
        console.error('Error:', error);
      });
    }
  }

  showAlertAllDate(){
    this.isShowAlertStatus = !this.isShowAlertStatus;
  }

  returnNowDate(){
    this.startDate = this.currentDate;
    this.endDate = this.currentDate;
    this.setFilterDate();
  }

 
  test(obj: any) {
    console.log(obj);
  }


}
