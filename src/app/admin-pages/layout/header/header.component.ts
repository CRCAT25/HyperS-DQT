import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DTOChangePassword } from 'src/app/account-pages/shared/dto/DTOChangePassword';
import { AuthService } from 'src/app/account-pages/shared/services/account.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { StaffService } from '../../shared/service/staff.service';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderAdminComponent implements OnInit {
  isShowOldPass: boolean = false;
  isShowNewPass: boolean = false;
  isShowNewPass2: boolean = false;
  showOldPass: string = "password";
  showNewPass: string = "password";
  showNewPass2: string = "password";
  infoStaff: DTOStaff;
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  isChangePass: boolean = false;

  constructor(private accoutService: AuthService, private notiService: NotiService, private router: Router,
    private staffService: StaffService
  ) { }

  //ViewChild input
  @ViewChild('oldPass') childOldPass: ElementRef;
  @ViewChild('newPass') childNewPass: ElementRef;
  @ViewChild('newPass2') childNewPass2: ElementRef;

  ngOnInit(): void {
    this.getInfoStaff();
  }

  //Mở popUp thay đổi mật khẩu
  onClickButtonChange(){
    this.isChangePass = true;
  }

  //Đóng popUp thay đổi mật khẩu
  onClickButtonNoChange(){
    this.isChangePass = false;
  }

  //ShowPassword
  handleChangeShowPassword(type: number): void {
    if (type == 0) {
      this.isShowOldPass = !this.isShowOldPass;
      if (this.showOldPass == 'password') {
        this.showOldPass = 'text'
      } else {
        this.showOldPass = 'password'
      }
    } else if (type == 1) {
      this.isShowNewPass = !this.isShowNewPass;
      if (this.showNewPass == 'password') {
        this.showNewPass = 'text'
      } else {
        this.showNewPass = 'password'
      }
    } else if (type == 2) {
      this.isShowNewPass2 = !this.isShowNewPass2;
      if (this.showNewPass2 == 'password') {
        this.showNewPass2 = 'text'
      } else {
        this.showNewPass2 = 'password'
      }
    }
  }

  // Lấy thông tin staff đang login
  getInfoStaff() {
    this.staffService.getCurrentStaffInfo().pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        const staff: DTOStaff = res.ObjectReturn.Data[0];
        this.infoStaff = staff;
      }
    })
  }

  handleNavigate(route: string): void {
    this.router.navigate([route])
  }

  //ChangePass
  UpdatePassword(): void {
    console.log(this.childOldPass.nativeElement.value);
    const changePassword: DTOChangePassword = {
      Email: this.infoStaff.Email,
      OldPassword: this.childOldPass.nativeElement.value,
      NewPassword: this.childNewPass.nativeElement.value,
      Token: null
    }
    if (this.childOldPass.nativeElement.value == "") {
      this.notiService.Show("Vui lòng nhập mật khẩu cũ", 'warning')
    } else if (this.childNewPass.nativeElement.value == "") {
      this.notiService.Show("Vui lòng nhập mật khẩu mới", 'warning')
    } else if (this.childNewPass2.nativeElement.value == "") {
      this.notiService.Show("Vui lòng nhập lại mật khẩu mới", 'warning')
    } else {
      if (this.childNewPass.nativeElement.value == this.childNewPass2.nativeElement.value) {
        this.accoutService.changePassword(changePassword).pipe(takeUntil(this.destroy)).subscribe(data => {
          if (data.ObjectReturn.Errors.length > 0) {
            this.notiService.Show(data.ObjectReturn.Errors[0].Description, 'error')
          } else {
            this.notiService.Show("Thay đổi mật khẩu thành công!", 'success')
            setTimeout(() => {
              this.handleNavigate('account/login')
            }, 2000);
          }
        })
      } else {
        this.notiService.Show("Mật khẩu mới không trùng khớp nhau", 'warning')
      }
    }
  }
}
