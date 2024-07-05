import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Component cung cấp 1 thanh search
 * + Chức năng: Sau khi enter hoặc nhấn vào icon tìm kiếm thì sẽ tự động gọi hàm sendValueInput để gửi value tới component cha
 * - hasIcon: có icon search phía trước hay không
 * - Và một số thuộc tính style khác...
 */
@Component({
  selector: 'component-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Tìm kiếm theo...';
  @Input() hasIcon: boolean = true;
  @Input() width: number = 300;
  @Input() height: number = 40;
  @Input() bgColor: string = '#fff';
  @Input() color: string = '#000';
  @Input() rounded: number = 100;
  @Input() paddingLeft: number = 30;
  @Input() paddingRight: number = 10;
  @Input() boxShadow: string = 'rgba(0, 0, 0, 0.2) 0px 4px 5px';
  @Input() borderWidth: number;
  @Input() borderColor: string;
  @Output() getValue = new EventEmitter();
  valueSearch: string = '';

  // Đẩy dữ liệu nhập vào cho component cha
  sendValueInput() {
    this.getValue.emit(this.valueSearch);
  }

  // Xóa toàn bộ dữ liệu nhập vào
  clearValue() {
    this.valueSearch = ''
    this.getValue.emit('');
  }
}
