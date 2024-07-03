import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DTOProduct } from '../../shared/dto/DTOProduct';
import { ProductService } from '../../shared/service/product.service';
import { DTOProductType } from '../../shared/dto/DTOProductType';
import { NotiService } from '../../shared/service/noti.service';
import { DTOBrand } from '../../shared/dto/DTOBrand';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { HeaderService } from '../../shared/service/header.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ecom-shoes',
  templateUrl: './ecom-shoes.component.html',
  styleUrls: ['./ecom-shoes.component.scss']

})
export class EcomShoesComponent implements OnInit, OnDestroy {
  ListProduct: DTOProduct[] =[]
  listProductType: DTOProductType[] = []
  typeSelected: number = -1
  listBrand: DTOBrand[] = []

  listCategorySelected: DTOProductType[] = []
  listBrandSelected: DTOBrand[] = []

  minRange: number = 0
  maxRange: number = 30
  valueRange: [number, number] = [0, 30];
  minPrice: number = this.valueRange[0]
  maxPrice:number = 15000000

  headerChangeSubscription: Subscription
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1)

  isLoading: boolean = false
  keySearch: string = ""
  selectedSort: any

  listGender:any[] = [
    {id: 0, text:"For all", checked: false},
    {id: 1, text: "Men", checked: false},
    {id: 2, text: "Women", checked: false}
  ]

  productFilter: State = {
      skip: 0,
      take: 12,
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

  listSortItem: Array<any> = [
    {text: "Low to high", dir: "asc", field: "PriceAfterDiscount"},
    {text: "High to low", dir: "desc", field: "PriceAfterDiscount"},
  ]

  constructor(
    private headerService: HeaderService,
    private productService: ProductService,
    private notiService: NotiService,
    private router: Router
  ) {
    this.initializeData();
  }

  async initializeData(): Promise<void> {
    await this.APIGetListProductType();
    await this.APIGetListBrand();
    this.handleGetRoute();
  }
  
  ngOnInit(): void {
    this.APIGetListProduct();
    this.headerChangeSubscription = this.headerService.headerChange.subscribe(() => {
      this.ListProduct = [];
      this.handleGetRoute();
      this.handleFilterItem();
    });
  }

  handleGetRoute(){
    const data = localStorage.getItem('headerRoute')
    switch(data){
      case "Main":
        break
      case "Men":
        this.listGender.forEach(element => {
          if(element.text == "Men")
            element.checked = true
          else
            element.checked = false
        });
        break
      case "Women":
        this.listGender.forEach(element => {
          if(element.text == "Women")
            element.checked = true
          else
            element.checked = false
        });
        break
      case "Nike":
        this.listBrand.forEach(element => {
          if(element.Name == "Nike"){
            this.listBrandSelected.push(element)
          }
        });
        break

    }
    this.handleFilterItem()
  }

  APIGetListProduct():void{
    this.isLoading = true
    this.productService.getListProduct(this.productFilter).pipe(takeUntil(this.destroy)).subscribe(data => {
      try{
        if(data.ErrorString != "" || data.StatusCode != 0){
          this.notiService.Show("Err when fetching data product 😭", "error")
          return
        }
        this.ListProduct = data.ObjectReturn.Data
      }catch{

      }finally{
        this.isLoading = false
      }
     
    })
  }

  async APIGetListProductType():Promise<void>{
    this.productService.getListProductType().pipe(takeUntil(this.destroy)).subscribe(data => {
      try{
        if(data.ErrorString != "" || data.StatusCode != 0){
          this.notiService.Show("Err when fetching data 😭", "error")
          return
        }
        this.listProductType = data.ObjectReturn.Data
      }catch{

      }finally{
        this.isLoading = false
      }
     
    })
  }

  APIGetListBrand(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.productService.getListBrand().pipe(takeUntil(this.destroy)).subscribe(data => {
        try {
          this.listBrand = data.ObjectReturn.Data;
          console.log(this.listBrand);
          resolve(); 
        } catch (error) {
          reject(error); 
        } finally {
          this.isLoading = false;
        }
      });
    });
  }

  handleSeletedType(idType: number):void{
    this.typeSelected = idType
  }

  handleValuePriceChange(){
    this.minPrice = this.valueRange[0] * 500000
    this.maxPrice = this.valueRange[1] * 500000
  }

  handleSelectedCatelogy(itemGet: DTOProductType):void{
    const index = this.listCategorySelected.findIndex(item => item.Code == itemGet.Code)
    if(index != -1){
      this.listCategorySelected.splice(index, 1)
    }else{
      this.listCategorySelected.push(itemGet)
    }
  }

  handleSelectedBrand(itemGet: DTOBrand):void{
    const index = this.listBrandSelected.findIndex(item => item.Code == itemGet.Code)
    if(index != -1){
      this.listBrandSelected.splice(index, 1)
    }else{
      this.listBrandSelected.push(itemGet)
    }
  }

  handleFilterItem():void{
    this.productFilter.filter.filters = []
    const filter:CompositeFilterDescriptor = {logic: 'and', filters: []}
    const filterCategory: CompositeFilterDescriptor = {logic: 'or', filters: []}
    filterCategory.filters = []
    this.listCategorySelected.forEach((item) => {
      if(item){
        filterCategory.filters.push({field: "CodeProductType", operator: 'eq', value: item.Code})
      }
    });

    const filterGender: CompositeFilterDescriptor = {logic: 'or', filters: []}
    filterGender.filters = []
    this.listGender.forEach((item) => {
      if(item.checked){
        filterGender.filters.push({field: "Gender", operator: 'eq', value: item.id})
      }
    });

    const filterBrand: CompositeFilterDescriptor = {logic: 'or', filters: []}
    filterBrand.filters = []
    this.listBrandSelected.forEach((item) => {
      if(item){
        filterBrand.filters.push({field: "CodeBrand", operator: 'eq', value: item.Code})
      }
    });

    const filterPrice: CompositeFilterDescriptor = {logic: 'and', filters: []}
    filterPrice.filters.push({field: "PriceAfterDiscount", operator: 'gte', value: this.minPrice})
    filterPrice.filters.push({field: "PriceAfterDiscount", operator: 'lte', value: this.maxPrice})

    const filterSearch: CompositeFilterDescriptor = {logic: 'or', filters: []}
    filterSearch.filters = []
    filterSearch.filters.push({field: "Name", operator: 'contains', value: this.keySearch})


  

    if(filterGender.filters.length > 0){
      filter.filters.push(filterGender)
    }
    if(filterCategory.filters.length > 0){
      filter.filters.push(filterCategory)
    }
    if(filterPrice.filters.length > 0){
      filter.filters.push(filterPrice)
    }
    if(filterBrand.filters.length > 0){
      filter.filters.push(filterBrand)
    }
    if(filterSearch.filters.length > 0){
      filter.filters.push(filterSearch)
    }

    this.productFilter.filter.filters.push(filter)
    this.APIGetListProduct()
  }

  handleApplyFilter():void{
    this.handleFilterItem()
  }

  isCheckedInputCategory(type: DTOProductType):boolean{
    return this.listCategorySelected.some(item => item.Code === type.Code);
  }

  log(){
    this.listBrand.forEach(element => {
      console.log(element.Name);
    });
  }

  handleLoadMore(){
    this.productFilter.take += 12
    this.handleApplyFilter()
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
  }


}
