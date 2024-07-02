import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductAdminService } from '../../shared/service/productAdmin.service';
import { DTOProduct } from 'src/app/ecom-pages/shared/dto/DTOProduct';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOUpdateProductRequest } from 'src/app/shared/dto/DTOUpdateProductRequest.dto';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { DTOColor, listColor } from '../../shared/dto/DTOColor.dto.';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DTOProductType } from 'src/app/ecom-pages/shared/dto/DTOProductType';
import { DTOBrand } from 'src/app/ecom-pages/shared/dto/DTOBrand';
import { TextInputComponent } from 'src/app/shared/component/text-input/text-input.component';
import { TextDropdownComponent } from 'src/app/shared/component/text-dropdown/text-dropdown.component';
import { RouterTestingHarness } from '@angular/router/testing';
import { ImportMultiImageComponent } from '../../shared/component/import-multi-image/import-multi-image.component';
import { TextAreaComponent } from 'src/app/shared/component/text-area/text-area.component';
import { DTOSize, listSize } from 'src/app/ecom-pages/shared/dto/DTOSize';

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
  @ViewChild('color') childColor!: TextDropdownComponent;
  @ViewChild('type') childType!: TextDropdownComponent;
  @ViewChild('brand') childBrand!: TextDropdownComponent;
  @ViewChild('gender') childGender!: TextDropdownComponent;
  @ViewChild('price') childPrice!: TextInputComponent;
  @ViewChild('sold') childSold!: TextInputComponent;
  @ViewChild('stock') childStock!: TextInputComponent;
  @ViewChild('listimage') childListImage!: ImportMultiImageComponent;
  @ViewChild('desciption') childDescription!: TextAreaComponent;

  constructor(private productAdminService: ProductAdminService, private notiService: NotiService) { }

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
      this.childGender.resetValue();
      this.childColor.resetValue();
      this.childType.resetValue();
      this.childBrand.resetValue();
    }
    else {
      this.productAdminService.getProductById(parseInt(code)).pipe(takeUntil(this.destroy)).subscribe((product: DTOResponse) => {
        this.productSelected = product.ObjectReturn.Data[0];
        this.listSize = this.updateListSize(this.listSizeDefault, this.productSelected.ListOfSize);
        this.listSizeHandle = [...this.listSize];
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

  // Cật nhật trạng thái sản phẩm
  updateProduct(product: DTOProduct, obj: any, properties: string[], action: string) {
    if (obj.value >= 0) {
      product.Status = obj.value;
      const request: DTOUpdateProductRequest = {
        Product: product,
        Properties: properties
      }
      console.log(request);
      this.productAdminService.updateProduct(request).subscribe((res: DTOResponse) => {
        this.notiService.Show(action + " thành công", "success");
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
    // reset mô tả
    this.childDescription.resetValue();
    // reset hình ảnh
    this.childListImage.clearListImage();
    // reset danh sách size
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

  // Khôi phục lại thông tin sản phẩm
  restoreProduct(res: any) {
    this.childId.valueTextBox = this.productSelected.IdProduct;
    this.childName.valueTextBox = this.productSelected.Name;
    this.childColor.value = { Color: this.productSelected.Color };
    this.childType.value = { Code: this.productSelected.CodeProductType, Name: this.productSelected.ProductType };
    this.childBrand.value = { Code: this.productSelected.CodeBrand, Name: this.productSelected.BrandName };
    this.childGender.value = { Code: this.productSelected.Gender, Gender: this.checkGender(this.productSelected.Gender) };
    this.childPrice.valueTextBox = (this.productSelected.Price).toString();
    this.childStock.valueTextBox = (this.productSelected.Stock).toString();
    this.childSold.valueTextBox = (this.productSelected.Sold).toString();
    this.childListImage.listImageHandler = this.productSelected.ListOfImage;
    this.childDescription.value = this.productSelected.Description;
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
      Stock: 0,
      Sold: 0,
      Gender: this.childGender.value.Code,
      Status: 0,
      ThumbnailImg: ''
    }
    this.checkIdProduct(this.productSelected.Code, isDifferent => {
      if (!isDifferent && type === 'add') {
        this.notiService.Show("IdProduct đã có", "error");
        return;
      }
      if (type === 'update') {
        if (!isDifferent && this.childId.valueTextBox !== this.productSelected.IdProduct) {
          this.notiService.Show("IdProduct đã có", "error");
          return;
        }
      }
    });
    if (!product.IdProduct) {
      this.notiService.Show("IdProduct chưa được nhập", "error");
      return;
    }
    if (!product.Name) {
      this.notiService.Show("Vui lòng nhập tên sản phẩm", "error");
      return;
    }
    if (product.Color === '-- Màu sắc --') {
      this.notiService.Show("Vui lòng chọn màu sắc", "error");
      return;
    }
    if (product.CodeBrand === -1) {
      this.notiService.Show("Vui lòng chọn thương hiệu", "error");
      return;
    }
    if (product.CodeProductType === -1) {
      this.notiService.Show("Vui lòng chọn loại sản phẩm", "error");
      return;
    }
    if (product.Gender === -1) {
      this.notiService.Show("Vui lòng chọn giới tính", "error");
      return;
    }
    if (product.Price === 0) {
      this.notiService.Show("Vui lòng nhập giá sản phẩm", "error");
      return;
    }
    if (product.ListOfImage.length === 0) {
      this.notiService.Show("Vui lòng thêm ảnh sản phẩm", "error");
      return;
    }
    if (type === 'add') {
      this.updateProduct(product, { value: 0 }, [], 'Thêm mới');
      this.clearDetailProduct(null);
    }
    if (type === 'update') {
      product.Code = this.productSelected.Code;
      this.updateProduct(product, { value: 0 }, this.listPropertiesUpdate, 'Cập nhật');
    }
  }

  // Kiểm tra idproduct có trùng hay không
  checkIdProduct(code: number, callback: (isDifferent: boolean) => void) {
    this.productAdminService.getProductById(code).pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      const product: DTOProduct = res.ObjectReturn.Data[0];
      if (product) {
        callback(product.IdProduct !== this.childId.valueTextBox);
      } else {
        callback(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
