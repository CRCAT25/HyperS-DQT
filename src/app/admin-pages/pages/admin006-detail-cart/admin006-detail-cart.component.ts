import { DTOStatus, listStatus, listStatusNoView, listStatusOfBillInfo } from '../../shared/dto/DTOStatus.dto';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, Type } from '@angular/core';
import { DTOBillInfo } from '../../shared/dto/DTOBillInfo.dto';
import { DTOBill } from '../../shared/dto/DTOBill.dto';
import { DTOUpdateBillInfoRequest } from '../../shared/dto/DTOUpdateBillInfo.dto';
import { DTOUpdateBillRequest } from '../../shared/dto/DTOUpdateBillRequest.dto';
import { BillService } from '../../shared/service/bill.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { PaymentService } from 'src/app/ecom-pages/shared/service/payment.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { DTODistrict, DTOProvince, DTOWard } from 'src/app/ecom-pages/shared/dto/DTOProvince';
import { DTOUpdateBill } from '../../shared/dto/DTOUpdateBill.dto';
import { TextDropdownComponent } from 'src/app/shared/component/text-dropdown/text-dropdown.component';
import { TextInputComponent } from 'src/app/shared/component/text-input/text-input.component';
import { TextAreaComponent } from 'src/app/shared/component/text-area/text-area.component';
import { DTOProcessToPayment } from 'src/app/ecom-pages/shared/dto/DTOProcessToPayment';
import { DTOProductInCart } from 'src/app/ecom-pages/shared/dto/DTOProductInCart';
import { DTOProduct } from 'src/app/ecom-pages/shared/dto/DTOProduct';
import { ProductAdminService } from '../../shared/service/productAdmin.service';
import { DTOSize } from 'src/app/ecom-pages/shared/dto/DTOSize';
import { SearchBarComponent } from 'src/app/shared/component/search-bar/search-bar.component';
import { isAlphabetWithSingleSpace, isValidPhoneNumber } from 'src/app/shared/utils/utils';
import { FilterDescriptor, State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CouponService } from '../../shared/service/coupon.service';
import { DTOCoupon } from '../../shared/dto/DTOCoupon.dto';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';
import { StaffService } from '../../shared/service/staff.service';


interface PaymentMethod {
  Code: number;
  Method: string;
}
@Component({
  selector: 'app-admin006-detail-cart',
  templateUrl: './admin006-detail-cart.component.html',
  styleUrls: ['./admin006-detail-cart.component.scss']
})
export class Admin006DetailCartComponent implements OnInit, OnDestroy {
  @Output() datePicked = new EventEmitter();
  @Output() sendValue = new EventEmitter();
  @Input() listData: DTOBillInfo[];
  @Input() itemData: DTOBill;
  @Input() isAdd: boolean = false;

  listBillInfo: DTOBillInfo[];
  itemBill: DTOBill;
  itemBillInfo: DTOBillInfo;
  itemProduct: DTOProduct;
  listProduct: DTOProduct[] = [];
  listOfSize: DTOSize[] = [];
  listProductsInCart: DTOProductInCart[] = [];
  isLoading: boolean = true;
  listStatus: DTOStatus[] = listStatusOfBillInfo;
  isClickButton: { [key: number]: boolean } = {};
  tempID: number;
  listNextStatus: DTOStatus[];
  objItemStatus: any;
  isShowAlert: boolean = false;
  reasonFail: string;
  isEdit: boolean = false;
  isProcessAdd: boolean = false;
  specialAddress: string;
  newAddress: string;
  sizeSelected: DTOSize;
  selectedSize: { [key: string]: number } = {};
  stockOfEeachSize: { [Size: string]: number } = {};
  discountOfEeachId: { [Id: string]: number } = {};
  stockOfSizeSelected: number;
  valueSearch: string;
  inputQuantity: number = 0;
  priceProductAfterDiscount = 0;
  priceOfProduct: number = 0;
  totalPriceOfProduct: number = 0;
  totalPrictOfBill: number = 0;
  discountProduct: number;
  setStatusBill: number;
  idCoupon: string = null;
  priceCoupon: number = 0;
  maxCoupon: number = 0;
  numberCoupon: number = 0;
  isDisabledVoucher: boolean = true;
  nowDate: Date = new Date();
  PaymentMethodDropDown: PaymentMethod[] = [
    {
      Code: 0,
      Method: "Ship COD"
    },
    {
      Code: 1,
      Method: "Momo"
    }
  ];

