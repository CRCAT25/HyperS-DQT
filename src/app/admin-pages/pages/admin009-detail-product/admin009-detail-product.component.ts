import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductAdminService } from '../../shared/service/productAdmin.service';
import { DTOProduct } from 'src/app/ecom-pages/shared/dto/DTOProduct';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOUpdateProductRequest } from 'src/app/shared/dto/DTOUpdateProductRequest.dto';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { DTOColor, listColor } from '../../shared/dto/DTOColor.dto.';
import { Observable, ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DTOProductType } from 'src/app/ecom-pages/shared/dto/DTOProductType';
import { DTOBrand } from 'src/app/ecom-pages/shared/dto/DTOBrand';
import { TextInputComponent } from 'src/app/shared/component/text-input/text-input.component';
import { TextDropdownComponent } from 'src/app/shared/component/text-dropdown/text-dropdown.component';
import { ImportMultiImageComponent } from '../../shared/component/import-multi-image/import-multi-image.component';
import { TextAreaComponent } from 'src/app/shared/component/text-area/text-area.component';
import { DTOSize, listSize } from 'src/app/ecom-pages/shared/dto/DTOSize';
import { Router } from '@angular/router';

interface Gender {
  Code: number
  Gender: string
  IsChecked?: boolean
}

@Component({
  selector: 'app-admin009-detail-product',
  templateUrl: './admin009-detail-product.component.html',
  styleUrls: ['./admin009-detail-product.component.scss']
})
export class Admin009DetailProductComponent implements OnInit, OnDestroy {
  // variables 
  startSize: number = 35;
  endSize: number = 48;

  // variables object
  productSelected: DTOProduct;
  defaultProductType: DTOProductType = {
    Code: -1,
    Name: '-- Loại sản phẩm --'
  };
  defaultBrand: DTOBrand = {
    Code: -1,
    Name: '-- Thương hiệu --',
    ImageUrl: '',
  };
  defaultColor: DTOColor = {
    Color: '-- Màu sắc --'
  }
  defaultGender: Gender = {
    Code: -1,
    Gender: '-- Giới tính --',
  }

  // variables Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  // variables list
  listColor: DTOColor[] = listColor;
  listProductType: DTOProductType[];
  listBrand: DTOBrand[];
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
  listSize: DTOSize[];
  listSizeHandle: DTOSize[] = listSize;
  listSizeDefault: DTOSize[] = listSize;
  listPropertiesUpdate: string[] = [
    'IdProduct',
    'Name',
    'Price',
    'Description',
    'CodeProductType',
    'ProductType',
    'CodeBrand',
    'BrandName',
    'Gender',
    'Color',
  ]

  // variable ViewChilds
  @ViewChild('id') childId!: TextInputComponent;
  @ViewChild('name') childName!: TextInputComponent;
  @ViewChild('start') childStartSize!: TextInputComponent;
  @ViewChild('end') childEndSize!: TextInputComponent;
  @ViewChild('color') childColor!: TextDropdownComponent;
  @ViewChild('type') childType!: TextDropdownComponent;
  @ViewChild('brand') childBrand!: TextDropdownComponent;
  @ViewChild('gender') childGender!: TextDropdownComponent;
  @ViewChild('price') childPrice!: TextInputComponent;
  @ViewChild('sold') childSold!: TextInputComponent;
  @ViewChild('stock') childStock!: TextInputComponent;
  @ViewChild('listimage') childListImage!: ImportMultiImageComponent;
  @ViewChild('desciption') childDescription!: TextAreaComponent;
  @ViewChild('discount') childDiscount!: TextInputComponent;

  constructor(private productAdminService: ProductAdminService, private notiService: NotiService, private router: Router) { }

  ngOnInit(): void {
    this.getProductSelected();
    this.getListProductType();
    this.getListBrand();
  }

