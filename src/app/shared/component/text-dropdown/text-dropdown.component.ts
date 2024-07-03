import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'component-text-dropdown',
  templateUrl: './text-dropdown.component.html',
  styleUrls: ['./text-dropdown.component.scss']
})
export class TextDropdownComponent implements OnInit {
  @Input() label: string = '';
  @Input() listItem: any[] = [];
  @Input() widthTextBox: number = 250;
  @Input() heightTextBox: number = 40;
  @Input() widthBlock: number = 250;
  @Input() bgColor: string = '#fff';
  @Input() rounded: number = 6;
  @Input() paddingLeft: number;
  @Input() paddingRight: number;
  @Input() boxShadow: string = 'rgba(0, 0, 0, 0.2) 0px 5px 10px';
  @Input() borderWidth: number = 1;
  @Input() borderColor: string = '#EFEFEF';
  @Input() defaultItem: any;
  @Input() textField: string;
  @Input() valueField: string;
  @Input() size: number = 13;
  @Input() value: any;
  @Output() getValue = new EventEmitter();

  onClickItem(value: any){
    this.getValue.emit(value);
  }

  ngOnInit(): void {
    if(!this.value){
      this.value = this.defaultItem;
    }
  }

  resetValue(){
    this.value = this.defaultItem;
  }
}
