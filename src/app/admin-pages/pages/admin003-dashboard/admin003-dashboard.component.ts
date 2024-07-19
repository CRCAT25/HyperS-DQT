import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { StaffService } from '../../shared/service/staff.service';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';
import { DTOResponse } from 'src/app/in-layout/Shared/dto/DTORespone';
import { takeUntil } from 'rxjs/operators';
import { DTOStaff } from '../../shared/dto/DTOStaff.dto';
import { SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { IntlService } from '@progress/kendo-angular-intl';
import { Align } from '@progress/kendo-angular-popup';
import { DashboardService } from '../../shared/service/dashboard.service';
import { DTOBillAnalysticResponse } from '../../shared/dto/DTOBillAnalysticResponse.dto';
import { DTOGetAnalysticRequest } from '../../shared/dto/DTOGetAnalysticRequest.dto';
import { DTOAnalysticResponseMonth } from '../../shared/dto/DTOAnalysticResponseMonth.dto';
import { DTOAnalysticResponseWeek } from '../../shared/dto/DTOAnalysticResponseWeek.dto';

interface Model {
  product: string;
  sales: number;
}

@Component({
  selector: 'app-admin003-dashboard',
  templateUrl: './admin003-dashboard.component.html',
  styleUrls: ['./admin003-dashboard.component.scss']
})
export class Admin003DashboardComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  minDate: Date = new Date(1900, 1, 1);
  maxDate: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  minDatePicker: Date = new Date(2023, 12, 1);

  toggleText = "Hide";
  show = false;
  popupAlign: Align = { horizontal: "right", vertical: "bottom" };
  anchorAlign: Align = { horizontal: "right", vertical: "top" };

  listMonth: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  listTotalStatusBill: DTOBillAnalysticResponse;
  listResponeMonth: DTOAnalysticResponseMonth[];
  listResponeWeek: DTOAnalysticResponseWeek[];
  monthSelected: number = this.currentDate.getMonth() +1;
  yearSelected: number = this.currentDate.getFullYear();
  textChooseMonth: string =  "Tháng "+ this.monthSelected;
  valueDate: Date;

  pieData = [
    { category: "0-14", value: 0.2545 },
    { category: "15-24", value: 0.1552 },
    { category: "25-54", value: 0.4059 },
    { category: "55-64", value: 0.0911 },
    { category: "65+", value: 0.094 },
  ];
  listPermissionAvaiable: string[] = ['Admin'];

  seriesData: Model[] = [
    {
      product: "Chai",
      sales: 200,
    },
    {
      product: "Others",
      sales: 250,
    },
  ];

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);


  // Role của tài khoản đang được đăng nhập
  permission: string;


  constructor(private staffService: StaffService, private notiService: NotiService, private intl: IntlService, private dashBoardService: DashboardService) {
    this.labelContent = this.labelContent.bind(this);
  }


  ngOnInit(): void {
    this.getPermission();
    this.getDashboardByFilterYear();
    this.getDashboardByFilterMonth();
    this.getListTotalStatusBill();
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

  // Kiểm tra có permission có thể truy cập hay không
  checkPermission() {
    if (this.listPermissionAvaiable.includes(this.permission)) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  labelContent(args: SeriesLabelsContentArgs): string {
    return `${args.dataItem.category}: ${this.intl.formatNumber(
      args.dataItem.value,
      "p2"
    )}`;
  }


  formatCurrency(value: number): string {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
      return 'Invalid value';
    }
  }


  onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? "Hidе" : "Show";
  }

  // getChangeMonth(value: any, month: number) {
  //   this.monthSelected = month;
  //   this.textChooseMonth = value.text;
  //   this.show = false;
  //   console.log(this.valueDate.getMonth()+1);
  //   this.getDashboardByFilterMonth();
  // }

  getChangeMonth(date: Date) {
    this.monthSelected = date.getMonth()+1;
    this.yearSelected = date.getFullYear();
    // this.textChooseMonth = value.text;
    this.getDashboardByFilterMonth();
    this.getDashboardByFilterYear();
  }

  getTitleTotalBill(value: number, type: string): number {
    let total: number = 0;
    if (type === "Đơn bị hủy hoặc giao thất bại") {
      total = this.listTotalStatusBill.TotalBill - this.listTotalStatusBill.TotalCompleteBill - this.listTotalStatusBill.TotalInCompleteBill - this.listTotalStatusBill.TotalPendingBill;
    } else {
      total = value * this.listTotalStatusBill.TotalBill;
    }
    return Math.round(total); // Trả về giá trị đã làm tròn
  }
  

  // Lấy danh sách các total bill
  getListTotalStatusBill() {
    this.dashBoardService.getListTotalBill().pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        if (res.ObjectReturn) {
          this.listTotalStatusBill = res.ObjectReturn;
          console.log(this.listTotalStatusBill);
          this.pieData = [];

          // Push các giá trị từ billStatus vào pieData
          const percentTotalComplete: number = this.listTotalStatusBill.TotalCompleteBill / this.listTotalStatusBill.TotalBill;
          const percentTotalInComplete: number = this.listTotalStatusBill.TotalInCompleteBill / this.listTotalStatusBill.TotalBill;
          const percentTotalPending: number = this.listTotalStatusBill.TotalPendingBill / this.listTotalStatusBill.TotalBill;
          const remainingTotal: number = 1 - percentTotalComplete - percentTotalInComplete - percentTotalPending;

          // alert(percentTotalComplete)
          // this.pieData.push({ category: 'TotalBill', value: billStatus.TotalBill });
          this.pieData.push({ category: 'Đơn đã hoàn tất', value: percentTotalComplete });
          this.pieData.push({ category: 'Đơn đang xử lý', value: percentTotalInComplete });
          this.pieData.push({ category: 'Đơn chưa xác nhận', value: percentTotalPending });
          this.pieData.push({ category: 'Đơn bị hủy hoặc giao thất bại', value: remainingTotal });


          console.log(this.pieData); // Kiểm tra pieData mới
        } else {
          console.error('ObjectReturn is null or undefined');
        }
      } else {
        console.error('Error status code:', res.StatusCode);
      }
    });
  }

    // Lấy thống kê doanh thu theo filter month
    getDashboardByFilterMonth() {
      const request: DTOGetAnalysticRequest = {
        Month: this.monthSelected,
        Year: this.yearSelected,
        IsMonthSort: true
      }
  
      this.dashBoardService.filterDashboard(request).pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
        if (res.StatusCode === 0) {
          if (res.ObjectReturn) {
            this.listResponeWeek = res.ObjectReturn;
            this.listResponeWeek.forEach((weekData: DTOAnalysticResponseWeek) => {
              weekData.WeekLabel = `Tuần ${weekData.Week}`;
            });
            console.log(this.listResponeWeek);
  
          } else {
            console.error('ObjectReturn is null or undefined');
          }
        } else {
          console.error('Error status code:', res.StatusCode);
        }
      });
    }

  // Lấy thống kê doanh thu theo filter year
  getDashboardByFilterYear() {
    const request: DTOGetAnalysticRequest = {
      Month: 7,
      Year: this.yearSelected,
      IsMonthSort: false
    }

    this.dashBoardService.filterDashboard(request).pipe(takeUntil(this.destroy)).subscribe((res: DTOResponse) => {
      if (res.StatusCode === 0) {
        if (res.ObjectReturn) {
          this.listResponeMonth = res.ObjectReturn;
          this.listResponeMonth.forEach((monthData: DTOAnalysticResponseMonth) => {
            monthData.MonthLabel = `Tháng ${monthData.Month}`;
          });
          console.log(this.listResponeMonth);

        } else {
          console.error('ObjectReturn is null or undefined');
        }
      } else {
        console.error('Error status code:', res.StatusCode);
      }
    });
  }
}
