import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DTOBrand } from 'src/app/ecom-pages/shared/dto/DTOBrand';
import { DTOProductType } from 'src/app/ecom-pages/shared/dto/DTOProductType';
import { ProductService } from 'src/app/ecom-pages/shared/service/product.service';
import { DTOStatus, listStatusActive } from '../../shared/dto/DTOStatus.dto';
import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { TextDropdownComponent } from 'src/app/shared/component/text-dropdown/text-dropdown.component';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { SearchBarComponent } from 'src/app/shared/component/search-bar/search-bar.component';
import { StatisticsComponent } from '../../shared/component/statistics/statistics.component';
import { DTOProduct } from 'src/app/ecom-pages/shared/dto/DTOProduct';
import { DTOUpdateProductRequest } from 'src/app/shared/dto/DTOUpdateProductRequest.dto';
import { Router } from '@angular/router';
import { ProductAdminService } from '../../shared/service/productAdmin.service';
import { LayoutService } from '../../shared/service/layout.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { StaffService } from '../../shared/service/staff.service';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';

interface DropDownPrice {
  Code: number
  RangePrice: string
  From: number
  To: number
}
interface Gender {
  Code: number
  Gender: string
  IsChecked?: boolean
}

@Component({
  selector: 'app-admin009-manage-product',
  templateUrl: './admin009-manage-product.component.html',
  styleUrls: ['./admin009-manage-product.component.scss']
})
export class Admin009ManageProductComponent implements OnInit, OnDestroy {
  // variable Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  // variable
  isLoading: boolean = true;
  pageSize: number = 15;
  valueSearch: string;
  codeProductSelected: number;
  // Role của tài khoản đang được đăng nhập
  permission: string;

  // variable list
  listPageSize: number[] = [15, 25, 50];
  listRangePrice: DropDownPrice[] = [
    {
      Code: 0,
      RangePrice: 'Dưới 500 nghìn',
      From: 0,
      To: 500000
    },
    {
      Code: 1,
      RangePrice: '500 nghìn - 1 triệu',
      From: 500000,
      To: 1000000
    },
    {
      Code: 2,
      RangePrice: '1 triệu - 3 triệu',
      From: 1000000,
      To: 3000000
    },
    {
      Code: 3,
      RangePrice: '3 triệu trở lên',
      From: 3000000,
      To: 100000000000000
    }
  ];
  listProductType: DTOProductType[] = [];
  listBrand: DTOBrand[] = [];
  listGender: Gender[] = [
    {
      Code: 0,
      Gender: 'Unisex',
      IsChecked: false
    },
    {
      Code: 1,
      Gender: 'Nam',
      IsChecked: false
    },
    {
      Code: 2,
      Gender: 'Nữ',
      IsChecked: false
    }
  ];
  listStatus: DTOStatus[] = listStatusActive;
  listProduct: GridDataResult;
  listStatusDefault: DTOStatus[] = [
    {
      Code: 0,
      Status: "Hoạt động",
      Icon: "",
      IsChecked: true
    },
    {
      Code: 1,
      Status: "Vô hiệu hóa",
      Icon: "",
      IsChecked: false
    }
  ];
  listSort: DTOStatus[] = [
    {
      Code: 1,
      Status: "Sản phẩm tồn kho",
    },
    {
      Code: 2,
      Status: "Giá tăng dần",
    },
    {
      Code: 3,
      Status: "Giá giảm dần",
    }
  ];
  listPermissionAvaiable: string[] = ['Admin', 'ProductManager', 'BillManager'];