  // Lấy sản phẩm được chọn
  getProductSelected() {
    const code = localStorage.getItem('productSelected');
    if (parseInt(code) === 0) {
      this.productSelected = new DTOProduct;
      this.getListProductType();
      this.getListBrand();
      this.productSelected.Gender = -1;
      this.productSelected.Color = '-- Màu sắc --';
      this.productSelected.CodeBrand = -1;
      this.productSelected.CodeProductType = -1;
      this.childStartSize.valueTextBox = '35';
      this.childEndSize.valueTextBox = '48';
    }
    else {
      this.productAdminService.getProductByCode(parseInt(code)).pipe(takeUntil(this.destroy)).subscribe((product: DTOResponse) => {
        this.productSelected = product.ObjectReturn.Data[0];
        this.listSize = this.updateListSize(this.listSizeDefault, this.productSelected.ListOfSize);
        this.listSizeHandle = this.productSelected.ListOfSize;
        this.listSizeHandle.sort((a, b) => a.Size - b.Size);
        this.startSize = this.listSizeHandle[0].Size;
        this.endSize = this.listSizeHandle[this.listSizeHandle.length - 1].Size;
        if (this.childStartSize && this.childEndSize) {
          this.childStartSize.valueTextBox = this.listSizeHandle[0].Size.toString();
          this.childEndSize.valueTextBox = this.listSizeHandle[this.listSizeHandle.length - 1].Size.toString();
        }
      });
    }
  }

  // Lấy danh sách các product type
  getListProductType() {
    this.productAdminService.getListProductType().pipe(takeUntil(this.destroy)).subscribe(list => this.listProductType = list.ObjectReturn.Data);
  }

  // Lấy danh sách các brand
  getListBrand() {
    this.productAdminService.getListBrand().pipe(takeUntil(this.destroy)).subscribe(list => this.listBrand = list.ObjectReturn.Data);
  }

  // Kiểm tra giới tính
  checkGender(idGender: number) {
    if (idGender === 0) return 'Unisex';
    if (idGender === 1) return 'Nam';
    if (idGender === 2) return 'Nữ';
    return 'Lỗi giới tính';
  }

  // Cật nhật sản phẩm
  updateProduct(product: DTOProduct, obj: any, properties: string[], action: string) {
    if (obj.value >= 0) {
      product.Status = obj.value;
      const request: DTOUpdateProductRequest = {
        Product: product,
        Properties: properties
      }
      this.productAdminService.updateProduct(request).subscribe((res: DTOResponse) => {
        this.notiService.Show(action + " thành công", "success");
        this.router.navigate(['admin/manage-product']);
        this.getProductSelected();
      }, error => {
        this.notiService.Show(action + " thất bại", "error");
        console.error('Error:', error);
      });
    }
  }

  // Xóa toàn bộ thông tin sản phẩm
  clearDetailProduct(res: any) {
    // reset id sản phẩm
    this.childId.resetValue();
    // reset tên sản phẩm
    this.childName.resetValue();
    // reset màu sắc sản phẩm
    this.childColor.resetValue();
    // reset loại sản phẩm
    this.childType.resetValue();
    // reset thương hiệu
    this.childBrand.resetValue();
    // reset giới tính
    this.childGender.resetValue();
    // reset giá sản phẩm
    this.childPrice.resetValue();
    this.childPrice.valueTextBox = '0';
    // reset tồn kho
    this.childStock.resetValue();
    this.childStock.valueTextBox = '0';
    // reset số lượng đã bán
    this.childSold.resetValue();
    this.childSold.valueTextBox = '0';
    // reset giảm giá
    this.childDiscount.valueTextBox = '0'
    // reset mô tả
    this.childDescription.resetValue();
    // reset hình ảnh
    this.childListImage.clearListImage();
    // reset size
    this.listSizeHandle = listSize;
    this.notiService.Show("Đã xóa toàn bộ thông tin", "success");
  }

  // Kiểm tra trạng thái hiện tại của sản phẩm
  checkCurrentStatus(status: number) {
    if (status === 0) {
      return 'Sản phẩm đang kinh doanh';
    }
    if (status === 1) {
      return 'Sản phẩm ngưng kinh doanh';
    }
    return '';
  }

  // Kiểm tra giá trị bên trong input giảm giá theo phần trăm
  checkInputDiscount(res: any) {
    if (res > 100 || res < 0) {
      this.notiService.Show('Giảm giá không hợp lệ', 'error');
      this.childDiscount.valueTextBox = '0'
      return;
    }
    if (res > 80) {
      this.notiService.Show('Giảm giá khá lớn', 'warning');
      return;
    }
  }

