import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { StaffService } from '../../shared/service/staff.service';
import { takeUntil } from 'rxjs/operators';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';
import { State } from '@progress/kendo-data-query';
import { DTOBrand } from 'src/app/ecom-pages/shared/dto/DTOBrand';
import { GridDataResult, SelectionEvent } from '@progress/kendo-angular-grid';
import { ProductAdminService } from '../../shared/service/productAdmin.service';
import { TextInputComponent } from 'src/app/shared/component/text-input/text-input.component';
import { ImportImageComponent } from '../../shared/component/import-image/import-image.component';

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


  // Danh sách số trang có thể đổi
  listPageSize: number[] = [10, 20, 30];


  // ViewChild
  @ViewChild('idBrand') childIdBrand!: TextInputComponent;
  @ViewChild('nameBrand') childNameBrand!: TextInputComponent;
  @ViewChild('imgBrand') childImgBrand!: ImportImageComponent;


  constructor(
    private staffService: StaffService,
    private notiService: NotiService,
    private productAdminService: ProductAdminService
  ) { }


  ngOnInit(): void {
    this.getPermission();
    this.getListBrand();
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

  // Lấy danh sách các thương hiệu
  getListBrand() {
    this.isBrandLoading = true;
    this.productAdminService.getListBrand().pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        this.listBrand = { data: res.ObjectReturn.Data, total: res.ObjectReturn.Total };
        this.isBrandLoading = false;
      }
    })
  }

  // Sự kiện khi chọn vào hàng bất kỳ của grid thương hiệu
  onSelectionBrandChange(e: SelectionEvent): void {
    this.selectedBrand = [];
    this.selectedBrand.push(e.selectedRows[0]?.dataItem.Code)

    this.bindingToFormBrand();
  }

  // Binding thông tin thương hiệu được chọn lên form
  bindingToFormBrand() {

  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.content-form') && !(event.target as HTMLElement).closest('.group-button')) {
      this.selectedBrand = [];
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
