import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'component-checkboxlist',
  templateUrl: './checkboxlist.component.html',
  styleUrls: ['./checkboxlist.component.scss']
})
export class CheckboxlistComponent implements OnInit {
  @Input() listCheckBox: any[];
  @Input() listCheckBoxDefault: any[];
  @Input() textField: string;
  @Input() valueField: any;
  @Output() getListChecked: EventEmitter<any> = new EventEmitter<any>();
  
  currentListCheckBox: any[];

  ngOnInit(): void {
    if(this.listCheckBoxDefault === undefined){
      this.currentListCheckBox = this.listCheckBox;
    }
    else{
      this.currentListCheckBox = this.listCheckBoxDefault;
    }
  }

  onClickItemCheckBox(item: any){
    if(item.IsChecked || !item.IsChecked){
      item.IsChecked = !item.IsChecked;
    }
    this.getListChecked.emit(this.currentListCheckBox);
  }

  resetCheckList(listDefault: any){
    this.currentListCheckBox = listDefault;
  }
}
