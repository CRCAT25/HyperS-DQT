import { Component, Input, Output,EventEmitter } from '@angular/core';
import { DataError } from '../../data/dataErrorr';

@Component({
  selector: 'app-popup-exchange-return',
  templateUrl: './popup-exchange-return.component.html',
  styleUrls: ['./popup-exchange-return.component.scss']
})
export class PopupExchangeReturnComponent {
  dataError: any[] = DataError
  listErrorString: any[] = []
  ErrorString: string
  valueErr: string = ""
  @Input() expanded: boolean = false
  @Output() outError = new EventEmitter<string>();


  handleChooseErr(data: any) {
    const item = this.dataError.find(i => i.id === data.id);
    if (item) {
        item.select = !item.select;
    }

    const index = this.listErrorString.findIndex(i => i.id === data.id);
    if (index !== -1) {
        this.listErrorString.splice(index, 1); // Correct usage of splice to remove 1 element at index
    } else {
        this.listErrorString.push(item); // Adding item if it doesn't exist in listErrorString
    }

}


  handleSendErr():void{
    this.listErrorString.forEach(element => {
      this.valueErr +=',' + element
    });
    this.outError.emit(this.valueErr)
  }

}
