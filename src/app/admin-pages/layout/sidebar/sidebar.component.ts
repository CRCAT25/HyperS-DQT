import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DTOModule, listModule } from '../../shared/dto/DTOModule.dto';
import { Router } from '@angular/router';
import { LayoutService } from '../../shared/service/layout.service';
import { StaffService } from '../../shared/service/staff.service';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';

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
  listOriginModule: DTOModule[] = [
    {
      RouteLink: '/admin',
      ModuleName: 'Quản lý tài khoản',
      ClassIconFontAwesome: 'fa-user',
      SubModule: [
        {
          RouteLink: '/admin/manage-user',
          ModuleName: 'Thông tin khách hàng',
          IsChild: true,
          IsSelected: false,
          ParentModule: 'Quản lý tài khoản',
          IsExpanded: false,
          BreadCrumb: 'Quản lý tài khoản/Thông tin khách hàng'
        },
        {
          RouteLink: '/admin/manage-staff',
          ModuleName: 'Thông tin nhân viên',
          IsChild: true,
          IsSelected: false,
          ParentModule: 'Quản lý tài khoản',
          IsExpanded: false,
          BreadCrumb: 'Quản lý tài khoản/Thông tin nhân viên'
        }
      ],
      IsChild: false,
      IsSelected: false,
      IsExpanded: false
    },
    {
      RouteLink: '/admin',
      ModuleName: 'Quản lý sản phẩm',
      ClassIconFontAwesome: 'fa-store',
      SubModule: [
        {
          RouteLink: '/admin/manage-product',
          ModuleName: 'Danh sách sản phẩm',
          IsChild: true,
          IsSelected: false,
          ParentModule: 'Quản lý sản phẩm',
          IsExpanded: false,
          BreadCrumb: 'Quản lý sản phẩm/Danh sách sản phẩm'
        },
        {
          RouteLink: '/admin/manage-category',
          ModuleName: 'Thương hiệu và phân loại',
          IsChild: true,
          IsSelected: false,
          ParentModule: 'Quản lý sản phẩm',
          IsExpanded: false,
          BreadCrumb: 'Quản lý sản phẩm/Thương hiệu và phân loại'
        }
      ],
      IsChild: false,
      IsSelected: false,
      IsExpanded: false,
      BreadCrumb: 'Quản lý sản phẩm'
    },
    {
      RouteLink: '/admin/manage-dashboard',
      ModuleName: 'Dashboard',
      ClassIconFontAwesome: 'fa-chart-column',
      IsChild: false,
      IsSelected: false,
      IsExpanded: false,
      BreadCrumb: 'Dashboard'
    },
    {
      RouteLink: '/admin/manage-coupon',
      ModuleName: 'Quản lý khuyến mãi',
      ClassIconFontAwesome: 'fa-gift',
      IsChild: false,
      IsSelected: false,
      IsExpanded: false,
      BreadCrumb: 'Quản lý khuyến mãi'
    },
    {
      RouteLink: '/admin/manage-banner',
      ModuleName: 'Quản lý banner',
      ClassIconFontAwesome: 'fa-pager',
      IsChild: false,
      IsSelected: false,
      IsExpanded: false,
      BreadCrumb: 'Quản lý banner'
    },
    {
      RouteLink: '/admin/manage-cart',
      ModuleName: 'Đơn hàng',
      ClassIconFontAwesome: 'fa-cart-shopping',
      IsChild: false,
      IsSelected: true,
      IsExpanded: false,
      BreadCrumb: 'Đơn hàng'
    }
  ]


  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private staffService: StaffService,
    private notiService: NotiService
  ) { }

  ngOnInit(): void {
    this.getCurrentStaff();

    const breadcrumbLS: string = localStorage.getItem('breadcrumb');
    if (!breadcrumbLS) return;
    const listBreadCrumbSplit: string[] = breadcrumbLS.split('/')
    const accountModule = this.listOriginModule.find(item => item.ModuleName === 'Quản lý tài khoản');
    const productModule = this.listOriginModule.find(item => item.ModuleName === 'Quản lý sản phẩm');

    const cartModule = this.listOriginModule.find(item => item.ModuleName === 'Đơn hàng');
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
      if (childProductModule) childProductModule.IsSelected = true;
    }
  }

  // 
  checkPermissionModule(module: string) {
    const permission = this.currentStaff.Permission;
    if (module === 'Quản lý tài khoản') {
      return true;
    }
    if (module === 'Quản lý sản phẩm') {
      return true;
    }
    if (module === 'Thông tin khách hàng') {
      if (permission === 'Admin') {
        return true;
      }
    }
    if (module === 'Thông tin nhân viên') {
      if (permission === 'Admin') {
        return true;
      }
    }
    if (module === 'Danh sách sản phẩm') {
      if (permission === 'Admin' || permission === 'ProductManager' || permission === 'BillManager') {
        return true;
      }
    }
    if (module === 'Thương hiệu và phân loại') {
      if (permission === 'Admin' || permission === 'ProductManager') {
        return true;
      }
    }
    if (module === 'Dashboard') {
      if (permission === 'Admin') {
        return true;
      }
    }
    if (module === 'Quản lý khuyến mãi') {
      if (permission === 'Admin' || permission === 'EventManager') {
        return true;
      }
    }
    if (module === 'Quản lý banner') {
      if (permission === 'Admin' || permission === 'EventManager') {
        return true;
      }
    }
    if (module === 'Đơn hàng') {
      if (permission === 'Admin' || permission === 'BillManager') {
        return true;
      }
    }
    return false;
  }

  // Lấy danh sách các module và submodule
  getListModuleAndSub() {
    this.listOriginModule.forEach(module => {
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
    if (!this.checkPermissionModule(item.ModuleName) && !item.IsChild) {
      this.notiService.Show('Bạn không có đủ thẩm quyền', 'warning');
      return;
    }

    // Ngoại lệ đối với Quản lý tài khoản và quản lý sản phẩm. Dùng để đóng expand khi chọn các item khác trừ những item nào có subModule
    if (item.ModuleName !== 'Quản lý tài khoản' && item.ModuleName !== 'Quản lý sản phẩm') {
      const accountModule = this.listOriginModule.find(item => item.ModuleName === 'Quản lý tài khoản');
      accountModule.IsExpanded = false;
      accountModule.IsSelected = false;
      accountModule.SubModule.forEach(sub => sub.IsSelected = false);

      const productModule = this.listOriginModule.find(item => item.ModuleName === 'Quản lý sản phẩm');
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
    if (!this.checkPermissionModule(sub.ModuleName)) {
      this.notiService.Show('Bạn không có đủ thẩm quyền', 'warning');
      return;
    }

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
    this.listOriginModule.forEach(module => {
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
    const module = this.listOriginModule.find(mod => mod.ModuleName === moduleName);
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

  // Đổi tên thành tên tiếng việt dựa trên role
  showNameVNByRole(role: string) {
    if (role === 'Admin') return 'Quản lý';
    if (role === 'BillManager') return 'Kiểm duyệt đơn hàng';
    if (role === 'ProductManager') return 'Kiểm duyệt sản phẩm';
    if (role === 'EventManager') return 'Kiểm duyệt sự kiện';
    return 'Nhân viên'
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['account/login']);
  }
}
