import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DTOModule, listModule } from '../../shared/dto/DTOModule.dto';
import { Router } from '@angular/router';
import { LayoutService } from '../../shared/service/layout.service';

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

  constructor(private router: Router, private layoutService: LayoutService) { }

  ngOnInit(): void {
    const breadcrumbLS: string = localStorage.getItem('breadcrumb');
    const listBreadCrumbSplit: string[] = breadcrumbLS.split('/')
    const accountModule = listModule.find(item => item.ModuleName === 'Quản lý tài khoản');


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
    if(listBreadCrumbSplit[0] === 'Quản lý tài khoản'){
      accountModule.IsExpanded = true;
      accountModule.IsSelected = true;
      const childAccountModule: DTOModule = accountModule.SubModule.find(item => item.ModuleName === listBreadCrumbSplit[1]);
      childAccountModule.IsSelected = true;
    }
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
    // Ngoại lệ đối với Quản lý tài khoản
    if(item.ModuleName !== 'Quản lý tài khoản'){
      const accountModule = listModule.find(item => item.ModuleName === 'Quản lý tài khoản');
      accountModule.IsExpanded = false;
      accountModule.IsSelected = false;
      accountModule.SubModule.forEach(sub => sub.IsSelected = false);
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
}
