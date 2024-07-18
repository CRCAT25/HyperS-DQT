import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { AuthService } from '../../shared/services/account.service';
import { takeUntil } from 'rxjs/operators';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { CartService } from 'src/app/ecom-pages/shared/service/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showPassword: string = 'password'
  username: string = "";
  password: string = ""
  isLoading: boolean = false

  constructor(private router: Router, private accoutService: AuthService, private notiService: NotiService,private cartService: CartService){}

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)

  handleChangeShowPassword():void{
    if(this.showPassword == 'password'){
      this.showPassword = 'text'
    }else{
      this.showPassword = 'password'
    }
  }

  APILogin(username: string ,password: string):void{
    localStorage.removeItem('breadcrumb');
    localStorage.removeItem('moduleName');
    localStorage.removeItem('routerLink');
    this.isLoading = true
    this.accoutService.login(username, password).pipe(takeUntil(this.destroy)).subscribe(data => {
      console.log(data);
      try{
        if(data.StatusCode == 0 && data.ObjectReturn.ResultLogin.Succeeded == true && data.ErrorString == ""){
          localStorage.setItem('token', data.ObjectReturn.ResultToken.Token)
          localStorage.setItem('codeCustomer', data.ObjectReturn.ResultCus)
          if(data.ObjectReturn.ResultRedirect == "jkwt"){
            this.handleNavigate('/ecom/home')
          }else if(data.ObjectReturn.ResultRedirect == "uije"){
            this.handleNavigate('/admin')
          }
          this.cartService.getCountInCart(data.ObjectReturn.ResultCus)
          this.cartService.emitCartUpdated()
          this.notiService.Show("Login Successfully!", "success")
        }else{
          this.notiService.Show("user or password not correct!", "error")
        }
      }catch{
        this.notiService.Show(data.ErrorString, "error")
      }
      finally{
        this.isLoading = false
      }
    })
  }

  APICheckLogin():void{
    this.accoutService.checkLogin().pipe(takeUntil(this.destroy)).subscribe(data =>{
      
      console.log(data);
    })
  }

  handleNavigate(route: string):void{
    this.router.navigate([route])
  }

  handleBackToHome():void{
    localStorage.removeItem("codeCustomer")
    this.handleNavigate('ecom/home')
  }

  handleLogin(user: string, pass: string){
    this.APILogin(user, pass)
  }
}
