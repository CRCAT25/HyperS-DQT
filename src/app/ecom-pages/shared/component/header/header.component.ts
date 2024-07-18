import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataModule } from '../../data/moduleHeader';
import { Router } from '@angular/router';
import { DTOGuessCartProduct } from '../../dto/DTOGuessCartProduct';
import { CartService } from '../../service/cart.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { HeaderService } from '../../service/header.service';
import { UserService } from '../../service/user.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  dataModuleHeader = DataModule
  totalItemCart: number = 0
  cartUpdateSubscription: Subscription;
  codeCustomer:number = this.userService.codeCustomer
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)

  constructor(private userService: UserService, private headerService: HeaderService, private cartService: CartService, private router: Router){}

  APIGetCountCartOfUser():void{

  }

  handleSelectActionCenter(action: number){
    this.dataModuleHeader.forEach(element => {
      if(element.id == action){
        element.isSelected = true
        localStorage.setItem('headerRoute', element.text)
      }
      else{
        element.isSelected = false
      }
    });
    this.headerService.emitHeaderChange()
  }

  ngOnInit(): void {
    this.cartUpdateSubscription = this.cartService.cartUpdate.subscribe(() => {
      this.updateTotalItemCart();
    });
    if(this.codeCustomer != 0){
      this.APIGetCountInCart(this.codeCustomer);
    }else{
      this.updateTotalItemCart();
    }


  }

  APIGetCountInCart(code: number){
    this.cartService.setTotalItemProduct(code)
    this.cartService.totalItemProduct$.subscribe(data => {
      this.totalItemCart = data
    })
  }

  private updateTotalItemCart(): void {
    this.totalItemCart = 0
    const productCart = localStorage.getItem('cacheCart');
    if (productCart) {
      const listData = JSON.parse(productCart) as DTOGuessCartProduct[];
      listData.forEach(element => {
        this.totalItemCart += element.Quantity
      });
    }
  }

  navigate(route: string){
    this.router.navigate([route])
  }

  navigateProfile(){
    const codeCustomer = localStorage.getItem('codeCustomer')
    if(codeCustomer){
      this.navigate('/ecom/profile')
    }else{
      this.navigate('/account/login')
    }
  }

}
