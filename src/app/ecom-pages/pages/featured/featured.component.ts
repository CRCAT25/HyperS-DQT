import { Component, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DTOProduct } from '../../shared/dto/DTOProduct';
import { ProductService } from '../../shared/service/product.service';
import { CompositeFilterDescriptor, FilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSecondContent } from '../../shared/data/dataSecondPages';
import { CartService } from '../../shared/service/cart.service';
import { BannerService } from '../../shared/service/banner.service';
import { DTOBanner } from 'src/app/admin-pages/shared/dto/DTOBanner.dto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  dataBaner: DTOBanner[] = []

  dataBanner1: DTOBanner
  dataBanner3: DTOBanner

  src = ""


  constructor(
    private cartService: CartService,
    private productService: ProductService, 
    private router: Router, 
    private route: ActivatedRoute,
    private bannerService: BannerService,
  )
    {
    this.APIGetListProductDesc(this.filterProductDesc)
    this.codeCustomer = Number(localStorage.getItem('codeCustomer'))
    this.APIGetListBanner()
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

  APIGetListBanner():void{
    this.isLoading = true
    this.bannerService.getListBanner().pipe(takeUntil(this.destroy)).subscribe(data => {
      if(data.ErrorString != "" || data.StatusCode != 0){
        alert("Lỗi khi lấy api ")
        this.isLoading = false
        return 
      }
      this.dataBaner = data.ObjectReturn.Data
      this.dataBaner.forEach(element => {
        if(element.Position == 1 && element.Status == 0){
          this.dataBanner1 = element
        }
        if(element.Position == 3 && element.Status == 0){
          this.dataBanner3 = element
        }
      });


      this.src = this.dataBanner1.BannerUrl + '?controls=0&showinfo=0&modestbranding=1&mute=1&autoplay=1&loop=1&playlist=6Pjw7uFmJDg&modestbranding=1&iv_load_policy=3&fs=0&rel=0'
      console.log(this.src);
      
      this.isLoading = false
    })
  }

  log(){
    console.log(this.ListProductDesc);
  }

  isYoutube(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (youtubeRegex.test(url)) {
      return true;
    }
    return false;
  }

  getYoutubeEmbedUrl(url: string): string {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId ? videoId.indexOf('&') : -1;
    return ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId;
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
