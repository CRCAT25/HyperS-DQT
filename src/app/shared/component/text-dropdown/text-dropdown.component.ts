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
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Output() getValue = new EventEmitter();
  @Output() valueChange = new EventEmitter(); // Thêm sự kiện valueChange
  @Input() hasEmitValueChange: number = 0; // Truyền Output valueChange nếu có input hasEmitValueChange != 0


  onClickItem(value: any){
    this.getValue.emit(value);
    if(this.hasEmitValueChange !== 0){
      this.valueItemChange(value);
    }
  }

  valueItemChange(value: any){
    this.value = value; 
    this.valueChange.emit(value);
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
