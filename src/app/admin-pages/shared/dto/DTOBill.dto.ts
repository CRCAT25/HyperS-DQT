import { DTOBillInfo } from "./DTOBillInfo.dto";

export class DTOBill {
    Code: number = 0;
    CustomerName: string;
    PhoneNumber: string;
    ShippingAddress: string;
    CreateAt: Date;
    PaymentMethod: number;
    Status: number;
    ListBillInfo:DTOBillInfo[];
    // Voucher: string = "Không có";
    TotalDiscount: number;
    TotalBill: number;
    Note: string;
}



