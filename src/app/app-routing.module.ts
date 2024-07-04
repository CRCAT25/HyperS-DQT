import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'ecom', pathMatch: 'full' },
  { path: 'ecom', loadChildren: () => import('./ecom-pages/ecom-routing.module').then(m => m.EcomRoutingModule) },
  { path: 'admin', loadChildren: () => import('./admin-pages/admin-routing.module').then(m => m.AdminRoutingModule)},
  { path: 'account', loadChildren: () => import('./account-pages/account-routing.module').then(m => m.AccountRoutingModule)},
  
  // Catch-all route
  { path: '**', redirectTo: 'ecom' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
