import { DTOProcessToPayment } from 'src/app/ecom-pages/shared/dto/DTOProcessToPayment';
import { DTOUpdateBill } from './DTOUpdateBill.dto';

export class DTOUpdateBillRequest {
    DTOUpdateBill: DTOUpdateBill;
    DTOProceedToPayment: DTOProcessToPayment;

}