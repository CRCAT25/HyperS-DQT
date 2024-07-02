import { DTOImageProduct } from "./DTOImageProduct";
import { DTOSize } from "./DTOSize";

export class DTOProduct {
    Code: number = 0;
    IdProduct: string = ""
    Name: string = "";
    Price: number = 0;
    Description: string = "";
    ListOfSize: DTOSize[] = [];
    ListOfImage: DTOImageProduct[] = [];
    Discount?: number = 0;
    PriceAfterDiscount?: number = 0;
    CodeProductType: number = 0;
    ProductType: string = "";
    CodeBrand: number = 0;
    BrandName: string = "";
    Color: string = "";
    Stock: number = 0;
    Sold: number = 0;
    Gender: number = 0;
    Status: number = 0;
    ThumbnailImg: string = ""
}