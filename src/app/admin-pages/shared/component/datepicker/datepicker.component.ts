import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';

/**
 * This component provide user a customized datepicker from kendo
 * Having 2 input: minDate, maxDate
 * Having 1 output: datePicked(date is picked)
 */
@Component({
  selector: 'component-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  // public value: Date = new Date(yyyy, MM, dd);
  @Output() datePicked = new EventEmitter();
  @Input() defaultDate: Date;
  @Input() minDate: Date = new Date();
  @Input() maxDate: Date = new Date();
  @Input() label: string;
  @Input() hasLabel: boolean = false;
  @Input() widthBlock: number;
  @ViewChild('datePicker', { static: false }) datePicker!: DatePickerComponent;
  // valueDate: Date;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {

  }

  public onChange(value: Date): void {
    this.datePicked.emit(value);
  }

  resetDate(){
    // this.valueDate = null
    // this.datePicker.writeValue(null);
    this.datePicker.writeValue(new Date());
  }
}
