import { Component } from '@angular/core';
import { DTOStaTusByCode } from '../../shared/dto/DTOStatusByCode';

@Component({
  selector: 'app-ecom-profile',
  templateUrl: './ecom-profile.component.html',
  styleUrls: ['./ecom-profile.component.scss']
})
export class EcomProfileComponent {

  handleGetStatusByCode(Code: number): DTOStaTusByCode{
    let result: DTOStaTusByCode
    switch(Code){
      case 0: 
        return {Code: Code ,Text: "Waiting for confirmation", Icon: "fa-hourglass-start", Color: ""}
      case 1:
        return {Code: Code ,Text: "Being packed", Icon: "fa-box", Color: ""}
      case 2:
        return {Code: Code ,Text: "In transit", Icon: "fa-truck", Color: ""}
      case 3:
        return {Code: Code ,Text: "Successfully delivered", Icon: "fa-truck-ramp-box", Color: ""}
      case 4:
        return {Code: Code ,Text: "Delivery failed", Icon: "fa-circle-exclamation", Color: ""}
      case 5:
        return {Code: Code ,Text: "Return request", Icon: "fa-rotate-left", Color: ""}
      case 6:
        return {Code: Code ,Text: "Exchange request", Icon: "fa-rev", Color: ""}
      case 7:
        return {Code: Code ,Text: "Order cancelled", Icon: "fa-ban", Color: ""}
      case 8:
        return {Code: Code ,Text: "Received returned/exchanged item", Icon: "fa-hand-holding-hand", Color: ""}
      }
      return result
  }

}
