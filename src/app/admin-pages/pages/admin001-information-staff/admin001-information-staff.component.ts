import { DTOStatus } from './../../shared/dto/DTOStatus.dto';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StaffService } from '../../shared/service/staff.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';
import { DTODistrict, DTOProvince, DTOWard } from 'src/app/ecom-pages/shared/dto/DTOProvince';
import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';
import { AccountService } from '../../shared/service/account.service';
import { GridDataResult, SelectionEvent } from '@progress/kendo-angular-grid';
import { DTOImageProduct } from 'src/app/ecom-pages/shared/dto/DTOImageProduct';
import { TextInputComponent } from 'src/app/shared/component/text-input/text-input.component';
import { DatepickerComponent } from '../../shared/component/datepicker/datepicker.component';
import { TextDropdownComponent } from 'src/app/shared/component/text-dropdown/text-dropdown.component';
import { ImportImageComponent } from '../../shared/component/import-image/import-image.component';
import { DTOUpdateStaffRequest } from '../../shared/dto/DTOUpdateStaffRequest.dto';
import { DTORole } from '../../shared/dto/DTORole.dto';

interface Gender {
  Code: number
  Gender: string
  IsChecked?: boolean
}

@Component({
  selector: 'app-admin001-information-staff',
  templateUrl: './admin001-information-staff.component.html',
  styleUrls: ['./admin001-information-staff.component.scss']
})
export class Admin001InformationStaffComponent implements OnInit, OnDestroy {
  // variable Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  currentDate: Date = new Date();
  minDate: Date = new Date(1900, 1, 1);
  maxDate: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  valueSearch: string;
  pageSize: number = 5;
  isLoading: boolean = true;
  listStaff: GridDataResult;
  selectedCodeStaff: number[];
  imageNull: DTOImageProduct = new DTOImageProduct();
  listPageSize: number[] = [5, 10, 15];
  codeStaffSelected: number;
  newAddress: string;
  isUpdate: boolean = false;
  listRoles: DTORole[] = [];
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


  listProvince: DTOProvince[]
  listDistrict: DTODistrict[]
  listWard: DTOWard[]


  isLoadingProvince: boolean = false
  isLoadingDistrict: boolean = false
  isLoadingWard: boolean = false


  isDisableDistrict: boolean = true
  isDisableWard: boolean = true
  isDisableSpecific: boolean = true

  provinceSelected: DTOProvince
  districtSelected: DTODistrict
  wardSelected: DTOWard

  defaultValueProvince: DTOProvince = { province_id: "", province_name: 'Chọn tỉnh, thành phố', province_type: "" }
  defaultValueWard: DTOWard = { district_id: "", ward_id: "", ward_name: "Chọn huận, huyện", ward_type: "" }
  defaulValueDistrict: DTODistrict = { district_id: "", district_name: "Chọn thị xã, trấn", district_type: "", province_id: "", lat: "", lng: "" }

  provinceBiding: DTOProvince;
  districtBiding: DTODistrict;
  wardBiding: DTOWard;
  roadBiding: string;
  isDisabled: boolean = true;
  specialAddress: string;

  // variables FilterDescriptor
  filterAllStaff: FilterDescriptor = { "field": "Status", "operator": "gte", "value": 0, "ignoreCase": true };
  filterStaffActive: FilterDescriptor = { "field": "Status", "operator": "eq", "value": 0, "ignoreCase": true };
  filterStaffDisable: FilterDescriptor = { "field": "Status", "operator": "eq", "value": 1, "ignoreCase": true };

  filterSearch: CompositeFilterDescriptor = { logic: 'or', filters: [] };
  filterAllStatistics: CompositeFilterDescriptor = { logic: 'or', filters: [this.filterAllStaff] };

    // variable Statistics
    valueTotalStaff: number = 100;
    valueTotalStaffActive: number = 50;
    valueTotalStaffDisable: number = 50;
  
  // Role của tài khoản đang được đăng nhập
  permission: string;

    // variables ViewChild
    @ViewChild('id') childId!: TextInputComponent;
    @ViewChild('name') childName!: TextInputComponent;
    @ViewChild('email') childEmail!: TextInputComponent;
    @ViewChild('phonenumber') childPhoneNumber!: TextInputComponent;
    @ViewChild('gender') childGender!: TextDropdownComponent;
    @ViewChild('birthday') childBirthday!: DatepickerComponent;
    @ViewChild('image') childImage!: ImportImageComponent;
    @ViewChild('province') childProvince!: TextDropdownComponent;
    @ViewChild('district') childDistrict!: TextDropdownComponent;
    @ViewChild('ward') childWard!: TextDropdownComponent;
    @ViewChild('specific') childSpecific!: TextInputComponent;
    @ViewChild('road') childRoad!: TextInputComponent;


