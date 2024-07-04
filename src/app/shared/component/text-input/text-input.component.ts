import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Component cung cấp 1 label và 1 textbox
 * + Chức năng: Sau khi nhập vào textbox và blur ra thì gọi getValue để nhận giá trị
 * - label: là Textbox được mặc định bên trái
 * - widthBlock: là chiều dài từ đầu label cho tới cuối textbox
 * - widthTextBox: là chiều dài của textbox
 * - heightTextBox: là chiều cao của textbox
 * - typeValue: input nhập vô chỉ được là text hay number
 * - Và một số thuộc tính style khác...
 */
@Component({
  selector: 'component-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})

export class TextInputComponent implements OnInit {
  @Input() label: string = 'Textbox';
  @Input() placeholder: string = '';
  @Input() widthBlock: number = 450;
  @Input() widthTextBox: number = 300;
  @Input() heightTextBox: number = 30;
  @Input() bgColor: string = '#fff';
  @Input() color: string = '#000';
  @Input() rounded: number = 5;
  @Input() paddingLeft: number;
  @Input() paddingRight: number = 0;
  @Input() boxShadow: string = 'rgba(0, 0, 0, 0.2) 0px 5px 10px';
  @Input() borderWidth: number = 1;
  @Input() borderColor: string = '#B6B6B6';
  @Input() typeValue: 'text' | 'number' = 'text';
  @Input() size: number = 13;
  @Input() readOnly: boolean = false;
  @Input() value: any;
  @Output() getValue = new EventEmitter();
  valueTextBox: string = '';

  ngOnInit(): void {
    if(this.value || this.value === 0){
      this.valueTextBox = this.value;
    }
  }

  // Đẩy dữ liệu nhập vào cho component cha
  sendValueTextBox() {
    this.getValue.emit(this.valueTextBox);
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.typeValue === 'number') {
      // Cho phép các ký tự số và các phím chức năng như backspace
      if (!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key) && !this.isNumber(event.key)) {
        event.preventDefault();
      }
    }
  }

  resetValue(){
    this.valueTextBox = ''
  }  

  isNumber(str: string) {
    return /^\d+$/.test(str);
  }
}
