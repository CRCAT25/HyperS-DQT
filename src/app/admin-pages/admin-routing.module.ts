import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPagesComponent } from './admin-pages.component';
import { Admin001InformationCustomerComponent } from './pages/admin001-information-customer/admin001-information-customer.component';
import { Admin001InformationStaffComponent } from './pages/admin001-information-staff/admin001-information-staff.component';
import { Admin002ManageModuleComponent } from './pages/admin002-manage-module/admin002-manage-module.component';
import { Admin003DashboardComponent } from './pages/admin003-dashboard/admin003-dashboard.component';
import { Admin004ManageCouponComponent } from './pages/admin004-manage-coupon/admin004-manage-coupon.component';
import { Admin005ManageBannerComponent } from './pages/admin005-manage-banner/admin005-manage-banner.component';
import { Admin006ManageCartComponent } from './pages/admin006-manage-cart/admin006-manage-cart.component';
import { Admin007ManageScheduleComponent } from './pages/admin007-manage-schedule/admin007-manage-schedule.component';
import { Admin008CalculateSalaryComponent } from './pages/admin008-calculate-salary/admin008-calculate-salary.component';
import { Admin009ManageProductComponent } from './pages/admin009-manage-product/admin009-manage-product.component';
import { Admin009DetailProductComponent } from './pages/admin009-detail-product/admin009-detail-product.component';
import { Admin009ManageCategoryProductComponent } from './pages/admin009-manage-category-product/admin009-manage-category-product.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPagesComponent,
    children: [
      { path: 'manage-user', component: Admin001InformationCustomerComponent },
      { path: 'manage-staff', component: Admin001InformationStaffComponent },
      { path: 'manage-module', component: Admin002ManageModuleComponent },
      { path: 'manage-dashboard', component: Admin003DashboardComponent },
      { path: 'manage-coupon', component: Admin004ManageCouponComponent },
      { path: 'manage-banner', component: Admin005ManageBannerComponent },
      { path: 'manage-cart', component: Admin006ManageCartComponent },
      { path: 'manage-schedule', component: Admin007ManageScheduleComponent },
      { path: 'calculate-salary', component: Admin008CalculateSalaryComponent },
      { path: 'manage-product', component: Admin009ManageProductComponent },
      { path: 'detail-product', component: Admin009DetailProductComponent },
      { path: 'manage-category', component: Admin009ManageCategoryProductComponent },
      { path: '', redirectTo: 'manage-cart', pathMatch: 'full' }
      // Add a redirect here if needed, or adjust the main redirect
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