  listProvince: DTOProvince[]
  listDistrict: DTODistrict[]
  listWard: DTOWard[]

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

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

  provinceBiding: string;
  districtBiding: string;
  wardBiding: string;
  roadBiding: string;
  isDisabled: boolean = true;

  // oldProvinceBiding: string;
  // oldDistrictBiding: string;
  // oldWardBiding: string;
  // oldSpecificBiding: string;



  @ViewChild('name') childName!: TextInputComponent;
  @ViewChild('ordererPhoneNumber') childOrdererPhoneNumber!: TextInputComponent;
  @ViewChild('phoneNumber') childPhoneNumber!: TextInputComponent;
  @ViewChild('method') childMethod!: TextDropdownComponent;
  @ViewChild('note') childNote!: TextAreaComponent;
  @ViewChild('province') childProvince!: TextDropdownComponent;
  @ViewChild('district') childDistrict!: TextDropdownComponent;
  @ViewChild('ward') childWard!: TextDropdownComponent;
  @ViewChild('specific') childSpecific!: TextInputComponent;
  @ViewChild('road') childRoad!: TextInputComponent;
  @ViewChild('coupon') childCoupon!: ComboBoxComponent;
  @ViewChild('search') childSearch!: SearchBarComponent;


  filterProductActive: FilterDescriptor = { field: 'Status', operator: 'eq', value: 0, ignoreCase: true };
  filterCouponApplying: FilterDescriptor = { field: 'Status', operator: 'eq', value: 2, ignoreCase: true };
  filterCouponAllCount: FilterDescriptor = { field: 'ApplyTo', operator: 'eq', value: 0, ignoreCase: true };
  filterCouponActiving: FilterDescriptor = { field: 'Stage', operator: 'eq', value: 1, ignoreCase: true };

  gridStateProduct: State = {
    sort: [
      {
        "field": "Code",
        "dir": "asc"
      }
    ],
    filter: {
      logic: "and",
      filters: [
        this.filterProductActive
      ]
    }
  }

  gridStateCoupon: State = {
    sort: [
      {
        "field": "Code",
        "dir": "asc"
      }
    ],
    filter: {
      logic: "and",
      filters: [
        this.filterCouponApplying,
        this.filterCouponAllCount,
        this.filterCouponActiving
      ]
    }
  }



  listCouponAPI: GridDataResult;
  listDTOCoupon: DTOCoupon[];
  originalListDTOCoupon: DTOCoupon[];
  listProductAPI: GridDataResult;
  listDTOProduct: DTOProduct[];
  originalListDTOProduct: DTOProduct[];

  // Role của tài khoản đang được đăng nhập
  permission: string;
  listPermissionAvaiable: string[] = ['Admin', 'BillManager'];


  constructor(private billService: BillService,
    private notiService: NotiService,
    private paymentService: PaymentService,
    private productService: ProductAdminService,
    private productAdminService: ProductAdminService,
    private couponService: CouponService,
    private staffService: StaffService
  ) { }


  ngOnInit(): void {
    this.getPermission();
    if (this.isAdd == false) {
      this.getListBillInfo();
    }
    this.APIGetProvince();
    this.getListCoupon();
    this.getListProduct();
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

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  getListBillInfo() {
    this.itemBill = this.itemData;
    this.listBillInfo = this.listData;
    this.specialAddress = this.getSpecialAddress(this.itemBill.ShippingAddress);
  }

  getSpecialAddress(address: string): string {
    this.provinceBiding = address.split(',')[0];
    this.districtBiding = address.split(',')[1];
    this.wardBiding = address.split(',')[2];
    this.roadBiding = address.split(',')[3];
    return address.split(',')[4];
  }



  formatCurrency(value: number): string {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
      return 'Invalid value';
    }
  }

