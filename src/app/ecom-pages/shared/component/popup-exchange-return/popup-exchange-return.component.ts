import { Component, Input, Output,EventEmitter } from '@angular/core';
import { DataError } from '../../data/dataErrorr';
import { NotiService } from '../../service/noti.service';

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
  @Input() expanded: boolean = true;
  @Output() expandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() outError = new EventEmitter<string>();

  constructor(private notiService: NotiService){}


  handleChooseErr(data: any) {
    const item = this.dataError.find(i => i.id === data.id);
    if (item) {
        item.select = !item.select;
    }

    const index = this.listErrorString.findIndex(i => i.id === data.id);
    if (index !== -1) {
        this.listErrorString.splice(index, 1); 
    } else {
        this.listErrorString.push(item); 
    }

}


  handleSendErr():void{
    if(this.valueErr == "" && this.listErrorString.length == 0){
      this.notiService.Show("Please give my your problem 🤗", "error")
      return
    }
    this.valueErr = this.listErrorString.map(element => element.text).join(',');
    this.outError.emit(this.valueErr)
    this.toggleExpanded()
  }

  handleClose():void{
    this.expanded = false
  }

  toggleExpanded() {
    this.ErrorString = ""
    this.listErrorString = []
    this.dataError.forEach(element => {
      element.select = false
    });
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
    
  }

}
