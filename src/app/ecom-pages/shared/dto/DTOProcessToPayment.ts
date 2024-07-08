import { DTOGuessCartProduct } from "./DTOGuessCartProduct";
import { DTOProductInCart } from "./DTOProductInCart";

export class DTOProcessToPayment {
    CustomerName: string;
    OrdererPhoneNumber: string;
    PhoneNumber: string;
    ShippingAddress: string;
    PaymentMethod: number;
    ListProduct: DTOProductInCart[];
    TotalBill: number;
    IsGuess: boolean;
}