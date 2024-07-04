import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../shared/service/account.service';
import { DTOCustomer } from 'src/app/shared/dto/DTOCustomer.dto';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { FilterDescriptor, State } from '@progress/kendo-data-query';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  // variables object
  defaultGender: Gender = {
    Code: -1,
    Gender: '-- Giới tính --',
  }

  // variables filters
  filterAllCustomer: State = {};
  filterCustomerActive: FilterDescriptor = { "field": "StatusAccount", "operator": "eq", "value": 0, "ignoreCase": true };
  filterCustomerDisable: FilterDescriptor = { "field": "StatusAccount", "operator": "eq", "value": 1, "ignoreCase": true };

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getStatistics();
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
}
