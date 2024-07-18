import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/ecom-pages/shared/service/cart.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { AuthService } from '../../shared/services/account.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { DTOChangePassword } from '../../shared/dto/DTOChangePassword';
import { Location } from '@angular/common';
import { DTOError } from '../../shared/dto/DTOError';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  isLoading: boolean = false
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)
  username: string = ""
  password: string = ""
  repeatPassword: string = ""
  token: string = ""
  type: number = 0

  changePassword: DTOChangePassword = {
    Email : this.username,
    OldPassword: null,
    NewPassword: "",
    Token: this.token
  }

  

  showPassword: string = 'password'
  showRePassword: string = "password"

  constructor(
    private router: Router, 
    private accoutService: AuthService, 
    private notiService: NotiService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private location : Location
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      this.token = params['token']
    });

    if(this.token && this.username){
      this.changePassword.Token = this.token
      this.changePassword.Email = this.username
      this.type = 2
    }
  }


  APIForget(username: string):void{
    this.isLoading = true
    this.accoutService.forgotPassword(username).pipe(takeUntil(this.destroy)).subscribe(data => {
      console.log(data);
      if(data.ErrorString != ""){
        this.notiService.Show(data.ErrorString, 'error')
      }else{
        console.log(data.ObjectReturn.Path);
        this.type = 1
      }
      this,this.isLoading = false
    })
  }

  APIChangePassword(info:DTOChangePassword):void{

    this.isLoading = true
    this.accoutService.changePassword(info).pipe(takeUntil(this.destroy)).subscribe(data => {
      if(data.ErrorString != ""){
        this.notiService.Show(data.ErrorString, 'error')
      }else if(data.ObjectReturn.Errors.length != 0){
        let listErrors: DTOError[] = data.ObjectReturn.Errors
        listErrors.forEach(element => {
          this.notiService.Show(element.Description, 'error')
        });
      }else{
        this.notiService.Show("Change password succeeded!", 'success')
        this.handleNavigate('account/login')
      }
      this,this.isLoading = false
    })
  }

  handleChangeShowPassword():void{
    if(this.showPassword == 'password'){
      this.showPassword = 'text'
    }else{
      this.showPassword = 'password'
    }
  }

  handleChangeShowrRePassword():void{
    if(this.showRePassword == 'password'){
      this.showRePassword = 'text'
    }else{
      this.showRePassword = 'password'
    }
  }

  handleSendUser():void{
    if(this.username == ""){
      this.notiService.Show("Please enter user", "error")
      return
    }
    this.APIForget(this.username)
    
  }

  handleNavigate(route: string):void{
    this.router.navigate([route])
  }

  isPasswordValid(password: string): boolean {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pattern.test(password);
  }

  handleChangePassword():void{
    if(this.repeatPassword != this.password){
      this.notiService.Show("Repeat password not match", 'error')
      return
    }
    if(this.isPasswordValid(this.password) == true){
      this.notiService.Show("password need strong more!", 'error')
      return
    }

    this.changePassword.NewPassword = this.repeatPassword
    this.APIChangePassword(this.changePassword)
  }

}
