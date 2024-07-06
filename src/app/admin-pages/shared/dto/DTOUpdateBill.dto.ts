import { DTOBillInfo } from "./DTOBillInfo.dto";

export class DTOUpdateBill {
    CodeBill: number = 0;
    Status: number;
    ListOfBillInfo: DTOBillInfo[];
    Note: string;
}