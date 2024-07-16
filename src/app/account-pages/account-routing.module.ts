import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPagesComponent } from './account-pages.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: AccountPagesComponent,
    children: [
      { path: 'login', component: LoginComponent},
      { path: 'signup', component: SignupComponent},
      { path: 'forgot', component: ForgotPasswordComponent},
      {path: '', redirectTo:'login', pathMatch:'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
