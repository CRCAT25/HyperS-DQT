import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DTOModule, listModule } from 'src/app/admin-pages/shared/dto/DTOModule.dto';
import { LayoutService } from 'src/app/admin-pages/shared/service/layout.service';

@Component({
  selector: 'component-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadCrumb: string = '';
  listItemBreadCrumb: string[] = [];
  listModuleAndSub: DTOModule[] = [];

  constructor(private router: Router, private layoutService: LayoutService) { }

  ngOnInit(): void {
    if (!localStorage.getItem('breadcrumb')) {
      localStorage.setItem('breadcrumb', 'Đơn hàng');
      localStorage.setItem('moduleName', 'Đơn hàng');
      localStorage.setItem('routerLink', '/admin/manage-cart');
      this.layoutService.selectedBreadcrumb$.subscribe(item => {
        this.listItemBreadCrumb = ['Đơn hàng'];
      });
    }
    else {
      this.getListModuleAndSub();
      this.layoutService.selectedBreadcrumb$.subscribe(item => {
        if(item){
          this.listItemBreadCrumb = item.split('/');
        }
      });
      this.router.navigate([localStorage.getItem('routerLink')]);
    }
  }

  // Sự kiện khi chọn vào item bất kỳ
  onClickItemBreadCrumb(moduleName: string) {
    const module = this.listModuleAndSub.find(module => module.ModuleName === moduleName);
    console.log(module);
    // console.log(moduleName);
    // this.listModuleAndSub.forEach(module => {
    //   if(moduleName === module.ModuleName){
    //      this.router.navigate([module.RouteLink]);
    //   }
    // })
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
}
