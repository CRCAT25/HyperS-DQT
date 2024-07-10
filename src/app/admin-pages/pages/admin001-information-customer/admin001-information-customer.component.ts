import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../shared/service/account.service';
import { DTOCustomer } from 'src/app/shared/dto/DTOCustomer.dto';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridDataResult, RowArgs, SelectionEvent } from '@progress/kendo-angular-grid';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { TextInputComponent } from 'src/app/shared/component/text-input/text-input.component';
import { TextDropdownComponent } from 'src/app/shared/component/text-dropdown/text-dropdown.component';
import { DatepickerComponent } from '../../shared/component/datepicker/datepicker.component';
import { ImportImageComponent } from '../../shared/component/import-image/import-image.component';
import { DTOImageProduct } from 'src/app/ecom-pages/shared/dto/DTOImageProduct';

interface Gender {
  Code: number
  Gender: string
  IsChecked?: boolean
}

@Component({
  selector: 'app-admin001-information-customer',
  templateUrl: './admin001-information-customer.component.html',
  styleUrls: ['./admin001-information-customer.component.scss']
})
export class Admin001InformationCustomerComponent implements OnInit, OnDestroy {
  // variable Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  // variables
  isLoading: boolean = true;
  currentDate: Date = new Date();
  minDate: Date = new Date(1900, 1, 1);
  maxDate: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  pageSize: number = 2;
  codeCustomerSelected: number;
  valueSearch: string;

  // variable Statistics
  valueTotalCustomer: number = 100;
  valueTotalCustomerActive: number = 50;
  valueTotalCustomerDisable: number = 50;

  // variables list
  listOriginCustomer: DTOCustomer[] = [];
  listGender: Gender[] = [
    {
      Code: 0,
      Gender: 'Nam',
    },
    {
      Code: 1,
      Gender: 'Nữ',
    }
  ];
  listCustomer: GridDataResult;
  listPageSize: number[] = [2, 3, 4];
  selectedCodeCustomer: number[];

  // variables object
  defaultGender: Gender = {
    Code: -1,
    Gender: '-- Giới tính --',
  }
  imageNull: DTOImageProduct = new DTOImageProduct();

  // variable State
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

  // variables FilterDescriptor
  filterAllCustomer: FilterDescriptor = { "field": "StatusAccount", "operator": "gte", "value": 0, "ignoreCase": true };
  filterCustomerActive: FilterDescriptor = { "field": "StatusAccount", "operator": "eq", "value": 0, "ignoreCase": true };
  filterCustomerDisable: FilterDescriptor = { "field": "StatusAccount", "operator": "eq", "value": 1, "ignoreCase": true };

  // variable CompositeFilterDescriptor
  filterAllStatistics: CompositeFilterDescriptor = { logic: 'or', filters: [this.filterAllCustomer] };
  filterSearch: CompositeFilterDescriptor = { logic: 'or', filters: [] };

  // variables ViewChild
  @ViewChild('id') childId!: TextInputComponent;
  @ViewChild('name') childName!: TextInputComponent;
  @ViewChild('email') childEmail!: TextInputComponent;
  @ViewChild('phonenumber') childPhoneNumber!: TextInputComponent;
  @ViewChild('gender') childGender!: TextDropdownComponent;
  @ViewChild('birthday') childBirthday!: DatepickerComponent;
  @ViewChild('image') childImage!: ImportImageComponent;

  constructor(private accountService: AccountService, private notiService: NotiService) { }

  ngOnInit(): void {
    this.getListCustomer();
    this.getStatistics();
  }

  // Lấy danh sách khách hàng
  getListCustomer() {
    this.isLoading = true;
    this.accountService.getListCustomer(this.gridState).pipe(takeUntil(this.destroy)).subscribe(list => {
      this.listCustomer = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      this.isLoading = false;
    })
  }

  // Lấy các thống kê về sản phẩm
  getStatistics() {
    let state: State = { filter: { logic: "and", filters: [] } };

    // Đối với tổng số khách hàng
    this.filterStatistics(state, (total) => this.valueTotalCustomer = total);

    // Đối với tổng số tài khoản hoạt động
    state.filter.filters = [this.filterCustomerActive]
    this.filterStatistics(state, (total) => this.valueTotalCustomerActive = total);

    // Đối với tổng số tài khoản bị vô hiệu hóa
    state.filter.filters = [this.filterCustomerDisable]
    this.filterStatistics(state, (total) => this.valueTotalCustomerDisable = total);
  }

  /**
 * Dùng để filter các statistics
 * @param state State để filter
 * @param filter FilterDescriptor
 * @param callback Hàm callback để cập nhật giá trị sau khi có ObjectReturn.Total
 */
  filterStatistics(state: State, callback: (total: number) => void) {
    this.accountService.getListCustomer(state).pipe(takeUntil(this.destroy)).subscribe((obj: DTOResponse) => {
      callback(obj.ObjectReturn.Total);
    });
  }

  // Kiểm tra giới tính
  checkGender(idGender: number) {
    if (idGender === 0) return 'Nam';
    if (idGender === 1) return 'Nữ';
    return 'Lỗi giới tính';
  }

  // Kiểm tra trạng thái
  checkStatus(status: number) {
    if (status === 0) return 'Hoạt động';
    if (status === 1) return 'Vô hiệu hóa';
    return 'Lỗi trạng thái'
  }