  constructor(private staffService: StaffService,
    private notiService: NotiService) { }


  ngOnInit(): void {
    this.getListStaff();
    this.getPermission();
    this.APIGetProvince();
    this.getListRole();
    this.getStatistics();
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

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  // Thao tác paging
  onPageChange(value: any) {
    this.gridState.skip = value.skip;
    this.gridState.take = value.take;
    this.selectedCodeStaff = [];
    this.getListStaff();
  }

  // Lấy danh sách nhân viên
  getListStaff() {
    this.isLoading = true;
    this.staffService.getListStaff(this.gridState).pipe(takeUntil(this.destroy)).subscribe(list => {
      this.listStaff = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      this.isLoading = false;
      console.log(this.listStaff);
    })
  }

  filterStatistics(state: State, callback: (total: number) => void) {
    this.staffService.getListStaff(state).pipe(takeUntil(this.destroy)).subscribe((obj: DTOResponse) => {
      callback(obj.ObjectReturn.Total);
    });
  }
    // Lấy các thống kê về sản phẩm
    getStatistics() {
      let state: State = { filter: { logic: "and", filters: [] } };
  
      // Đối với tổng số khách hàng
      this.filterStatistics(state, (total) => this.valueTotalStaff = total);
  
      // Đối với tổng số tài khoản hoạt động
      state.filter.filters = [this.filterStaffActive]
      this.filterStatistics(state, (total) => this.valueTotalStaffActive = total);
  
      // Đối với tổng số tài khoản bị vô hiệu hóa
      state.filter.filters = [this.filterStaffDisable]
      this.filterStatistics(state, (total) => this.valueTotalStaffDisable = total);
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

  // format ngày từ string sang string. Ví dụ: "2003-09-25" sang "25-09-2003"
  formatDisplayDate(date: string) {
    const dateSplit = date.split('-');
    return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`
  }

  APIGetProvince(): void {
    this.isLoadingProvince = true
    this.staffService.getProvince().pipe(takeUntil(this.destroy)).subscribe((data) => {
      try {
        if (data) {

          this.listProvince = data.results
        } else {
          this.notiService.Show("Error when fetching data", "error")
        }
      } catch {

      } finally {
        this.isLoadingProvince = false
      }
    })
  }

  APIGetDistrict(idProvince: string): void {
    this.isLoadingDistrict = true
    this.staffService.getDistrict(idProvince).pipe(takeUntil(this.destroy)).subscribe((data) => {
      try {
        if (data) {
          this.listDistrict = data.results
        } else {
          this.notiService.Show("Error when fetching data", "error")
        }
      } catch {

      } finally {
        this.isLoadingDistrict = false
      }

    })
  }

  APIGetWard(idDistrict: string): void {
    this.isLoadingWard = true
    this.staffService.getWard(idDistrict).pipe(takeUntil(this.destroy)).subscribe((data) => {
      try {
        if (data) {
          this.listWard = data.results
        } else {
          this.notiService.Show("Error when fetching data", "error")
        }
      } catch {

      } finally {
        this.isLoadingWard = false
      }

    })
  }

  handleChangeProvince(obj: any): void {
    this.provinceSelected = obj;
    this.APIGetProvince();
    this.districtBiding = this.defaulValueDistrict;
    this.wardBiding = this.defaultValueWard;
    this.wardSelected = null;
    if (this.provinceSelected) {
      this.districtSelected = null
      this.wardSelected = null
      this.isDisableWard = true
      if (this.provinceSelected.province_id != "") {
        this.isDisableDistrict = false
      } else {
        this.isDisableDistrict = true
      }

      this.APIGetDistrict(this.provinceSelected.province_id)
      this.setNewAddress();
      return
    }
  }

  handleChangeDistrict(obj: any): void {
    this.districtSelected = obj;
    this.APIGetDistrict(this.provinceSelected.province_id)
    this.wardSelected = null;
    if (this.districtSelected) {
      this.wardSelected = null
      if (this.provinceSelected.province_id != "") {
        this.isDisableWard = false
      } else {
        this.isDisableWard = true
      }
      this.isDisableWard = false
      this.APIGetWard(this.districtSelected.district_id)
      this.setNewAddress();

      return
    }
  }

  handleChangeWard(obj: any): void {
    this.APIGetWard(this.districtSelected.district_id)
    this.wardSelected = obj;
    if (this.wardSelected) {
      if (this.provinceSelected.province_id != "") {
        this.isDisableSpecific = false
      } else {
        this.isDisableSpecific = true
      }
      this.setNewAddress();
    }
  }

  setNewAddress() {
    this.newAddress = [
      this.childProvince.value.province_name,
      this.childDistrict.value.district_name,
      this.childWard.value.ward_name,
      this.childRoad.valueTextBox,
      this.childSpecific.valueTextBox
    ].filter(Boolean).join(', ');
  }

  // Set filter tất cả
  setFilterData() {
    this.gridState.filter.filters = [];
    this.pushToGridState(null, this.filterSearch);
    this.pushToGridState(null, this.filterAllStatistics);
    this.getListStaff();
    console.log(this.gridState);
  }

  // Set filter search
  setFilterSearch(value: any) {
    this.valueSearch = value;
    this.filterSearch.filters = [];
    this.filterSearch.filters.push({ field: 'IdStaff', operator: 'contains', value: this.valueSearch, ignoreCase: true });
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

  // Sự kiện khi chọn vào hàng bất kỳ của grid
  onSelectionChange(e: SelectionEvent): void {
    this.selectedCodeStaff = []
    this.selectedCodeStaff.push(e.selectedRows[0]?.dataItem.Code);
    this.isDisableDistrict = true;
    this.isDisableWard = true;
    this.isUpdate = true;
    const selectedCustomer = e.selectedRows[0]?.dataItem; // Là object Customer sau khi chọn 1 row của grid
    this.bindSelectedCustomerToForm(selectedCustomer);
  }

  //Biding address
  getSpecialAddress(address: string): string {
    this.provinceBiding = { province_id: "", province_name: address.split(',')[0], province_type: "" }
    this.provinceSelected = this.provinceBiding;
    this.districtBiding = { province_id: "", district_id: "", district_name: address.split(',')[1], district_type: "", lat: "", lng: "" }
    this.districtSelected = this.districtBiding;
    this.wardBiding = { district_id: "", ward_id: "", ward_name: address.split(',')[2], ward_type: "" }
    this.wardSelected = this.wardBiding;
    this.roadBiding = address.split(',')[3];
    console.log(this.roadBiding);

    return address.split(',')[4];
  }

  // Binding thông tin nhân viên được chọn lên form
  bindSelectedCustomerToForm(staff: DTOStaff) {
    this.specialAddress = this.getSpecialAddress(staff.Address);
    this.childId.valueTextBox = staff.IdStaff;
    this.childName.valueTextBox = staff.Name;
    this.childEmail.valueTextBox = staff.Email;
    this.childPhoneNumber.valueTextBox = staff.PhoneNumber;
    this.childGender.value = { Code: staff.Gender, Gender: this.checkGender(staff.Gender) };
    this.childBirthday.datePicker.writeValue(new Date(staff.Birthday));
    if (!staff.ImageUrl) {
      this.childImage.imageHandle = new DTOImageProduct();
    }
    else {
      this.childImage.setImgURL(staff.ImageUrl);
    }
    this.childRoad.valueTextBox = this.roadBiding;
    this.childSpecific.valueTextBox = this.specialAddress;
  }

    // Sự kiện click vào button ... tool box
    onClickToolBox(obj: DTOStaff, event: Event) {
      if(this.permission === 'Admin'){
        if (this.codeStaffSelected === obj.Code) {
          // console.log(this.codeStaffSelected);
          this.codeStaffSelected = null;
        }
        else {
          this.codeStaffSelected = obj.Code;
          // console.log(this.codeStaffSelected);
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
      else{
        this.notiService.Show('Bạn không có thẩm quyền để điều chỉnh', 'warning');
      }
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

  // Lấy danh sách các role
  getListRole(){
    // this.staffService.getListRoles().pipe(takeUntil(this.destroy)).subscribe((data) => {
    //   try {
    //     if (data) {

    //       this.listRoles = data
    //     } else {
    //       this.notiService.Show("Error when fetching data", "error")
    //     }
    //   } catch {

    //   } finally {
    //     this.isLoadingProvince = false
    //   }
    // })
    // console.log(this.listRoles);
  }

    // Cập nhật trạng thái của nhân viên
  updateStatusStaff(staff: DTOStaff, codeStatus: any) {
    const requestStaff: DTOStaff = staff;
    requestStaff.Status = codeStatus.value;
    const properties: string[] = ["Status"];

    const request: DTOUpdateStaffRequest = {
      Staff: requestStaff,
      Properties: properties,
    }
    
      this.staffService.updateStaff(request).pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
        console.log(request);
        this.getListStaff();
        this.getStatistics();
        if(res.StatusCode === 0){
          this.notiService.Show('Cập nhật trạng thái thành công', 'success');
        }
      })
    }

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="8"]')) {
        this.codeStaffSelected = null;
      }
      if (!(event.target as HTMLElement).closest('td.k-table-td') && !(event.target as HTMLElement).closest('.form') && !(event.target as HTMLElement).closest('component-button')) {
        this.selectedCodeStaff = [];
        // this.clearDetailCustomer(null);
      }
    }
}
