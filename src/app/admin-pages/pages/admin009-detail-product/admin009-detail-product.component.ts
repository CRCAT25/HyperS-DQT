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
  listSizeHandle: DTOSize[];
  listSizeDefault: DTOSize[] = [
    {
      Code: 0,
      Size: 35,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 1,
      Size: 36,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 2,
      Size: 37,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 3,
      Size: 38,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 4,
      Size: 39,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 5,
      Size: 40,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 6,
      Size: 41,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 7,
      Size: 42,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 8,
      Size: 43,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 9,
      Size: 44,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 10,
      Size: 45,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 11,
      Size: 46,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 12,
      Size: 47,
      Stock: 0,
      Sold: 0
    },
    {
      Code: 13,
      Size: 48,
      Stock: 0,
      Sold: 0
    }
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
    this.productAdminService.getProductById(parseInt(code)).pipe(takeUntil(this.destroy)).subscribe((product: DTOResponse) => {
      this.productSelected = product.ObjectReturn.Data[0];
      this.listSize = this.updateListSize(this.listSizeDefault, this.productSelected.ListOfSize);
      this.listSizeHandle = [...this.listSize];
    });
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
  updateStatusProduct(product: DTOProduct, obj: any) {
    if (obj.value >= 0) {
      product.Status = obj.value;
      const request: DTOUpdateProductRequest = {
        Product: product,
        Properties: ["Status"]
      }
      this.productAdminService.updateProduct(request).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          this.getProductSelected();
          this.notiService.Show("Cập nhật trạng thái thành công", "success");
        }
      }, error => {
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
    this.listSizeHandle = [
      {
        Code: 0,
        Size: 35,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 1,
        Size: 36,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 2,
        Size: 37,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 3,
        Size: 38,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 4,
        Size: 39,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 5,
        Size: 40,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 6,
        Size: 41,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 7,
        Size: 42,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 8,
        Size: 43,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 9,
        Size: 44,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 10,
        Size: 45,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 11,
        Size: 46,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 12,
        Size: 47,
        Stock: 0,
        Sold: 0
      },
      {
        Code: 13,
        Size: 48,
        Stock: 0,
        Sold: 0
      }
    ];
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
    console.log(res);
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

  updateProduct() {

  }

  // Hàm chạy sau khi nhập input size bất kỳ và blur ra
  updateStock(res: any, size: DTOSize) {
    console.log(this.listSizeHandle);
  }

  // Thêm sản phẩm mới
  addProduct(res: any) {
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
      if (!isDifferent) {
        this.notiService.Show("IdProduct đã có", "error");
      }
    });
    if (!product.IdProduct) {
      this.notiService.Show("IdProduct chưa được nhập", "error");
      return;
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
