import { DTOSize } from "src/app/ecom-pages/shared/dto/DTOSize";

export class DTOBillInfo {
    Code: number = 0;
    IDProduct: string;
    Name: string;
    ImageUrl: string;
    Size: DTOSize;
    Price: number;
    Quantity: number;
    TotalPrice: number;
    Status: number;
}