  // Lấy danh sách các action để đổi trạng thái
  getListChangeStatus(status: number) {
    if (status === 0) return [{
      Code: 1,
      Status: "Vô hiệu hóa",
      Icon: "fa-circle-minus",
    }]
    if (status === 1) return [{
      Code: 0,
      Status: "Kích hoạt",
      Icon: "fa-circle-check",
    }]
    return [];
  }

  // Sự kiện click vào button ... tool box
  onClickToolBox(obj: DTOCustomer, event: Event) {
    if (this.codeCustomerSelected === obj.Code) {
      this.codeCustomerSelected = null;
    }
    else {
      this.codeCustomerSelected = obj.Code;
    }

    // Remove 'active' class from all cells
    const cells = document.querySelectorAll('td.k-table-td[aria-colindex="11"]');
    cells.forEach(cell => cell.classList.remove('active'));

    // Add 'active' class to the clicked cell
    const cell = (event.target as HTMLElement).closest('td.k-table-td[aria-colindex="11"]');
    if (cell) {
      cell.classList.add('active');
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="7"]')) {
      this.codeCustomerSelected = null;
    }
    if (!(event.target as HTMLElement).closest('td.k-table-td') && !(event.target as HTMLElement).closest('.form') && !(event.target as HTMLElement).closest('component-button')) {
      this.selectedCodeCustomer = [];
      this.clearDetailCustomer(null);
    }
  }

  // Cập nhật trạng thái của khách hàng
  updateStatusCustomer(codeAccount: number, codeStatus: any) {
    this.accountService.updateCustomer({ CodeAccount: codeAccount, CodeStatus: codeStatus.value }).pipe(takeUntil(this.destroy)).subscribe(res => {
      this.getListCustomer();
      this.notiService.Show('Cập nhật trạng thái thành công', 'success');
    })
  }

  // Thao tác paging
  onPageChange(value: any) {
    this.gridState.skip = value.skip;
    this.gridState.take = value.take;
    this.selectedCodeCustomer = [];
    this.getListCustomer();
  }

  // Push các filter statistics vào filterAllStatistics
  pushStatisticsToAllStatistics(filter: any, value: any) {
    if (value.isSelected) {
      this.filterAllStatistics.filters.push(filter);
    }
    else {
      this.filterAllStatistics.filters = this.filterAllStatistics.filters.filter(item => item !== filter);
    }
    this.setFilterData();
  }

  // Set filter tất cả
  setFilterData() {
    this.gridState.filter.filters = [];
    this.pushToGridState(null, this.filterSearch);
    this.pushToGridState(null, this.filterAllStatistics);
    this.getListCustomer();
    console.log(this.gridState);
  }

  // Set filter search
  setFilterSearch(value: any) {
    this.valueSearch = value;
    this.filterSearch.filters = [];
    this.filterSearch.filters.push({ field: 'IDCustomer', operator: 'contains', value: this.valueSearch, ignoreCase: true });
    this.filterSearch.filters.push({ field: 'Name', operator: 'contains', value: this.valueSearch, ignoreCase: true });
    this.setFilterData();
  }

  // Push filter vào gridState
  pushToGridState(filter: FilterDescriptor, comFilter: CompositeFilterDescriptor) {
    if (filter) {
      if (filter.value && filter.value > 0) {
        this.gridState.filter.filters.push(filter);
      }
    }
    else if (comFilter) {
      if (comFilter.filters.length > 0) {
        this.gridState.filter.filters.push(comFilter);
      }
    }
  }

  // Sự kiện khi chọn vào hàng bất kỳ của grid
  onSelectionChange(e: SelectionEvent): void {
    this.selectedCodeCustomer = []
    this.selectedCodeCustomer.push(e.selectedRows[0]?.dataItem.Code);

    const selectedCustomer = e.selectedRows[0]?.dataItem; // Là object Customer sau khi chọn 1 row của grid
    this.bindSelectedCustomerToForm(selectedCustomer);
  }

  // format ngày từ string sang string. Ví dụ: "2003-09-25" sang "25-09-2003"
  formatDisplayDate(date: string) {
    const dateSplit = date.split('-');
    return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`
  }

  // Binding thông tin khách hàng được chọn lên form
  bindSelectedCustomerToForm(customer: DTOCustomer) {
    this.childId.valueTextBox = customer.IDCustomer;
    this.childName.valueTextBox = customer.Name;
    this.childEmail.valueTextBox = customer.Email;
    this.childPhoneNumber.valueTextBox = customer.PhoneNumber;
    this.childGender.value = { Code: customer.Gender, Gender: this.checkGender(customer.Gender) };
    this.childBirthday.datePicker.writeValue(new Date(customer.Birth));
    if (!customer.ImageURL) {
      this.childImage.imageHandle = new DTOImageProduct();
    }
    else {
      this.childImage.setImgURL(customer.ImageURL);
    }
  }

  // Xóa toàn bộ thông tin trên form
  clearDetailCustomer(res: any){
    this.childId.valueTextBox = '';
    this.childName.valueTextBox = '';
    this.childEmail.valueTextBox = '';
    this.childPhoneNumber.valueTextBox = '';
    this.childGender.resetValue();
    this.childBirthday.datePicker.writeValue(null);
    this.selectedCodeCustomer = [];
    this.childImage.imageHandle = new DTOImageProduct();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
