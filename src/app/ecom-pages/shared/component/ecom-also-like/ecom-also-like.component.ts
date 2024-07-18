import { Component, Input, OnInit } from '@angular/core';
import { DTOProduct } from '../../dto/DTOProduct';
import { ProductService } from '../../service/product.service';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { NotiService } from '../../service/noti.service';

@Component({
  selector: 'app-ecom-also-like',
  templateUrl: './ecom-also-like.component.html',
  styleUrls: ['./ecom-also-like.component.scss']
})
export class EcomAlsoLikeComponent implements OnInit {

  listProductFilter: DTOProduct[] = []
  listProduct: DTOProduct[] = []
  isLoading: boolean = false
  @Input() productType: string = ""
  @Input() Code: number = -1;

  productFilter: State = {
    skip: 0,
    take: 10,
    sort: [
    {
      field: "Code",
      dir: "desc"
    }
  ],
  filter: {
    logic: "and",
    filters: [
    ]
  }
} 


destroy: ReplaySubject<any> = new ReplaySubject<any>(1)

  constructor (
    private productService: ProductService,
    private notiService: NotiService
  ){
  }

  ngOnInit(): void {
  try{
    const filter: CompositeFilterDescriptor = {logic: 'and', filters:[]}
    filter.filters = []
    filter.filters.push({field: "ProductType", operator: 'eq', value: this.productType})
    this.productFilter.filter.filters.push(filter)
  }catch{

  }
  finally{
    this.APIGetListProduct()
  }

  }

  APIGetListProduct():void{
    this.isLoading = true
    console.log(this.productFilter);
    this.productService.getListProduct(this.productFilter).pipe(takeUntil(this.destroy)).subscribe(data => {
      try{
        console.log(data);
        if(data.ErrorString != "" || data.StatusCode != 0){
          this.notiService.Show("Err when fetching data product 😭", "error")
          return
        }
        this.listProduct = data.ObjectReturn.Data
      }catch{

      }finally{
        // if(this.listProduct.length < this.productFilter.take){
        //   this.isShowLoadMore = false
        // }else{
        //   this.isShowLoadMore = true
        // }

        const index = this.listProduct.findIndex(item => item.Code == this.Code);
        if (index !== -1) {
          this.listProductFilter = this.listProduct.splice(index, 1);
        }


        if(this.listProduct.length == 0){
          this.productFilter.filter.filters = []
          this.APIGetListProduct()
        }
        this.isLoading = false
      }
     
    })
  }
}
