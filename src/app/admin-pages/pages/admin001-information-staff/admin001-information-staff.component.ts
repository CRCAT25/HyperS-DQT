import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StaffService } from '../../shared/service/staff.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';

@Component({
  selector: 'app-admin001-information-staff',
  templateUrl: './admin001-information-staff.component.html',
  styleUrls: ['./admin001-information-staff.component.scss']
})
export class Admin001InformationStaffComponent implements OnInit, OnDestroy {
  // variable Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);


  // Role của tài khoản đang được đăng nhập
  permission: string;


  constructor(private staffService: StaffService, private notiService: NotiService){}
  
  
  ngOnInit(): void {
    this.getPermission();
  }
  
  // Lấy quyền truy cập
  getPermission() {
    this.staffService.getCurrentStaffInfo().pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        const staff: DTOStaff = res.ObjectReturn.Data[0];
        this.permission = staff.Permission;
      }
    })
  }
  
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
