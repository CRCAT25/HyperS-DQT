import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotiService } from './shared/service/noti.service';

@Component({
  selector: 'app-ecom-pages',
  templateUrl: './ecom-pages.component.html',
  styleUrls: ['./ecom-pages.component.scss']
})
export class EcomPagesComponent {
  codeCustomer: number
  validateCustomer: boolean = true

  constructor(private router: Router, private notiService: NotiService){
    this.codeCustomer = Number(localStorage.getItem('codeCustomer'))

    if(this.codeCustomer != -1){
      
      this.validateCustomer = true
    }
    else{
      this.validateCustomer = false
      notiService.Show("Please logout admin to go this Page", 'error')
      this.navigate('account/login')
    }
  }

  navigate(route: string) {
    this.router.navigate([route])
  }
}
