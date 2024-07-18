import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { StaffService } from '../../shared/service/staff.service';
import { takeUntil } from 'rxjs/operators';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';
import { GridDataResult, SelectionEvent } from '@progress/kendo-angular-grid';
import { TextInputComponent } from 'src/app/shared/component/text-input/text-input.component';
import { ImportImageComponent } from '../../shared/component/import-image/import-image.component';
import { BrandAdminService } from '../../shared/service/brandAdmin.service';
import { DTOBrand } from 'src/app/ecom-pages/shared/dto/DTOBrand';
import { isEmpty } from 'src/app/shared/utils/utils';
import { DTOUpdateBrandRequest } from '../../shared/dto/DTOUpdateBrandRequest.dto';
import { ProductTypeAdminService } from '../../shared/service/productTypeAdmin.service';
import { DTOProductType } from 'src/app/ecom-pages/shared/dto/DTOProductType';
import { DTOUpdateProductType } from '../../shared/dto/DTOUpdateProductType.dto';

@Component({
  selector: 'app-admin009-manage-category-product',
  templateUrl: './admin009-manage-category-product.component.html',
  styleUrls: ['./admin009-manage-category-product.component.scss']
})
export class Admin009ManageCategoryProductComponent implements OnInit, OnDestroy {
  // variable Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);


  // Số item trong 1 trang
  pageSize: number = 15;
  // Role của tài khoản đang được đăng nhập
  permission: string;
  // GridData danh sách các thương hiệu
  listBrand: GridDataResult;
  // GridData danh sách các loại sản phẩm
  listType: GridDataResult;
  // Loading của thương hiệu
  isBrandLoading: boolean;
  // Loading của loại sản phẩm
  isTypeLoading: boolean;
  // Hình ảnh default
  imgDefault: string = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';
  // Code của thương hiệu được chọn
  selectedBrand: number[] = [];
  // Code của type được chọn
  selectedType: number[] = [];


  // Danh sách số trang có thể đổi
  listPageSize: number[] = [10, 20, 30];
  listPermissionAvaiable: string[] = ['Admin', 'ProductManager'];


  // ViewChild
  @ViewChild('idBrand') childIdBrand!: TextInputComponent;
  @ViewChild('nameBrand') childNameBrand!: TextInputComponent;
  @ViewChild('imgBrand') childImgBrand!: ImportImageComponent;
  @ViewChild('idProductType') childIdProductType!: TextInputComponent;
  @ViewChild('nameProductType') childNameProductType!: TextInputComponent;


  constructor(
    private staffService: StaffService,
    private notiService: NotiService,
    private brandAdminService: BrandAdminService,
    private productTypeService: ProductTypeAdminService
  ) { }