  // Khôi phục lại thông tin sản phẩm
  restoreProduct(res: any) {
    this.childId.valueTextBox = this.productSelected.IdProduct;
    this.childName.valueTextBox = this.productSelected.Name;
    this.childColor.value = { Color: this.productSelected.Color };
    this.childType.value = { Code: this.productSelected.CodeProductType, Name: this.productSelected.ProductType };
    this.childBrand.value = { Code: this.productSelected.CodeBrand, Name: this.productSelected.BrandName };
    this.childGender.value = { Code: this.productSelected.Gender, Gender: this.checkGender(this.productSelected.Gender) };
    this.childPrice.valueTextBox = this.productSelected.Price.toString();
    this.childStock.valueTextBox = this.productSelected.Stock.toString();
    this.childSold.valueTextBox = this.productSelected.Sold.toString();
    this.childListImage.listImageHandler = this.productSelected.ListOfImage;
    this.childDescription.value = this.productSelected.Description;
    this.childDiscount.valueTextBox = this.productSelected.Discount.toString();
    this.listSizeHandle = this.productSelected.ListOfSize;
    this.getProductSelected();
    this.notiService.Show("Khôi phục thành công", "success");
  }

  // Lấy danh sách hình ảnh sản phẩm
  getListImage(res: any) {
    // console.log(res);
  }

  // Lấy danh sách số lượng sản phẩm dựa trên size của sản phẩm
  updateListSize(list1: DTOSize[], list2: DTOSize[]): DTOSize[] {
    const updatedList = list1.map(item1 => {
      const foundItem = list2.find(item2 => item2.Size === item1.Size);
      if (foundItem) {
        return {
          Code: item1.Code,
          Size: item1.Size,
          Stock: foundItem.Stock,
          Sold: foundItem.Sold
        };
      }
      return item1;
    });
    return updatedList;
  }

  // Hàm chạy sau khi nhập input size bất kỳ và blur ra
  updateStock(res: any, size: DTOSize) {
    size.Stock = parseInt(res);
    this.listSize = this.listSizeHandle;
  }

  // Set khoảng size của sản phẩm
  getRangeSize(res: any, type: string) {
    let totalBefore: number = 0;
    let totalAfter: number = 0;
    let isChange: boolean = false;

    if (parseInt(res) > 48 || parseInt(res) < 35) {
      this.notiService.Show("Khoảng size nằm ngoài khoảng cho phép", "error");
      if (type === 'start') {
        this.childStartSize.valueTextBox = this.startSize.toString();
        this.startSize = this.listSizeHandle[0].Size;
      }
      if (type === 'end') {
        this.childEndSize.valueTextBox = this.endSize.toString();
        this.endSize = this.listSizeHandle[this.listSizeHandle.length - 1].Size;
      }
    }
    else {
      if (type === 'start') {
        if (parseInt(res) !== this.startSize) {
          if (parseInt(res) >= this.endSize && this.endSize !== 0) {
            this.notiService.Show("Nhập khoảng size thất bại", "error");
            this.childStartSize.valueTextBox = this.startSize.toString();
            this.startSize = this.listSizeHandle[0].Size;
          }
          else {
            this.startSize = parseInt(res);
            isChange = true;
          }
        }
      }
      else if (type === 'end') {
        if (parseInt(res) !== this.endSize) {
          if (parseInt(res) <= this.startSize) {
            this.notiService.Show("Nhập khoảng size thất bại", "error");
            this.childEndSize.valueTextBox = this.endSize.toString();
            this.endSize = this.listSizeHandle[this.listSizeHandle.length - 1].Size;
          }
          else {
            this.endSize = parseInt(res);
            isChange = true;
          }
        }
      }
    }

    const listTemp: DTOSize[] = this.listSizeHandle.filter(size => size.Size >= this.startSize && size.Size <= this.endSize);

    this.listSizeHandle.forEach(size => totalBefore += size.Stock);
    listTemp.forEach(size => totalAfter += size.Stock);

    if (totalAfter < totalBefore) {
      this.notiService.Show("Số lượng sản phẩm còn nên không thể xóa Size đó", "error");
      if (type === 'start') {
        this.startSize = this.listSizeHandle[0].Size;
        this.childStartSize.valueTextBox = this.listSizeHandle[0].Size.toString();
      }
      if (type === 'end') {
        this.endSize = this.listSizeHandle[this.listSizeHandle.length - 1].Size;
        this.childEndSize.valueTextBox = this.listSizeHandle[this.listSizeHandle.length - 1].Size.toString();
      }
    }
    else {
      if (isChange) {
        this.listSizeHandle = this.listSize.filter(size => size.Size >= this.startSize && size.Size <= this.endSize);
      }
    }
  }

