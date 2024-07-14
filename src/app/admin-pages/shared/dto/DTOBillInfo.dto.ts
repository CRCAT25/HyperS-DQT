import { DTOSize } from "src/app/ecom-pages/shared/dto/DTOSize";

export class DTOBillInfo {
    Code: number = 0;
    IDProduct: string;
    Name: string;
    ImageURL: string;
    Size: DTOSize;
    Price: number;
    Quantity: number;
    TotalPrice: number;
    Status: number;
    Discount: number;
    PriceAfterDiscount: number;
    Note?: string;
}

