import { Component, Input, OnInit } from '@angular/core';
import { DTOProduct } from '../../dto/DTOProduct';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ecom-product-card',
  templateUrl: './ecom-product-card.component.html',
  styleUrls: ['./ecom-product-card.component.scss']
})
export class EcomProductCardComponent implements OnInit {
  @Input() product: DTOProduct
  hasthumbnail: boolean;
  constructor(
    private router: Router
  ){
  }
  handleProductClick(product: DTOProduct){
    localStorage.setItem('productSelected', JSON.stringify(product))
    this.navigateToDetail()
  }

  navigateToDetail() {
    this.router.navigate(['ecom/product-detail'])
  }

  ngOnInit(): void {
    this.hasthumbnail = this.product.ListOfImage.some(img => img.IsThumbnail)
  }
}
