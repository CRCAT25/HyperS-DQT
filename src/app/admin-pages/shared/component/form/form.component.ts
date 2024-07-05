import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @Input() text: string="THÔNG TIN CÁ NHÂN";
  @Input() isDisabled: boolean = false;
}