  ngOnInit(): void {
    this.getPermission();
    this.getListBrand();
    this.getListProductType();
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

  // Lấy danh sách các thương hiệu
  getListBrand() {
    this.isBrandLoading = true;
    this.brandAdminService.getListBrand().pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        this.listBrand = { data: res.ObjectReturn.Data, total: res.ObjectReturn.Total };
        this.isBrandLoading = false;
      }
    })
  }

  // Lấy danh sách các loại sản phẩm
  getListProductType() {
    this.isTypeLoading = true;
    this.productTypeService.getListProductType().pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        this.listType = { data: res.ObjectReturn.Data, total: res.ObjectReturn.Total };
        this.isTypeLoading = false;
      }
    })
  }

  // Sự kiện khi chọn vào hàng bất kỳ của grid thương hiệu
  onSelectionBrandChange(e: SelectionEvent): void {
    this.selectedBrand = [];
    this.selectedBrand.push(e.selectedRows[0]?.dataItem.Code)

    this.bindingToFormBrand();
  }

  // Sự kiện khi chọn vào hàng bất kỳ của grid loại sản phẩm
  onSelectionTypeChange(e: SelectionEvent): void {
    this.selectedType = [];
    this.selectedType.push(e.selectedRows[0]?.dataItem.Code)

    this.bindingToFormType();
  }

  // Binding thông tin thương hiệu được chọn lên form
  bindingToFormBrand() {
    if (this.selectedBrand.length > 0) {
      const listBr: DTOBrand[] = this.listBrand.data;
      const brandSelected: DTOBrand = listBr.find(brand => brand.Code === this.selectedBrand[0]);

      // Binding
      this.childIdBrand.valueTextBox = brandSelected.IdBrand;
      this.childNameBrand.valueTextBox = brandSelected.Name;
      if (brandSelected.ImageUrl === '' || brandSelected.ImageUrl === this.imgDefault) {
        this.childImgBrand.setImgURL(this.imgDefault);
      }
      else {
        this.childImgBrand.setImgURL(brandSelected.ImageUrl);
      }
    }
  }

  // Binding thông tin loại sản phẩm được chọn lên form
  bindingToFormType() {
    if (this.selectedType.length > 0) {
      const listType: DTOProductType[] = this.listType.data;
      const typeSelected: DTOProductType = listType.find(type => type.Code === this.selectedType[0]);

      // Binding
      this.childIdProductType.valueTextBox = typeSelected.IdProductType;
      this.childNameProductType.valueTextBox = typeSelected.Name;
    }
  }

  // Reset thông tin trong form thương hiệu và loại sản phẩm
  resetForm() {
    this.childIdBrand.resetValue();
    this.childNameBrand.resetValue();
    this.childImgBrand.setImgURL(this.imgDefault);
    this.childIdProductType.resetValue();
    this.childNameProductType.resetValue();
  }

  // Kiếm tra các input của form brand có hợp lệ hay không
  checkValidFormBrand() {
    if (isEmpty(this.childIdBrand.valueTextBox)) {
      this.notiService.Show('Vui lòng nhập mã thương hiệu', 'error');
      return false;
    }
    if (isEmpty(this.childNameBrand.valueTextBox)) {
      this.notiService.Show('Vui lòng nhập tên thương hiệu', 'error');
      return false;
    }
    if (this.childImgBrand.imageHandle.ImgUrl === '' || this.childImgBrand.imageHandle.ImgUrl === this.imgDefault) {
      this.notiService.Show('Vui lòng chọn ảnh cho thương hiệu', 'error');
      return false;
    }
    return true;
  }

  // Kiếm tra các input của form loại sản phẩm có hợp lệ hay không
  checkValidFormProductType() {
    if (isEmpty(this.childIdProductType.valueTextBox)) {
      this.notiService.Show('Vui lòng nhập mã loại sản phẩm', 'error');
      return false;
    }
    if (isEmpty(this.childNameProductType.valueTextBox)) {
      this.notiService.Show('Vui lòng nhập tên loại sản phẩm', 'error');
      return false;
    }
    return true;
  }

  // Quản lý brand: thêm mới hoặc cập nhật
  manageBrand(action: 'add' | 'update') {
    if (!this.checkValidFormBrand()) {
      return;
    }

    const listIdBrand: string[] = this.listBrand.data.map(item => item.IdBrand);
    const brandExists = listIdBrand.includes(this.childIdBrand.valueTextBox);

    if (action === 'add' && brandExists) {
      this.notiService.Show('Tên thương hiệu đã bị trùng', 'error');
      return;
    }

    if (action === 'update' && !brandExists) {
      this.notiService.Show('Thương hiệu không tồn tại', 'error');
      return;
    }

    const brand: { Code: number, IdBrand: string, BrandName: string, ImageUrl: string } = {
      Code: action === 'add' ? 0 : this.selectedBrand[0],
      IdBrand: this.childIdBrand.valueTextBox,
      BrandName: this.childNameBrand.valueTextBox,
      ImageUrl: this.childImgBrand.imageHandle.ImgUrl
    }

    const req: DTOUpdateBrandRequest = {
      Brand: brand,
      Properties: ['IdBrand', 'BrandName', 'ImageUrl'] // Lỗi DTO backend nên sửa Name thành BrandName. Chú ý
    }

    this.brandAdminService.updateBrand(req).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        this.notiService.Show(action === 'add' ? 'Thêm mới thương hiệu thành công' : 'Cập nhật thương hiệu thành công', 'success');
        this.getListBrand();
        this.resetForm();
      }
    }, error => {
      this.notiService.Show((action === 'add' ? 'Thêm mới' : 'Cập nhật') + ' đã xảy ra lỗi: ' + error, 'error');
    });
  }

  // Quản lý loại sản phẩm: thêm mới hoặc cập nhật
  manageProductType(action: 'add' | 'update') {
    if (!this.checkValidFormProductType()) {
      return;
    }

    const listIdTypeProduct: string[] = this.listType.data.map(item => item.IdProductType);
    const productTypeExists = listIdTypeProduct.includes(this.childIdBrand.valueTextBox);

    if (action === 'add' && productTypeExists) {
      this.notiService.Show('Tên loại sản phẩm đã bị trùng', 'error');
      return;
    }

    if (action === 'update' && !productTypeExists) {
      this.notiService.Show('Loại sản phẩm không tồn tại', 'error');
      return;
    }

    const productType: DTOProductType = {
      Code: action === 'add' ? 0 : this.selectedType[0],
      IdProductType: this.childIdProductType.valueTextBox,
      Name: this.childNameProductType.valueTextBox
    }

    const req: DTOUpdateProductType = {
      ProductType: productType,
      Properties: ['IdProductType', 'Name']
    }

    this.productTypeService.updateProductType(req).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        this.notiService.Show(action === 'add' ? 'Thêm mới loại sản phẩm thành công' : 'Cập nhật loại sản phẩm thành công', 'success');
        this.getListProductType();
        this.resetForm();
      }
    }, error => {
      this.notiService.Show((action === 'add' ? 'Thêm mới' : 'Cập nhật') + ' đã xảy ra lỗi: ' + error, 'error');
    });
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.content-form')
      && !(event.target as HTMLElement).closest('.group-button')
      && !(event.target as HTMLElement).closest('tr')) {
      this.selectedBrand = [];
      this.selectedType = [];
      this.resetForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
