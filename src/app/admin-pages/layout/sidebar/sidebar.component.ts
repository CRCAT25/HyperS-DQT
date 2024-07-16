import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DTOModule, listModule } from '../../shared/dto/DTOModule.dto';
import { Router } from '@angular/router';
import { LayoutService } from '../../shared/service/layout.service';
import { StaffService } from '../../shared/service/staff.service';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  expandDrawer = true;
  listItemsDrawer: DTOModule[] = listModule;
  listModuleAndSub: DTOModule[] = [];
  currentStaff: DTOStaff;

  constructor(private router: Router, private layoutService: LayoutService, private staffService: StaffService) { }

  ngOnInit(): void {
    const breadcrumbLS: string = localStorage.getItem('breadcrumb');
    if(!breadcrumbLS) return;
    const listBreadCrumbSplit: string[] = breadcrumbLS.split('/')
    const accountModule = listModule.find(item => item.ModuleName === 'Quản lý tài khoản');
    const productModule = listModule.find(item => item.ModuleName === 'Quản lý sản phẩm');


    const cartModule = listModule.find(item => item.ModuleName === 'Đơn hàng');
    if (!!!localStorage.getItem('moduleName')) {
      this.onSelectItemDrawer(cartModule);
      localStorage.setItem('breadcrumb', 'Đơn hàng');
    }
    this.getListModuleAndSub();
    this.listModuleAndSub.forEach(module => {
      module.IsSelected = false;
      if (module.ModuleName === localStorage.getItem('moduleName')) {
        module.IsSelected = true;
      }
    })

    // Ngoại lệ đối với Quản lý tài khoản
    if (listBreadCrumbSplit[0] === 'Quản lý tài khoản') {
      accountModule.IsExpanded = true;
      accountModule.IsSelected = true;
      const childAccountModule: DTOModule = accountModule.SubModule.find(item => item.ModuleName === listBreadCrumbSplit[1]);
      childAccountModule.IsSelected = true;
    }

    // Ngoại lệ đối với Quản lý sản phẩm
    if (listBreadCrumbSplit[0] === 'Quản lý sản phẩm') {
      productModule.IsExpanded = true;
      productModule.IsSelected = true;
      const childProductModule: DTOModule = productModule.SubModule.find(item => item.ModuleName === listBreadCrumbSplit[1]);
      if(childProductModule) childProductModule.IsSelected = true;
    }

    this.getCurrentStaff();
  }


  // Lấy danh sách các module và submodule
  getListModuleAndSub() {
    listModule.forEach(module => {
      this.listModuleAndSub.push(module);
      if (module.SubModule) {
        module.SubModule.forEach(sub => {
          this.listModuleAndSub.push(sub);
        })
      }
    })
  }

  // Sự kiện khi chọn vào item drawer
  onSelectItemDrawer(item: DTOModule): void {
    // Ngoại lệ đối với Quản lý tài khoản và quản lý sản phẩm. Dùng để đóng expand khi chọn các item khác trừ những item nào có subModule
    if (item.ModuleName !== 'Quản lý tài khoản' && item.ModuleName !== 'Quản lý sản phẩm') {
      const accountModule = listModule.find(item => item.ModuleName === 'Quản lý tài khoản');
      accountModule.IsExpanded = false;
      accountModule.IsSelected = false;
      accountModule.SubModule.forEach(sub => sub.IsSelected = false);

      const productModule = listModule.find(item => item.ModuleName === 'Quản lý sản phẩm');
      productModule.IsExpanded = false;
      productModule.IsSelected = false;
      productModule.SubModule.forEach(sub => sub.IsSelected = false);
    }


    if (item.SubModule) {
      item.IsExpanded = !item.IsExpanded;
    }
    else {
      this.clearSelectedModule();
      item.IsSelected = true;
      this.router.navigate([item.RouteLink]);
      this.layoutService.setSelectedModule(item.ModuleName);
      this.layoutService.setSelectedBreadCrumb(item.BreadCrumb);
      localStorage.setItem('routerLink', item.RouteLink);
      localStorage.setItem('breadcrumb', item.BreadCrumb);
      localStorage.setItem('moduleName', item.ModuleName);
    }
  }

  // Sự kiện khi chọn vào submodule
  onSelectSubModule(sub: DTOModule, item: DTOModule): void {
    this.clearSelectedModule();
    item.IsSelected = true;
    sub.IsSelected = true;
    this.layoutService.setSelectedModule(sub.ModuleName);
    this.layoutService.setSelectedBreadCrumb(sub.BreadCrumb);
    this.router.navigate([sub.RouteLink]);
    localStorage.setItem('routerLink', sub.RouteLink);
    localStorage.setItem('breadcrumb', sub.BreadCrumb);
    localStorage.setItem('moduleName', sub.ModuleName);
  }

  // Dùng để xóa IsSelected của từng module
  clearSelectedModule() {
    listModule.forEach(module => {
      module.IsSelected = false;
      if (module.SubModule) {
        module.SubModule.forEach(sub => {
          sub.IsSelected = false;
        })
      }
    })
  }

  // Lấy danh sách các module con
  getSubModule(moduleName: string): DTOModule[] | undefined {
    // Tìm module có ModuleName khớp
    const module = listModule.find(mod => mod.ModuleName === moduleName);
    // Kiểm tra nếu module tồn tại và có SubModule
    if (module && module.SubModule) {
      return module.SubModule;
    }
    // Trả về undefined nếu không tìm thấy module hoặc không có subModule
    return [];
  }

  // Lấy thông tin của staff hiện tại đang đăng nhập
  getCurrentStaff() {
    this.staffService.getCurrentStaffInfo().subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        this.currentStaff = res.ObjectReturn.Data[0];
      }
    })
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['account/login']);
  }
}