  formattedCreateAt(createAt: any) {
    const date = new Date(createAt);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toTimeString().split(' ')[0];

    return `${day}/${month}/${year} - ${time}`;
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

  // formatNote(note: string): string {
  //   // Replace each instance of ' - ' with '\n- '
  //   return note.replace(/ - /g, '\n ');
  // }
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
        return 'Yêu cầu đổi hàng';
      case 15:
        return 'Yêu cầu trả hàng';
      case 17:
        return 'Chờ thanh toán';
      case 18:
        return 'Xác nhận đổi hàng';
      case 19:
        return 'Đã đổi hàng';
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

  // Kiểm tra giá trị giảm giá
  formatCouponType(coupon: DTOCoupon) {
    if (coupon.CouponType === 0) return coupon.PercentDiscount + '%';
    if (coupon.CouponType === 1) return this.formatCurrency(coupon.DirectDiscount);
    return 'Lỗi giá trị giảm giá';
  }

  APIGetProvince(): void {
    this.isLoadingProvince = true
    this.paymentService.getProvince().pipe(takeUntil(this.destroy)).subscribe((data) => {
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
    this.paymentService.getDistrict(idProvince).pipe(takeUntil(this.destroy)).subscribe((data) => {
      try {
        if (data) {
          this.listDistrict = data.results
        } else {
          this.notiService.Show("Error when fetching data", "error")
        }
      } catch {

      } finally {

      }

    })
    this.isLoadingDistrict = false
  }

  APIGetWard(idDistrict: string): void {
    this.isLoadingWard = true
    this.paymentService.getWard(idDistrict).pipe(takeUntil(this.destroy)).subscribe((data) => {
      try {
        if (data) {
          this.listWard = data.results
        } else {
          this.notiService.Show("Error when fetching data", "error")
        }
      } catch {

      } finally {
      }

    })
    this.isLoadingWard = false

  }

  handleChangeProvince(obj: any): void {
    this.provinceSelected = obj;
    this.APIGetProvince();
    this.districtBiding = this.defaulValueDistrict.district_name;
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
    this.wardBiding = this.defaultValueWard.ward_name;
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

  setDTOAddress(type: number) {
    if (type == 1) {
      if (this.wardSelected) {
        return {
          ward_name: this.wardSelected.ward_name
        }
      } else {
        return {
          ward_name: this.wardBiding
        }
      }
    } else if (type == 2) {
      if (this.districtSelected) {
        return {
          district_name: this.districtSelected.district_name
        }
      } else {
        return {
          district_name: this.districtBiding
        }
      }
    } else if (type == 3) {
      if (this.provinceSelected) {
        // this.districtSelected = {
        //   district_name: "",
        // };
        return {
          province_name: this.provinceSelected.province_name
        }
      } else {
        return {
          province_name: this.provinceBiding
        }
      }

    }
    return {}
  }

  setDTOPaymentMethod() {
    if (this.itemBill.PaymentMethod == 0) {
      return {
        Code: 0,
        Method: "Ship COD"
      }
    } else if (this.itemBill.PaymentMethod == 1) {
      return {
        Code: 1,
        Method: "QR Payment"
      }
    } else if (this.itemBill.PaymentMethod == 2) {
      return {
        Code: 2,
        Method: "Bank Transfer"
      }
    }
    return {};
  }

  ClickButtonAction(id: number, event: Event, idStatus: number) {
    const status = this.listStatus.find(status => status.Code === idStatus);
    this.listNextStatus = status ? status.ListNextStatus : null;
    if (this.tempID !== id) {
      this.isClickButton[this.tempID] = false;
    }

    this.isClickButton[id] = !this.isClickButton[id];

    this.tempID = id;

    const cells = document.querySelectorAll('td.k-table-td[aria-colindex="8"]');
    cells.forEach(cell => cell.classList.remove('active'));

    const cell = (event.target as HTMLElement).closest('td.k-table-td[aria-colindex="8"]');
    if (cell) {
      cell.classList.add('active');
    }
  }

  //Check show alert
  clickDropDownAction(item: DTOBillInfo, value: any) {
    if (this.itemBill.Status !== 22) {
      this.itemBillInfo = item;
      this.objItemStatus = value
      this.isShowAlert = !this.isShowAlert;
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.tempID !== null && !(event.target as HTMLElement).closest('td.k-table-td[aria-colindex="8"]')) {
      this.isClickButton[this.tempID] = false;
    }
    if (this.isShowAlert == true && ((event.target as HTMLElement).closest('.buttonNoChange'))) {
      this.isShowAlert = false;
    }
    if (this.isEdit == false && ((event.target as HTMLElement).closest('.button-edit'))) {
      this.isEdit = !this.isEdit;
      this.isDisabled = false;
    }
    if (this.isEdit == true && (((event.target as HTMLElement).closest('.button-update'))) || ((event.target as HTMLElement).closest('.button-restore'))) {
      this.isEdit = false;
      this.isDisabled = !this.isDisabled;
      this.isDisableDistrict = !this.isDisableDistrict;
      this.isDisableWard = !this.isDisableWard;
      this.isDisableSpecific = !this.isDisableSpecific;
    }
    if ((event.target as HTMLElement).closest('.button-addBill')) {
      this.addBill();
    }
    if ((event.target as HTMLElement).closest('.button-addDetailBill')) {
      if (this.itemProduct && this.itemProduct !== null && this.valueSearch !== null) {
        // if(this.valueSearch == this.itemProduct.IdProduct){
        //   this.notiService.Show("Sản phẩm đang được chọn", "warning");
        // } else {
        this.listProduct.push(this.itemProduct);
        this.isProcessAdd = true;
        // }
      } else {
        this.notiService.Show("Vui lòng nhập mã sản phẩm", "warning");
      }
    }
    if ((event.target as HTMLElement).closest('.button-accept')) {
      const product: DTOProductInCart = {
        Product: this.itemProduct,
        Quantity: this.inputQuantity,
        TotalPriceOfProduct: this.totalPriceOfProduct,
        SizeSelected: this.sizeSelected,
      }
      if (this.sizeSelected && this.inputQuantity > 0) {
        this.isDisabledVoucher = false;
        if (this.listProductsInCart.length > 0) {
          const productExist = this.listProductsInCart.find(item => item.Product.IdProduct === this.itemProduct.IdProduct && item.SizeSelected.Size === this.sizeSelected.Size);
          if (productExist) {
            const totalQuantity = productExist.Quantity + this.inputQuantity;
            if (totalQuantity > this.stockOfSizeSelected) {
              this.notiService.Show("Số lượng còn lại trong kho: " + this.stockOfSizeSelected, "warning");
            } else {
              this.totalPriceOfProduct = 0;
              productExist.Quantity += this.inputQuantity;
              productExist.TotalPriceOfProduct = (this.itemProduct.Price - ((this.itemProduct.Price * this.itemProduct.Discount) / 100)) * totalQuantity;
              // productExist.TotalPriceOfProduct = this.itemProduct.Price * totalQuantity;
              this.addSuccess();
            }
          }
          else {
            this.listProductsInCart.push(product);
            this.addSuccess();
          }
        } else {
          this.totalPriceOfProduct = 0;
          this.listProductsInCart.push(product);
          this.addSuccess();
        }

      } else {
        this.notiService.Show("Vui lòng chọn size và số lượng", "warning");
      }
      this.totalPrictOfBill = 0;
      this.listProductsInCart.forEach(item => {
        this.totalPrictOfBill += item.TotalPriceOfProduct;
      });
      if (this.idCoupon && this.idCoupon !== null) {
        this.searchIdCoupon(this.idCoupon);
      }
    }

  }

  //Nhận text của text-area
  receive(value: any) {
    this.reasonFail = value;
  }

  //Set old value Bill
  addSuccess() {
    this.inputQuantity = 0;
    this.totalPriceOfProduct += this.itemProduct.Price * this.inputQuantity;


    this.notiService.Show("Thêm thành công", "success");
  }

  // Lấy danh sách coupon
  getListCoupon() {
    this.isLoading = true;
    this.couponService.getListCoupon(this.gridStateCoupon).pipe(takeUntil(this.destroy)).subscribe(data => {
      this.listCouponAPI = { data: data.ObjectReturn.Data, total: data.ObjectReturn.Total }
      this.listDTOCoupon = this.listCouponAPI.data;
      this.originalListDTOCoupon = [...this.listDTOCoupon];
      this.isLoading = false;
    })
  }

  // Search coupon trong combobox
  handleCoupon(value: string) {
    if (value) {
      this.listDTOCoupon = this.originalListDTOCoupon.filter(coupon =>
        coupon.IdCoupon.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.listDTOCoupon = [...this.originalListDTOCoupon]; // Reset to original list if filter is empty
    }
  }

  // Lấy danh sách các product
  getListProduct() {
    this.isLoading = true;
    this.productAdminService.getListProduct(this.gridStateProduct).pipe(takeUntil(this.destroy)).subscribe(list => {
      this.listProductAPI = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      this.listDTOProduct = this.listProductAPI.data;
      this.originalListDTOProduct = [...this.listDTOProduct]; // Copy the original list
      this.isLoading = false;
    });
  }


  // Search product trong combobox
  handleFilter(value: string) {
    if (value && this.listProductsInCart.length > 0) {
      this.listDTOProduct = this.originalListDTOProduct.filter(product =>
        product.Name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.listDTOProduct = [...this.originalListDTOProduct];
    }
  }

  searchIdCoupon(id: string) {
    // console.log(id);
    if (id !== null && id !== undefined && this.listProductsInCart.length > 0) {
      this.idCoupon = id;
      this.numberCoupon = 0;
      this.totalPrictOfBill = 0;
      this.listProductsInCart.forEach(item => {
        this.totalPrictOfBill += item.TotalPriceOfProduct;
      });
      this.couponService.getCouponByIdCoupon(id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: item => {
            if (item.RemainingQuantity > 0) {
              if (this.totalPrictOfBill >= item.MinBillPrice) {
                this.idCoupon = item.IdCoupon;
                if (item.DirectDiscount) {
                  this.priceCoupon = item.DirectDiscount;
                } else if (item.PercentDiscount) {
                  this.priceCoupon = (this.totalPrictOfBill * item.PercentDiscount) / 100;
                }

                if (item.MaxBillDiscount) {
                  this.maxCoupon = item.MaxBillDiscount;
                }

                if (this.priceCoupon > this.maxCoupon) {
                  this.numberCoupon = this.maxCoupon;
                } else {
                  this.numberCoupon = this.priceCoupon;
                }

                this.totalPrictOfBill -= this.numberCoupon;
                this.notiService.Show("Thêm voucher thành công", "success");

              } else {
                this.notiService.Show("Yêu cầu đơn tối thiểu là: " + this.formatCurrency(item.MinBillPrice), "warning");
              }
            } else {
              this.notiService.Show("Số lượng không đủ", "warning");
            }
          },
          error: err => {
            if (err.message === 'Coupon not found or inactive') {
              this.itemProduct = null;
              this.notiService.Show("Không có voucher hoặc voucher bị vô hiệu hóa", "warning");
            } else {
              console.error('Unexpected error:', err);
            }
          }
        });
    } else {
      this.numberCoupon = 0;
      this.totalPrictOfBill = 0;
      this.listProductsInCart.forEach(item => {
        this.totalPrictOfBill += item.TotalPriceOfProduct;
      });
    }
  }

  searchIdProduct(id: string) {
    // console.log(id);
    if (id !== null && id !== undefined) {
      this.productService.getProductByIdProduct(id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: item => {
            if (item.Stock > 0) {
              if (this.itemProduct) {
                if (id !== this.itemProduct.IdProduct) {
                  console.log(this.listProduct);
                  this.listProduct = [];
                  this.inputQuantity = 0;
                  this.valueSearch = id;
                  this.notiService.Show(item.Name + " số lượng còn: " + item.Stock, "success");
                  this.itemProduct = item;
                  this.listOfSize = item.ListOfSize.filter(size => size.Stock > 0)
                  this.priceOfProduct = item.Price;
                  // this.discountProduct = item.Discount;
                  this.discountOfEeachId[id] = item.Discount;
                  this.sizeSelected = null;
                  this.priceProductAfterDiscount = item.Price - ((item.Price * item.Discount) / 100);
                  // this.totalPriceOfProduct = this.priceProductAfterDiscount;
                  this.isProcessAdd = false;
                }
              } else {
                this.valueSearch = id;
                this.notiService.Show(item.Name + " số lượng còn: " + item.Stock, "success");
                this.itemProduct = item;
                this.listOfSize = item.ListOfSize.filter(size => size.Stock > 0)
                this.priceOfProduct = item.Price;
                // this.discountProduct = item.Discount;
                this.discountOfEeachId[id] = item.Discount;
                this.sizeSelected = null;
                this.priceProductAfterDiscount = item.Price - ((item.Price * item.Discount) / 100);
              }
            } else {
              this.notiService.Show("Số lượng không đủ", "warning");
            }
          },
          error: err => {
            if (err.message === 'Product not found or inactive') {
              this.itemProduct = null;
              this.notiService.Show("Không có sản phẩm hoặc sản phẩm bị vô hiệu hóa", "warning");
            } else {
              console.error('Unexpected error:', err);
            }
          }
        });
    } else {

    }
  }

  countStatuses() {
    // if(this.listOfSize){
    //   this.stockOfEeachSize = this.listOfSize.reduce((size, stock) => {
    //     const stocks = stock.Stock;
    //     return size[stocks]
    //   }, {});
    // }
  }

  getStockOfSize(size: any): void {
    this.sizeSelected = size;
    this.stockOfSizeSelected = size.Stock;
    this.inputQuantity = 0;
  }

  decreaseQuantity() {
    if (this.stockOfSizeSelected && this.sizeSelected !== null) {
      if (this.inputQuantity > 0) {
        this.inputQuantity--;
        this.totalPriceOfProduct = this.priceProductAfterDiscount * this.inputQuantity;
      }
    }
    else {
      this.notiService.Show("Vui lòng chọn Size", "warning");
    }
  }

  increaseQuantity() {
    if (this.stockOfSizeSelected && this.sizeSelected !== null) {
      if (this.inputQuantity < this.stockOfSizeSelected) {
        this.inputQuantity++;
        this.totalPriceOfProduct = this.priceProductAfterDiscount * this.inputQuantity;
      } else {
        this.notiService.Show("Số lượng còn lại trong kho là: " + this.stockOfSizeSelected, "warning");
        this.inputQuantity = this.stockOfSizeSelected;
      }
    } else if (this.stockOfSizeSelected == 0) {
      this.notiService.Show("Số lượng còn lại trong kho là: " + this.stockOfSizeSelected, "warning");
    }
    else {
      this.notiService.Show("Vui lòng chọn Size", "warning");
    }
  }



  checkStockOfSizeSelected() {
    if (this.stockOfSizeSelected === null || this.stockOfSizeSelected === undefined) {
      setTimeout(() => {
        this.notiService.Show("Vui lòng chọn Size", "warning");
        this.inputQuantity = 0
      });
    } else if (this.inputQuantity > this.stockOfSizeSelected) {
      setTimeout(() => {
        this.notiService.Show("Số lượng còn lại trong kho là: " + this.stockOfSizeSelected, "warning");
        this.inputQuantity = this.stockOfSizeSelected;
        this.totalPriceOfProduct = this.priceProductAfterDiscount * this.stockOfSizeSelected;
      });
    } else if ((this.stockOfSizeSelected !== null && this.stockOfSizeSelected !== undefined) && (this.inputQuantity <= this.stockOfSizeSelected)) {
      this.totalPriceOfProduct = this.priceProductAfterDiscount * this.inputQuantity;
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

  removeProductOfList(rowIndex: number): void {
    const adjustedIndex = rowIndex;
    this.listProduct = this.listProduct.filter((_, index) => index !== adjustedIndex);
    this.isProcessAdd = false;

  }

  removeProductInCart(value: DTOProductInCart): void {
    this.listProductsInCart = this.listProductsInCart.filter(
      item => !(item.Product.IdProduct === value.Product.IdProduct && item.SizeSelected === value.SizeSelected)
    );

    this.notiService.Show("Xóa thành công", "success");
    this.totalPrictOfBill = 0;
    this.listProductsInCart.forEach(item => {
      this.totalPrictOfBill += item.TotalPriceOfProduct;
    });
    if (this.listProductsInCart.length == 0) {
      this.isDisabledVoucher = true;
      this.numberCoupon = 0;
    } else {
      if (this.idCoupon && this.idCoupon !== null) {
        this.searchIdCoupon(this.idCoupon);
      }
    }

    console.log(this.listProductsInCart);
  }

  checkValueForm() {
    if (!isAlphabetWithSingleSpace(this.childName.valueTextBox) || this.childName.valueTextBox == "") {
      this.notiService.Show("Vui lòng nhập lại thông tin họ tên", "error");
      return false;
    }
    if (this.childProvince.value == "Chọn tỉnh, thành phố") {
      this.notiService.Show("Vui lòng chọn tỉnh, thành phố", "error");
      return false;
    }
    if (this.childDistrict.value == "Chọn huận, huyện") {
      this.notiService.Show("Vui lòng chọn huận, huyện", "error");
      return false;
    }
    if (this.childWard.value == "Chọn thị xã, trấn") {
      this.notiService.Show("Vui lòng chọn thị xã, trấn", "error");
      return false;
    }
    if (this.childRoad.valueTextBox == "") {
      this.notiService.Show("Vui lòng nhập lại thông tin đường", "error");
      return false;
    }
    if (this.childSpecific.valueTextBox == "") {
      this.notiService.Show("Vui lòng nhập lại thông tin địa chỉ cụ thể", "error");
      return false;
    }
    if (!isValidPhoneNumber(this.childPhoneNumber.valueTextBox) || this.childPhoneNumber.valueTextBox == "") {
      this.notiService.Show("Vui lòng nhập lại thông tin số người nhận", "error");
      return false;
    }
    if (!isValidPhoneNumber(this.childOrdererPhoneNumber.valueTextBox) || this.childOrdererPhoneNumber.valueTextBox == "") {
      this.notiService.Show("Vui lòng nhập lại thông tin số điện thoại", "error");
      return false;
    }
    if (this.listProductsInCart.length <= 0) {
      this.notiService.Show("Vui lòng thêm sản phẩm", "error");
      return false;
    }
    return true;
  }


  //Add Bill
  addBill() {
    const requestAddBill: DTOProcessToPayment = {
      CustomerName: this.childName.valueTextBox,
      OrdererPhoneNumber: this.childOrdererPhoneNumber.valueTextBox,
      PhoneNumber: this.childPhoneNumber.valueTextBox,
      ShippingAddress: this.newAddress,
      PaymentMethod: 0,
      CouponApplied: this.idCoupon,
      // PaymentMethod: this.childMethod.value.Code,
      ListProduct: this.listProductsInCart,
      TotalBill: this.totalPrictOfBill,
      IsGuess: true,
    }

    console.log(requestAddBill);

    const request: DTOUpdateBillRequest = {
      DTOUpdateBill: null,
      DTOProceedToPayment: requestAddBill
    }


    if (this.checkValueForm()) {
      this.billService.updateBill(request).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          this.notiService.Show("Thêm mới thành công", "success")
          this.sendValue.emit(0)
        }
      }, error => {
        console.error('Error:', error);
      });
    } else {
      return;
    }


  }

  log(value: any) {
    console.log(value);
  }

  //Kiểm tra status của Bill và BillInfo
  checkStatusBill(status: number) {
    // Case 1: status là 14 hoặc 15
    if (status === 14 || status === 15) {
      this.setStatusBill = 14;
    }
    // Case 2: status là 10 hoặc 11 hoặc 18
    // status !== 14 && status !== 15 && status !== 20 && status !== 21 && status !== 12 && status !== 13 && status !== 19
    else if (status === 10 || status === 11 || status === 18) {
      if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status === 14 || item.Status === 15))) {
        this.setStatusBill = 14;
      } else {
        this.setStatusBill = 16;
      }
    }
    // Case 3: status là 20 hoặc 21
    else if (status === 20 || status === 21) {
      if (this.itemBill.Status === 14) {
        if (status == 20) {
          if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status !== 20 && item.Status !== 8))) {
            if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status == 14 || item.Status == 15))) {
              this.setStatusBill = 14;
            }
            else if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status == 10 || item.Status == 11 || item.Status == 18))) {
              this.setStatusBill = 16;
            }
            else {
              this.setStatusBill = 22;
            }
          } else {
            this.setStatusBill = 20;
          }
        } else if (status == 21) {
          if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status !== 21 && item.Status !== 8))) {
            if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status == 14 || item.Status == 15))) {
              this.setStatusBill = 14;
            }
            else if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status == 10 || item.Status == 11 || item.Status == 18))) {
              this.setStatusBill = 16;
            }
            else {
              this.setStatusBill = 22;
            }
          } else {
            this.setStatusBill = 21;
          }
        }
      }
      else if (this.itemBill.Status === 16) {
        if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status == 10 || item.Status == 11 || item.Status == 18))) {
          this.setStatusBill = 16;
        }
      }
    }
    // Case 4: status là 12 hoặc 13 hoặc 19
    else {
      if (this.itemBill.Status === 14) {
        if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status == 14 || item.Status == 15))) {
          this.setStatusBill = 14;
        }
        else {
          this.setStatusBill = 22;
        }
      }
      else if (this.itemBill.Status === 16) {
        if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status == 10 || item.Status == 11 || item.Status == 18))) {
          this.setStatusBill = 16;
        }
        else {
          this.setStatusBill = 22;
        }
      }
    }

  }

  // Update status bill
  updateStatusBillInfo(obj: any) {
    if (obj.value >= 1) {
      this.checkStatusBill(obj.value);
      // alert(this.setStatusBill)
      let requestUpdateBill: DTOUpdateBill;
      this.itemBill.Status = obj.value;
      if (obj.value == 13 || obj.value == 14 || obj.value == 15 || obj.value == 20 || obj.value == 21) {
        if (this.reasonFail && this.reasonFail !== null) {
          let reasonBill;
          if (this.itemBill.Note && this.itemBill.Note !== null) {
            reasonBill = this.itemBill.Note + "\n" + "- " + this.itemBillInfo.IDProduct + "_" + this.itemBillInfo.Size + ": " + this.formatStatus(obj.value) + ": " + this.reasonFail;
          } else {
            reasonBill = "- " + this.itemBillInfo.IDProduct + "_" + this.itemBillInfo.Size + ": " + this.formatStatus(obj.value) + ": " + this.reasonFail;
          }
          requestUpdateBill = {
            CodeBill: this.itemBill.Code,
            Status: this.setStatusBill,
            ListOfBillInfo: this.itemBill.ListBillInfo,
            Note: reasonBill,
          }

          requestUpdateBill.ListOfBillInfo.forEach(billInfo => {
            if (billInfo.Code == this.itemBillInfo.Code) {
              billInfo.Note = this.reasonFail;
              billInfo.Status = obj.value;
            }
          })
          this.reasonFail = null;
        } else {
          this.notiService.Show("Vui lòng nhập lí do", "warning")
          return;
        }
      } else {
        requestUpdateBill = {
          CodeBill: this.itemBill.Code,
          Status: this.setStatusBill,
          ListOfBillInfo: this.itemBill.ListBillInfo,
          Note: this.itemBill.Note,
        }

        requestUpdateBill.ListOfBillInfo.forEach(billInfo => {
          if (billInfo.Code == this.itemBillInfo.Code) {
            billInfo.Status = obj.value;
          }
        })
      }

      if (requestUpdateBill) {
        const request: DTOUpdateBillRequest = {
          DTOUpdateBill: requestUpdateBill,
          DTOProceedToPayment: null
        }
        this.billService.updateBill(request).subscribe((res: DTOResponse) => {
          console.log(res);
          if (res.StatusCode === 0) {
            this.notiService.Show("Cập nhật trạng thái thành công", "success")
            // this.getListBillInfo();
            this.isShowAlert = false;
            this.isLoading = true;
            this.sendValue.emit(0);
          }
        }, error => {
          console.error('Error:', error);
        });
      }
    }
  }
}
