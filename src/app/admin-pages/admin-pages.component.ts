import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './shared/service/layout.service';
import { listModule } from './shared/dto/DTOModule.dto';
import { DTOStaff } from './shared/dto/DTOStaff.dto';
import { DTOResponse } from '../in-layout/Shared/dto/DTORespone';
import { StaffService } from './shared/service/staff.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-admin-pages',
  templateUrl: './admin-pages.component.html',
  styleUrls: ['./admin-pages.component.scss']
})
export class AdminPagesComponent implements OnInit, OnDestroy {
  // variable Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  // Quyền của tài khoản hiện tại đang đăng nhập
  permission: string;
  // Danh sách các quyền của nhân viên
  listRole: string[];

  constructor(private router: Router, private layoutService: LayoutService, private staffService: StaffService) { }

  ngOnInit(): void {
    this.getCurrentStaff();
    this.getListRole();

    const currentUrl = this.router.url;
    listModule.forEach(module => {
      if (!module.SubModule) {
        if (module.RouteLink === currentUrl) {
          this.layoutService.setSelectedModule(module.BreadCrumb);
        }
      }
      else {
        module.SubModule.forEach(sub => {
          if (sub.RouteLink === currentUrl) {
            this.layoutService.setSelectedModule(module.BreadCrumb);
          }
        })
      }

      // if (!this.isStaff) {
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('routerLink');
      //   localStorage.removeItem('moduleName');
      //   localStorage.removeItem('breadcrumb');
      //   this.router.navigate(['account/login']);
      // }
    })
    // console.log(currentUrl);
  }

  // Lấy quyền của tài khoản hiện tại đang đăng nhập
  getCurrentStaff() {
    this.staffService.getCurrentStaffInfo().pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        const staff: DTOStaff = res.ObjectReturn.Data[0];
        this.permission = staff.Permission;
      }
    })
  }

  // Lấy danh sách các quyền của nhân viên
  getListRole() {
    this.staffService.getListRoleStaff().pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        if(res.ObjectReturn.Data){
          this.listRole = res.ObjectReturn.Data.map((item: {Name: string, NormalizedName: string}) => item.Name);
        }
      }
    })
  }

  // Check xem tài khoản có để thẩm quyền truy cập không
  checkAvailabelAccount(){
    if(this.listRole){
      if(this.listRole.includes(this.permission)){
        return true;
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    // localStorage.removeItem('routerLink');
    // localStorage.removeItem('moduleName');
    // localStorage.removeItem('breadcrumb');
  }
}
