import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatchValidator } from './password-match.validator';
import { passwordValidator } from './password-validator';
import { AuthService } from '../../shared/services/account.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DTOSignup } from '../../shared/dto/DTOSignup';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnDestroy {
  showPassword: string = 'password'
  showRePassword: string = "password"
  formInfoSignUp: FormGroup
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)
  isLoading: boolean = false

  infoSingup: DTOSignup = {
    Name: "",
    Email: "",
    PhoneNumber: "",
    Password: ""
  }

  type: string = "signup"

  constructor(private router: Router, private authService: AuthService, private notiService: NotiService){
    this.formInfoSignUp = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?[0-9]{1,3}?[-.\s]?([0-9]{1,4}[-.\s]?){1,3}$/)]),
      passwords: new FormGroup({
        password: new FormControl('', [Validators.required, passwordValidator()]),
        confirmPassword: new FormControl('', Validators.required)
      }, { validators: passwordMatchValidator('password', 'confirmPassword') })
    })
  }

  APISignup(info: DTOSignup):void{
    this.isLoading = true
    this.authService.signup(info).pipe(takeUntil(this.destroy)).subscribe((data) => {
      if(data.ErrorString == ""){
        console.log(data);
        if(data.ObjectReturn.Result?.Succeeded == true){
          this.type = 'thanks'
        }
      }else{
        this.notiService.Show(data.ErrorString, "error")
      }


      this.isLoading = false
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

  handleNavigate(route: string):void{
    this.router.navigate([route])
  }

  submit():void{
    if(this.formInfoSignUp.valid){
      this.APISignup(this.infoSingup)
    }else{
      alert("Error")
    }
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
  }
}
