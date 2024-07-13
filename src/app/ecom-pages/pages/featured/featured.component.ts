import { Component, OnDestroy } from '@angular/core';
import { DTOProduct } from '../../shared/dto/DTOProduct';
import { ProductService } from '../../shared/service/product.service';
import { CompositeFilterDescriptor, FilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSecondContent } from '../../shared/data/dataSecondPages';
import { CartService } from '../../shared/service/cart.service';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnDestroy {
  dataContentSecond = DataSecondContent
  ListProductDesc: DTOProduct[] =[]
  filterProductDesc: State = {
    take: 10,
    sort: [{field: 'code', dir: 'desc'}]
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)
  codeCustomer: number
  isLoading: boolean = false

  isOpenPopThanks: boolean = false


  constructor(private cartService: CartService,private productService: ProductService, private router: Router, private route: ActivatedRoute){
    this.APIGetListProductDesc(this.filterProductDesc)
    this.codeCustomer = Number(localStorage.getItem('codeCustomer'))
  }

  ngOnInit(): void {
    if(this.router.url == '/ecom/home?status=success'){
      this.isOpenPopThanks = true
    } 
    this.cartService.emitCartUpdated()
    this.cartService.setTotalItemProduct(this.codeCustomer)
  }


  APIGetListProductDesc(filter: State): void {
    this.isLoading = true
    this.productService.getListProduct(filter).pipe(takeUntil(this.destroy)).subscribe(data => {
      if(data.ErrorString != "" || data.StatusCode != 0){
        alert("Lỗi khi lấy api ")
        this.isLoading = false
        return
        
      }
      this.ListProductDesc = data.ObjectReturn.Data
      this.isLoading = false
    })
  }

  log(){
    console.log(this.ListProductDesc);
  }

  handleProductClick(product: DTOProduct){
    localStorage.setItem('productSelected', JSON.stringify(product))
    this.navigateToDetail()
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
  }

  navigateToDetail() {
    this.router.navigate(['ecom/product-detail'])
  }

  handleGetShoses(router: string, type: string){
    localStorage.setItem('headerRoute', router)
    this.router.navigate(['ecom/shose'])
  }

  handleOffPopThanks():void{
    this.isOpenPopThanks = false
  }
}
