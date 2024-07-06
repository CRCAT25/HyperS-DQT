import { DTOBill } from "src/app/admin-pages/shared/dto/DTOBill.dto";
import { DTOAddress } from "./DTOAddress";

export class DTOProfile{
    Name: string;
    PhoneNumber: string;
    ListAddress: DTOAddress[];
    ListBill: DTOBill[]
}