  // variable Object
  defaultPrice: DropDownPrice = {
    Code: -1,
    RangePrice: '-- Giá sản phẩm --',
    From: 0,
    To: 100000000000000
  };
  defaultProductType: DTOProductType = {
    Code: -1,
    IdProductType: null,
    Name: '-- Loại sản phẩm --'
  };
  defaultBrand: DTOBrand = {
    Code: -1,
    IdBrand: null,
    Name: '-- Thương hiệu --',
    ImageUrl: '',
  };
  defaultSort: DTOStatus = {
    Code: 0,
    Status: "Sản phẩm bán chạy"
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

  // variable filter
  filterProductType: FilterDescriptor = { field: '', operator: '', value: null, ignoreCase: true };
  filterBrand: FilterDescriptor = { field: '', operator: '', value: null, ignoreCase: true };
  filterGenderUnisex: FilterDescriptor = { field: 'Gender', operator: 'eq', value: 0, ignoreCase: true };
  filterGenderMale: FilterDescriptor = { field: 'Gender', operator: 'eq', value: 1, ignoreCase: true };
  filterGenderFeMale: FilterDescriptor = { field: 'Gender', operator: 'eq', value: 2, ignoreCase: true };
  filterProductActive: FilterDescriptor = { field: 'Status', operator: 'eq', value: 0, ignoreCase: true };
  filterProductDisable: FilterDescriptor = { field: 'Status', operator: 'eq', value: 1, ignoreCase: true };

  // variable CompositeFilterDescriptor
  filterSearch: CompositeFilterDescriptor = { logic: 'or', filters: [] };
  filterPrice: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  filterAllStatistics: CompositeFilterDescriptor = { logic: 'or', filters: [this.filterProductActive, this.filterGenderUnisex] };

  // variable ViewChild
  @ViewChild('rangeprice') childRangePrice!: TextDropdownComponent;
  @ViewChild('producttype') childProductType!: TextDropdownComponent;
  @ViewChild('brand') childBrand!: TextDropdownComponent;
  @ViewChild('sort') childSort!: TextDropdownComponent;
  @ViewChild('search') childSearch!: SearchBarComponent;
  @ViewChild('productActive') childProductActive: StatisticsComponent;
  @ViewChild('productDisable') childProductDisable: StatisticsComponent;
  @ViewChild('productMale') childProductMale: StatisticsComponent;
  @ViewChild('productFemale') childProductFemale: StatisticsComponent;
  @ViewChild('productUnisex') childProductUnisex: StatisticsComponent;

  // variable Statistics
  valueTotalProduct: number = 0; // Thống kê tổng số sản phẩm
  valueProductStatusActive: number = 0; // Thống kê tổng số sản phẩm Hoạt động
  valueProductStatusDisable: number = 0; // Thống kê tổng số sản phẩm Vô hiệu hóa
  valueProductUnisex: number = 0; // Thống kê tổng số sản phẩm Unisex
  valueProductMale: number = 0; // Thống kê tổng số sản phẩm Nam
  valueProductFemale: number = 0; // Thống kê tổng số sản phẩm Nữ

  constructor(
    private productAdminService: ProductAdminService,
    private router: Router,
    private layoutService: LayoutService,
    private notiService: NotiService,
    private staffService: StaffService
  ) { }

  ngOnInit(): void {
    // this.setLayoutStorage('Quản lý sản phẩm/ Danh sách sản phẩm', 'admin/manage-product');
    this.getPermission();
    this.removeLocalStorage();
    this.getListProductType();
    this.getListBrand();
    this.getListProduct();
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

  // Kiểm tra có permission có thể truy cập hay không
  checkPermission() {
    if (this.listPermissionAvaiable.includes(this.permission)) {
      return true;
    }
    return false;
  }

  // Set cho breadcrumb, routerLink
  setLayoutStorage(breadcrumb: string, routerlink: string) {
    localStorage.setItem('breadcrumb', breadcrumb);
    localStorage.setItem('routerLink', routerlink);
    this.layoutService.setSelectedBreadCrumb(breadcrumb);
  }

  // Xóa localStorage
  removeLocalStorage() {
    localStorage.removeItem('productSelected');
  }

  // Lấy danh sách các product type
  getListProductType() {
    this.productAdminService.getListProductType().pipe(takeUntil(this.destroy)).subscribe(list => this.listProductType = list.ObjectReturn.Data);
  }

  // Lấy danh sách các brand
  getListBrand() {
    this.productAdminService.getListBrand().pipe(takeUntil(this.destroy)).subscribe(list => this.listBrand = list.ObjectReturn.Data);
  }

  // Lấy danh sách các product
  getListProduct() {
    this.isLoading = true;
    this.productAdminService.getListProduct(this.gridState).pipe(takeUntil(this.destroy)).subscribe(list => {
      this.listProduct = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      this.isLoading = false;
    })
  }

  // Lấy các thống kê về sản phẩm
  getStatistics() {
    // Khởi tạo state tạm để filter
    let state: State = { filter: { logic: "and", filters: [] } };

    // Đối với tổng số sản phẩm
    this.filterStatistics(state, (total) => this.valueTotalProduct = total);

    // Đối với số lượng sản phẩm hoạt động
    state.filter.filters = [this.filterProductActive]
    this.filterStatistics(state, (total) => this.valueProductStatusActive = total);

    // Đối với số lượng sản phẩm vô hiệu hóa
    state.filter.filters = [this.filterProductDisable]
    this.filterStatistics(state, (total) => this.valueProductStatusDisable = total);

    // Đối với số lượng sản phẩm Unisex
    state.filter.filters = [this.filterGenderUnisex]
    this.filterStatistics(state, (total) => this.valueProductUnisex = total);

    // Đối với số lượng sản phẩm cho Nam
    state.filter.filters = [this.filterGenderMale]
    this.filterStatistics(state, (total) => this.valueProductMale = total);

    // Đối với số lượng sản phẩm cho Nữ
    state.filter.filters = [this.filterGenderFeMale]
    this.filterStatistics(state, (total) => this.valueProductFemale = total);
  }

  /**
   * Dùng để filter các statistics
   * @param state State để filter
   * @param filter FilterDescriptor
   * @param callback Hàm callback để cập nhật giá trị sau khi có ObjectReturn.Total
   */
  filterStatistics(state: State, callback: (total: number) => void) {
    this.productAdminService.getListProduct(state).pipe(takeUntil(this.destroy)).subscribe((obj: DTOResponse) => {
      callback(obj.ObjectReturn.Total);
    });
  }

  // Sort danh sách theo số lượng bán chạy và đơn giá
  setSort(value: any) {
    if (value) {
      this.gridState.sort = []
      if (value.Code === 0) {
        this.gridState.sort.push({
          "field": "Sold",
          "dir": "desc"
        })
      }
      else if (value.Code === 1) {
        this.gridState.sort.push({
          "field": "Stock",
          "dir": "desc"
        })
      }
      else if (value.Code === 2) {
        this.gridState.sort.push({
          "field": "Price",
          "dir": "asc"
        })
      }
      else if (value.Code === 3) {
        this.gridState.sort.push({
          "field": "Price",
          "dir": "desc"
        })
      }
      this.getListProduct();
    }
  }

  // Kiểm tra giới tính
  checkGender(idGender: number) {
    if (idGender === 0) return 'Unisex';
    if (idGender === 1) return 'Nam';
    if (idGender === 2) return 'Nữ';
    return 'Lỗi giới tính';
  }

  // Kiểm tra giới tính
  checkStatusProduct(idStatus: number) {
    if (idStatus === 0) return 'Đang kinh doanh';
    if (idStatus === 1) return 'Ngừng kinh doanh';
    return 'Lỗi trạng thái';
  }

  // Set filter dropdown price
  setFilterPrice(value: any) {
    this.filterPrice.filters = [];
    const filterFrom: FilterDescriptor = { field: 'Price', operator: 'gte', value: value.From };
    const filterTo: FilterDescriptor = { field: 'Price', operator: 'lte', value: value.To };
    if (value.Code !== -1) {
      this.filterPrice.filters.push(filterFrom);
      this.filterPrice.filters.push(filterTo);
    }
    this.setFilterData();
  }

  // Set filter search
  setFilterSearch(value: any) {
    this.valueSearch = value;
    this.filterSearch.filters = [];
    this.filterSearch.filters.push({ field: 'IdProduct', operator: 'contains', value: this.valueSearch, ignoreCase: true });
    this.filterSearch.filters.push({ field: 'Name', operator: 'contains', value: this.valueSearch, ignoreCase: true });
    this.setFilterData();
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

  // Set filter tất cả
  setFilterData() {
    this.gridState.filter.filters = [];
    this.pushToGridState(null, this.filterPrice);
    this.pushToGridState(this.filterBrand, null);
    this.pushToGridState(this.filterProductType, null);
    this.pushToGridState(null, this.filterSearch);
    this.pushToGridState(null, this.filterAllStatistics);
    this.getListProduct();
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

  // Reset tất cả các filter
  resetFilter() {
    // Reset range price
    this.childRangePrice.resetValue();
    this.filterPrice.filters = [];

    // Reset product type
    this.childProductType.resetValue();
    this.filterProductType = { field: '', operator: '', value: null, ignoreCase: true };

    // Reset brand
    this.childBrand.resetValue();
    this.filterBrand = { field: '', operator: '', value: null, ignoreCase: true };

    //Reset search
    this.valueSearch = '';
    this.childSearch.valueSearch = '';

    // Reset statistics
    this.childProductActive.reset();
    this.childProductDisable.reset();
    this.childProductMale.reset();
    this.childProductFemale.reset();
    this.childProductUnisex.reset();

    // Reset dropdown sort
    this.childSort.resetValue();

    // Reset state
    this.gridState.filter.filters = [];
    this.pageSize = 15;
    this.gridState.skip = 0;
    this.gridState.sort = [
      {
        "field": "Code",
        "dir": "asc"
      }
    ],
      this.gridState.take = this.pageSize;
    this.getListProduct();
  }

  // Dùng để format tiền VN
  formatCurrency(value: number): string {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  // Sự kiện click vào button ... tool box
  onClickToolBox(obj: DTOProduct, event: Event) {
    if (this.codeProductSelected === obj.Code) {
      this.codeProductSelected = null;
    }
    else {
      this.codeProductSelected = obj.Code;
    }

    // Remove 'active' class from all cells
    const cells = document.querySelectorAll('td.k-table-td[aria-colindex="10"]');
    cells.forEach(cell => cell.classList.remove('active'));

    // Add 'active' class to the clicked cell
    const cell = (event.target as HTMLElement).closest('td.k-table-td[aria-colindex="10"]');
    if (cell) {
      cell.classList.add('active');
    }
  }

  // Tìm các action có thể thực hiện của 1 product
  findItemActionList(status: number): DTOStatus[] {
    if (status === 0) {
      return [
        {
          Code: -1,
          Status: "Chỉnh sửa",
          Icon: "fa-pencil",
        },
        {
          Code: 1,
          Status: "Ngừng kinh doanh",
          Icon: "fa-circle-minus"
        }
      ]
    }
    else if (status === 1) {
      return [
        {
          Code: -1,
          Status: "Chỉnh sửa",
          Icon: "fa-pencil",
        },
        {
          Code: 0,
          Status: "Kích hoạt",
          Icon: "fa-circle-check"
        }
      ]
    }
    return [];
  }

  // Cật nhật trạng thái sản phẩm
  updateStatusProduct(product: DTOProduct, obj: any) {
    if (obj.value === -1) {
      this.goToDetail(null, product.Code);
      this.setLayoutStorage('Quản lý sản phẩm/Chi tiết sản phẩm/Sản phẩm ' + product.Name, 'admin/detail-product');
    }
    if (obj.value >= 0) {
      product.Status = obj.value;
      const request: DTOUpdateProductRequest = {
        Product: product,
        Properties: ["Status"]
      }
      this.productAdminService.updateProduct(request).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          this.notiService.Show("Cập nhật trạng thái thành công", "success")
          this.getStatistics();
          this.getListProduct();
        }
      }, error => {
        console.error('Error:', error);
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="10"]')) {
      this.codeProductSelected = null;
    }
  }

  // Thao tác paging
  onPageChange(value: any) {
    this.gridState.skip = value.skip;
    this.gridState.take = value.take;
    this.getListProduct();
  }

  goToDetail(res: any, code: number) {
    if (code === 0) {
      this.setLayoutStorage('Quản lý sản phẩm/Thêm mới sản phẩm', 'admin/detail-product')
    }
    localStorage.setItem('productSelected', code + '');
    this.router.navigate(['admin/detail-product']);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}