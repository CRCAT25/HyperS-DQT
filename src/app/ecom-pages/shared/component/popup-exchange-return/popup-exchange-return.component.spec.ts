import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupExchangeReturnComponent } from './popup-exchange-return.component';

describe('PopupExchangeReturnComponent', () => {
  let component: PopupExchangeReturnComponent;
  let fixture: ComponentFixture<PopupExchangeReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupExchangeReturnComponent]
    });
    fixture = TestBed.createComponent(PopupExchangeReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
