import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './shared/service/layout.service';
import { listModule } from './shared/dto/DTOModule.dto';
import { DTOStaff } from './shared/dto/DTOStaff.dto';
import { DTOResponse } from '../in-layout/Shared/dto/DTORespone';

@Component({
  selector: 'app-admin-pages',
  templateUrl: './admin-pages.component.html',
  styleUrls: ['./admin-pages.component.scss']
})
export class AdminPagesComponent implements OnInit, OnDestroy{
  currentStaff: DTOStaff;

  constructor(private router: Router, private layoutService: LayoutService) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    listModule.forEach(module => {
      if(!module.SubModule){
        if(module.RouteLink === currentUrl){
          this.layoutService.setSelectedModule(module.BreadCrumb);
        }
      }
      else{
        module.SubModule.forEach(sub => {
          if(sub.RouteLink === currentUrl){
            this.layoutService.setSelectedModule(module.BreadCrumb);
          }
        })
      }
    })
    // console.log(currentUrl);
  }
  
  ngOnDestroy(): void {
    // localStorage.removeItem('routerLink');
    // localStorage.removeItem('moduleName');
    // localStorage.removeItem('breadcrumb');
  }
}
