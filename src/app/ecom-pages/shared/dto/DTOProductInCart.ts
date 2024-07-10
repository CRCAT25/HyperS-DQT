import { DTOProduct } from "./DTOProduct";
import { DTOSize } from "./DTOSize";

export class DTOProductInCart{
    Product: DTOProduct;
    Quantity: number = 0;
    TotalPriceOfProduct: number;
    SizeSelected: DTOSize
}   