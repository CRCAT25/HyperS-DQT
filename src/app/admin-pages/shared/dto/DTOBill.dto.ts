import { DTOBillInfo } from "./DTOBillInfo.dto";

export class DTOBill {
    Code: number = 0;
    CustomerName: string;
    PhoneNumber: string;
    OrdererPhoneNumber: string;
    ShippingAddress: string;
    CreateAt: Date;
    PaymentMethod: number;
    Status: number;
    ListBillInfo:DTOBillInfo[];
    CouponApplied: string = "Không có";
    CouponDiscount: number;
    TotalBill: number;
    Note: string;
}



