import { Component, HostListener, OnInit } from '@angular/core';
import { AccountService } from '../../shared/service/account.service';
import { DTOCustomer } from 'src/app/shared/dto/DTOCustomer.dto';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { FilterDescriptor, State } from '@progress/kendo-data-query';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

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
export class Admin001InformationCustomerComponent implements OnInit {
  // variable Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  // variables
  isLoading: boolean = true;
  currentDate: Date = new Date();
  minDate: Date = new Date(1900, 1, 1);
  maxDate: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  pageSize: number = 15;
  codeCustomerSelected: number;

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
  listPageSize: number[] = [15, 25, 50];

  // variables object
  defaultGender: Gender = {
    Code: -1,
    Gender: '-- Giới tính --',
  }

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

  // variables filters
  filterAllCustomer: State = {};
  filterCustomerActive: FilterDescriptor = { "field": "StatusAccount", "operator": "eq", "value": 0, "ignoreCase": true };
  filterCustomerDisable: FilterDescriptor = { "field": "StatusAccount", "operator": "eq", "value": 1, "ignoreCase": true };

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getListCustomer();
    this.getStatistics();
  }

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
    if (!(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="8"]')) {
      this.codeCustomerSelected = null;
    }
  }

  // Cập nhật trạng thái của khách hàng
  updateStatusCustomer(codeAccount: number, codeStatus: any){
    this.accountService.updateCustomer({CodeAccount: codeAccount, CodeStatus: codeStatus.value}).pipe(takeUntil(this.destroy)).subscribe(res => {
      this.getListCustomer();
    })
  }
}
