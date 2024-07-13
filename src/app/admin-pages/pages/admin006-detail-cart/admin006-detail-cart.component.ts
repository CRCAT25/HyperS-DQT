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
  listProductsInCartTest: DTOProductInCart[] = [
    {
      "Product": {
        "Code": 125,
        "IdProduct": "AestzP001123",
        "Name": "PROTEST02",
        "CodeProductType": 2,
        "ProductType": "Sneakers",
        "CodeBrand": 5,
        "BrandName": "Vans",
        "Price": 40000,
        "Description": null,
        "Stock": 28,
        "Sold": 24,
        "Color": "Xanh dương",
        "Gender": 2,
        "Discount": null,
        "PriceAfterDiscount": 40000,
        "Status": 0,
        "ThumbnailImg": "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e4a3fabb-5cda-46cd-9a12-4f9cc3840ab5/air-force-1-07-shoes-NMmm1B.png",
        "ListOfImage": [
          {
            "Code": 510,
            "IdImage": null,
            "ImgUrl": "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e4a3fabb-5cda-46cd-9a12-4f9cc3840ab5/air-force-1-07-shoes-NMmm1B.png",
            "IsThumbnail": false
          },
          {
            "Code": 511,
            "IdImage": null,
            "ImgUrl": "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0084df47-cf15-41d5-aab6-984460364e41/court-vision-low-next-nature-shoes-N2fFHb.png",
            "IsThumbnail": false
          },
          {
            "Code": 512,
            "IdImage": null,
            "ImgUrl": "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/57558712-5ebe-4abb-9984-879f9e896b4c/air-force-1-07-easyon-shoes-lpjTWM.png",
            "IsThumbnail": true
          },
          {
            "Code": 513,
            "IdImage": null,
            "ImgUrl": "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0084df47-cf15-41d5-aab6-984460364e41/court-vision-low-next-nature-shoes-N2fFHb.png",
            "IsThumbnail": false
          },
          {
            "Code": 514,
            "IdImage": null,
            "ImgUrl": "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0084df47-cf15-41d5-aab6-984460364e41/court-vision-low-next-nature-shoes-N2fFHb.png",
            "IsThumbnail": false
          },
          {
            "Code": 509,
            "IdImage": null,
            "ImgUrl": "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0084df47-cf15-41d5-aab6-984460364e41/court-vision-low-next-nature-shoes-N2fFHb.png",
            "IsThumbnail": false
          }
        ],
        "ListOfSize": [
          {
            "Code": 1,
            "Size": 35,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 2,
            "Size": 36,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 3,
            "Size": 37,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 4,
            "Size": 38,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 5,
            "Size": 39,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 6,
            "Size": 40,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 7,
            "Size": 41,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 8,
            "Size": 42,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 9,
            "Size": 43,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 10,
            "Size": 44,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 11,
            "Size": 45,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 12,
            "Size": 46,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 13,
            "Size": 47,
            "Stock": 0,
            "Sold": 0
          },
          {
            "Code": 14,
            "Size": 48,
            "Stock": 0,
            "Sold": 0
          }
        ]
      },
      "Quantity": 1,
      "SizeSelected": {
        "Code": 6,
        "Size": 40,
        "Stock": 0,
        "Sold": 0
      },
      "TotalPriceOfProduct": 40000
    }
  ];
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
  @ViewChild('phoneNumber') childPhoneNumber!: TextInputComponent;
  @ViewChild('method') childMethod!: TextDropdownComponent;
  @ViewChild('note') childNote!: TextAreaComponent;
  @ViewChild('province') childProvince!: TextDropdownComponent;
  @ViewChild('district') childDistrict!: TextDropdownComponent;
  @ViewChild('ward') childWard!: TextDropdownComponent;
  @ViewChild('specific') childSpecific!: TextInputComponent;
  @ViewChild('road') childRoad!: TextInputComponent;
  @ViewChild('search') childSearch!: SearchBarComponent;

  filterProductActive: FilterDescriptor = { field: 'Status', operator: 'eq', value: 0, ignoreCase: true };

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

  listProductAPI: GridDataResult;
  listDTOProduct: DTOProduct[];
  originalListDTOProduct: DTOProduct[];


  ngOnInit(): void {
    if (this.isAdd == false) {
      this.getListBillInfo();
    }
    this.APIGetProvince();
    this.getListProduct();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }


  constructor(private billService: BillService,
    private notiService: NotiService,
    private paymentService: PaymentService,
    private productService: ProductAdminService,
    private productAdminService: ProductAdminService) { }




  getListBillInfo() {
    this.itemBill = this.itemData;
    this.listBillInfo = this.listData;
    console.log("itemBill");
    console.log(this.itemBill);
    console.log("b");
    console.log(this.itemBill.ListBillInfo);
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
      default:
        return 'Unknow';
    }
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
        this.isLoadingDistrict = false
      }

    })
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
        this.isLoadingWard = false
      }

    })
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
    this.itemBillInfo = item;
    this.objItemStatus = value
    this.isShowAlert = !this.isShowAlert;
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
          //For listProductInCart để push product vào

          // for (let i = 0; i < this.listProductsInCart.length; i++) {
          //   let item = this.listProductsInCart[i];
          //   console.log(item);
          //   if(this.itemProduct.IdProduct == item.Product.IdProduct && this.sizeSelected.Size == item.SizeSelected.Size){
          //     const totalQuantity = item.Quantity + this.inputQuantity;
          //     if(totalQuantity > this.stockOfSizeSelected){
          //       this.notiService.Show("Số lượng còn lại trong kho: "+ this.stockOfSizeSelected, "warning");
          //     } else{
          //       console.log('b');
          //       item.Quantity += this.inputQuantity;
          //       item.TotalPriceOfProduct = this.itemProduct.Price * totalQuantity;
          //       this.addSuccess();
          //       break;
          //     }
          //   } else if (this.sizeSelected.Size !== item.SizeSelected.Size) {
          //     console.log('a');
          //     this.listProductsInCart.push(product);
          //     this.addSuccess();
          //     break;
          //   }
          // }

        } else {
          this.totalPriceOfProduct = 0;
          this.listProductsInCart.push(product);
          this.addSuccess();
        }

      } else {
        this.notiService.Show("Vui lòng chọn size và số lượng", "warning");
      }
      // console.log(this.listProductsInCart);
      this.totalPrictOfBill = 0;
      this.listProductsInCart.forEach(item => {
        this.totalPrictOfBill += item.TotalPriceOfProduct;
      });
    }
    // if((event.target as HTMLElement).closest('.button-x')){
    //   this.notiService.Show("Xóa thành công", "success");
    //   this.listProduct = this.listProduct.filter(product => product.IdProduct !== this.itemProduct!.IdProduct);
    //   this.isProcessAdd = false;
    //   console.log(this.listProduct);
    // }

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
    this.isProcessAdd = false;
  }

  // Lấy danh sách các product
  getListProduct() {
    this.isLoading = true;
    this.productAdminService.getListProduct(this.gridStateProduct).pipe(takeUntil(this.destroy)).subscribe(list => {
      this.listProductAPI = { data: list.ObjectReturn.Data, total: list.ObjectReturn.Total };
      this.isLoading = false;
      this.listDTOProduct = this.listProductAPI.data;
      this.originalListDTOProduct = [...this.listDTOProduct]; // Copy the original list
      console.log(this.listDTOProduct);
    });
  }

  handleFilter(value: string) {
    if (value) {
      this.listDTOProduct = this.originalListDTOProduct.filter(product =>
        product.Name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.listDTOProduct = [...this.originalListDTOProduct]; // Reset to original list if filter is empty
    }
  }

  searchIdProduct(id: string) {
    console.log(id);
    if (id !== null) {
      this.productService.getProductByIdProduct(id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: item => {
            if (item.Stock > 0) {
              if (this.itemProduct) {
                if (id !== this.itemProduct.IdProduct) {
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
                // else if(id == this.itemProduct.IdProduct ){
                //   this.notiService.Show("Sản phẩm đang được chọn", "warning");
                // }
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
                // this.totalPriceOfProduct = this.priceProductAfterDiscount;
              }
            } else {
              this.notiService.Show("Số lượng không đủ", "warning");
            }
            // console.log(this.itemProduct);
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
        // this.priceProductAfterDiscount = item.Price - ((item.Price * item.Discount)/100);
        // console.log(this.priceProductAfterDiscount);
        // this.totalPriceOfProduct = this.priceProductAfterDiscount;
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

  // setToListProductInCart(type: string){
  //   if(type == "ok"){
  //     alert("ok")
  //     const product: DTOProductInCart = {
  //       Product: this.itemProduct,
  //       Quantity: this.inputQuantity,
  //       TotalPriceOfProduct: this.totalPriceOfProduct,
  //       SizeSelected: this.sizeSelected,
  //     }
  //     this.listProductsInCart.push(product)
  //     console.log(this.listProductsInCart);
  //   } else if(type == "ok"){
  //     this.listProduct.filter(product => product.IdProduct !== this.itemProduct.IdProduct);
  //   }
  // }


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
    // const index = this.listProductsInCart.findIndex(item => item.Product.IdProduct === value.Product.IdProduct && item.SizeSelected === value.SizeSelected)
    // if(index !== -1){
    //   this.listProductsInCart = this.listProductsInCart.slice(index, 1)
    // }
    this.notiService.Show("Xóa thành công", "success");
    this.totalPrictOfBill = 0;
    this.listProductsInCart.forEach(item => {
      this.totalPrictOfBill += item.TotalPriceOfProduct;
    });
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
    if (!isAlphabetWithSingleSpace(this.childRoad.valueTextBox) || this.childRoad.valueTextBox == "") {
      this.notiService.Show("Vui lòng nhập lại thông tin đường", "error");
      return false;
    }
    if (this.childSpecific.valueTextBox == "") {
      this.notiService.Show("Vui lòng nhập lại thông tin địa chỉ cụ thể", "error");
      return false;
    }
    if (!isValidPhoneNumber(this.childPhoneNumber.valueTextBox) || this.childPhoneNumber.valueTextBox == "") {
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
      OrdererPhoneNumber: this.childPhoneNumber.valueTextBox,
      PhoneNumber: this.childPhoneNumber.valueTextBox,
      ShippingAddress: this.newAddress,
      PaymentMethod: 0,
      CouponApplied: "",
      // PaymentMethod: this.childMethod.value.Code,
      ListProduct: this.listProductsInCart,
      TotalBill: 0,
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
  // checkStatusBill(status: number){
  //   console.log("c");
  //   console.log(this.itemBill.ListBillInfo);
  //   //Bill status = "Khách yêu cầu đổi trả"
  //   if(status == 14 || status == 15){
  //     this.setStatusBill = 14;
  //     //Bill status = "Xác nhận đổi trả" hoặc vẫn giữ "Khách yêu cầu đổi trả"
  //   } else if (status !== 14 && status !== 15 && status !== 20 && status !== 21){ 
  //       //Bill status = "Khách yêu cầu đổi trả"
  //       if(this.itemBill.ListBillInfo.find(status => status.Status == 14 || status.Status == 15)){
  //         alert('a')
  //         this.setStatusBill = 14;
  //         //Bill status = "Xác nhận đổi trả"
  //       } else {
  //         this.setStatusBill = 16;
  //       }
  //   } else if ((status !== 14 && status !== 15) && (status == 20 || status == 21)){ 
  //     if(this.itemBill.Status == 14){
  //       if(this.itemBill.ListBillInfo.find(status => status.Status !== 20 && status.Status !== 21)){
  //         this.setStatusBill = 14;
  //       } else{
  //         if(this.itemBill.ListBillInfo.find(status => status.Status !== 20)){
  //           this.setStatusBill = 22;
  //         } else {
  //           this.setStatusBill = 20;
  //         }

  //         if(this.itemBill.ListBillInfo.find(status => status.Status !== 21)){
  //           this.setStatusBill = 22;
  //         } else {
  //           this.setStatusBill = 21;
  //         }
  //       }
  //     }
  //   } 
  //   // else if (status == 19 || status == 12 || status == 13){

  //   // }
    
  // }

  checkStatusBill(status: number){
    console.log("c");
    console.log(this.itemBill.ListBillInfo);
    
    // Case 1: status is 14 or 15
    if (status === 14 || status === 15) {
        this.setStatusBill = 14;
    } 
    // Case 2: status is not 14, 15, 20, or 21
    else if (status !== 14 && status !== 15 && status !== 20 && status !== 21) {
        if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status === 14 || item.Status === 15))) {
            this.setStatusBill = 14;
        } else {
            this.setStatusBill = 16;
        }
    } 
    // Case 3: status is 20 or 21
    else if (status === 20 || status === 21) {
      alert('a')
        if (this.itemBill.Status === 14) {
          if(status == 20){
            alert('b')
            if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status !== 20 && item.Status !== 8))) {
              console.log(this.itemBill.ListBillInfo);
              if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status == 14 || item.Status == 15))) {
                alert('c')
                this.setStatusBill = 14;
              } else {
                this.setStatusBill = 22;
              }
            } else {
              this.setStatusBill = 20;
            }
          } else if(status == 21){
            if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status !== 21 && item.Status !== 8))) {
              if (this.itemBill.ListBillInfo.find(item => item.Code !== this.itemBillInfo.Code && (item.Status == 14 || item.Status == 15))) {
                this.setStatusBill = 14;
              } else {
                this.setStatusBill = 22;
              }
            } else {
              this.setStatusBill = 21;
            }
          }
        } else if(this.itemBill.Status === 20 || this.itemBill.Status === 21){

        }
    }
}

  // Update status bill
  updateStatusBillInfo(obj: any) {
    if (obj.value >= 1) {
      this.checkStatusBill(obj.value);
      alert(this.setStatusBill)
      let requestUpdateBill: DTOUpdateBill;
      this.itemBill.Status = obj.value;
      if(obj.value == 13 || obj.value == 14 || obj.value == 15 || obj.value == 20 || obj.value == 21){
        if(this.reasonFail){
          let reasonBill;
          if (this.itemBill.Note && this.itemBill.Note !== null) {
            reasonBill = this.itemBill.Note + "\n" + "- " + this.itemBillInfo.IDProduct + "_" + this.itemBillInfo.Size + ": " + obj.value + ": " + this.reasonFail;
        } else {
            reasonBill = "- " + this.itemBillInfo.IDProduct + "_" + this.itemBillInfo.Size + ": " + obj.value + ": " + this.reasonFail;
        }
          // const reasonBill: string = this.itemBill.Note + "\n" + "- " +this.itemBillInfo.IDProduct+"_"+this.itemBillInfo.Size+": "+obj.value+": "+this.reasonFail;
          requestUpdateBill = {
            CodeBill: this.itemBill.Code,
            Status: this.setStatusBill,
            ListOfBillInfo: this.itemBill.ListBillInfo,
            Note: reasonBill,
          }
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
      }
      // const requestUpdateBill: DTOUpdateBill = {
      //   CodeBill: this.itemBill.Code,
      //   Status: obj.value,
      //   ListOfBillInfo: this.itemBill.ListBillInfo,
      //   Note: reasonBill,
      // }

      if(requestUpdateBill){
        requestUpdateBill.ListOfBillInfo.forEach(billInfo => {
          if (billInfo.Code == this.itemBillInfo.Code) {
            billInfo.Status = obj.value;
          }
        })
  
        const request: DTOUpdateBillRequest = {
          DTOUpdateBill: requestUpdateBill,
          DTOProceedToPayment: null
        }
        this.billService.updateBill(request).subscribe((res: DTOResponse) => {
          if (res.StatusCode === 0) {
            this.notiService.Show("Cập nhật trạng thái thành công", "success")
            this.getListBillInfo();
            this.isShowAlert = false;
            this.sendValue.emit(0);
  
          }
        }, error => {
          console.error('Error:', error);
        });
      }
    }
  }
}
