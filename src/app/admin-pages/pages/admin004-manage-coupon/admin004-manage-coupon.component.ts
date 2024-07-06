import { Component, ViewChild } from '@angular/core';
import { DrawerMode, DrawerPosition } from '@progress/kendo-angular-layout';
import { DTOStatus, listStageCoupon, listStatusCoupon } from '../../shared/dto/DTOStatus.dto';
import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';

interface GroupCustomer {
  Code: number
  Group: string
}
@Component({
  selector: 'app-admin004-manage-coupon',
  templateUrl: './admin004-manage-coupon.component.html',
  styleUrls: ['./admin004-manage-coupon.component.scss']
})
export class Admin004ManageCouponComponent {
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
  // Giá trị của input search
  valueSearch: string = '';


  // Danh sách đầy đủ các trạng thái của coupon
  listStatusCoupon: DTOStatus[] = listStatusCoupon;
  // Danh sách đầy đủ các giai đoạn của coupon
  listStageCoupon: DTOStatus[] = listStageCoupon.filter(stage => stage.Code !== 0);
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


  // Filter cho trạng thái khuyến mãi
  filterStatus: CompositeFilterDescriptor = { logic: 'or', filters: [{ field: 'Status', operator: 'eq', value: 0 }] };
  // Filter cho giai đoạn của khuyến mãi
  filterStage: CompositeFilterDescriptor = { logic: 'or', filters: [] };
  // Filter cho ngày
  filterDate: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  // Filter cho search
  filterSearch: FilterDescriptor = { field: 'IdCoupon', operator: 'contains', value: this.valueSearch, ignoreCase: true };
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


  // Đối tượng áp dụng mặc định
  defaultGroupCustomerApply: GroupCustomer = { Code: -1, Group: '-- Chọn nhóm khách hàng --' };


  // Lấy giá trị từ datepicker
  getDateFromDatePicker(value: any, type: string) {
    if (type === 'start') {
      this.startDate = value;
    }
    if (type === 'end') {
      this.endDate = value;
    }
    console.log(value);
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
    const formattedDateStart = `${year}-${month}-${day}T${hoursStart}:${minutesStart}:${secondsStart}`;
    const formattedDateEnd = `${year}-${month}-${day}T${hoursEnd}:${minutesEnd}:${secondsEnd}`;
    
    if(type === 'start') return formattedDateStart;
    if(type === 'end') return formattedDateEnd;
    return '';
  }


  // Filter tất cả
  setFilterData() {
    this.gridState.filter.filters = [];
    this.pushToGridState(null, this.filterStatus);
    this.pushToGridState(null, this.filterStage);
    this.pushToGridState(null, this.filterDate);
    this.pushToGridState(this.filterGroupCustomer, null);
  }

  // Push filter vào gridState
  pushToGridState(filter: FilterDescriptor, comFilter: CompositeFilterDescriptor) {
    if (filter) {
      if (filter.value >= 0) {
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
}