  // Thêm sản phẩm mới
  addProduct(res: any, type: string) {
    const product: DTOProduct = {
      Code: 0,
      IdProduct: this.childId.valueTextBox,
      Name: this.childName.valueTextBox,
      Price: parseInt(this.childPrice.valueTextBox),
      Description: this.childDescription.value,
      ListOfSize: this.listSizeHandle,
      ListOfImage: this.childListImage.listImageHandler,
      CodeProductType: this.childType.value.Code,
      ProductType: this.childType.value.Name,
      CodeBrand: this.childBrand.value.Code,
      BrandName: this.childBrand.value.Name,
      Color: this.childColor.value.Color,
      Discount: parseInt(this.childDiscount.valueTextBox),
      Stock: 0,
      Sold: 0,
      Gender: this.childGender.value.Code,
      Status: 0,
      ThumbnailImg: ''
    }

    if (!this.checkInputProduct(product)) { return; }

    if (type === 'add') {
      this.checkIdProduct(product.IdProduct).subscribe(isDifferent => {
        if (isDifferent) {
          this.updateProduct(product, { value: 0 }, [], 'Thêm mới');
          this.clearDetailProduct(null);
        }
        else {
          this.notiService.Show("IdProduct đã bị trùng với 1 sản phẩm khác", "error");
        }
      });
    }

    if (type === 'update') {
      this.checkIdProduct(product.IdProduct).subscribe(isDifferent => {
        if (isDifferent) {
          product.Code = this.productSelected.Code;
          this.updateProduct(product, { value: 0 }, this.setPropertiesUpdate(), 'Cập nhật');
          this.getProductSelected();
        }
        else {
          if (product.IdProduct !== this.productSelected.IdProduct) {
            this.notiService.Show("IdProduct đã bị trùng với 1 sản phẩm khác", "error");
          }
          else {
            product.Code = this.productSelected.Code;
            this.updateProduct(product, { value: 0 }, this.setPropertiesUpdate(), 'Cập nhật');
            this.getProductSelected();
          }
        }
      });
    }
  }

  checkIdProduct(id: string): Observable<boolean> {
    return this.productAdminService.getListProduct({})
      .pipe(
        takeUntil(this.destroy),
        map(list => {
          const listProduct = list.ObjectReturn.Data;
          return !listProduct.some((product: DTOProduct) => product.IdProduct === id);
        })
      );
  }

  // Đối với update, set các property để gửi req nếu có thay đổi
  setPropertiesUpdate() {
    let listProps: string[] = [];
    if (this.productSelected.IdProduct !== this.childId.valueTextBox) {
      listProps.push('IdProduct');
    }
    if (this.productSelected.Name !== this.childName.valueTextBox) {
      listProps.push('Name');
    }
    if (this.productSelected.Color !== this.childColor.value.Color) {
      listProps.push('Color');
    }
    if (this.productSelected.ProductType !== this.childType.value.Name) {
      listProps.push('CodeProductType', 'ProductType');
    }
    if (this.productSelected.CodeBrand !== this.childBrand.value.Code) {
      listProps.push('CodeBrand', 'BrandName');
    }
    if (this.productSelected.Gender !== this.childGender.value.Code) {
      listProps.push('Gender');
    }
    if (this.productSelected.Price !== parseInt(this.childPrice.valueTextBox)) {
      listProps.push('Price');
    }
    if (this.productSelected.Description !== this.childDescription.value) {
      listProps.push('Description');
    }
    if (this.productSelected.Discount !== parseInt(this.childDiscount.valueTextBox)) {
      listProps.push('Discount');
    }
    return listProps;
  }

  // Kiểm tra đầu vào sản phẩm có nhập đầy đủ hay không
  checkInputProduct(product: DTOProduct) {
    if (!product.IdProduct) {
      this.notiService.Show("IdProduct chưa được nhập", "error");
      return false;
    }
    if (!product.Name) {
      this.notiService.Show("Vui lòng nhập tên sản phẩm", "error");
      return false;
    }
    if (product.Color === '-- Màu sắc --') {
      this.notiService.Show("Vui lòng chọn màu sắc", "error");
      return false;
    }
    if (product.CodeBrand === -1) {
      this.notiService.Show("Vui lòng chọn thương hiệu", "error");
      return false;
    }
    if (product.CodeProductType === -1) {
      this.notiService.Show("Vui lòng chọn loại sản phẩm", "error");
      return false;
    }
    if (product.Gender === -1) {
      this.notiService.Show("Vui lòng chọn giới tính", "error");
      return false;
    }
    if (product.Price === 0) {
      this.notiService.Show("Vui lòng nhập giá sản phẩm", "error");
      return false;
    }
    if (product.ListOfImage.length === 0) {
      this.notiService.Show("Vui lòng thêm ảnh sản phẩm", "error");
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
