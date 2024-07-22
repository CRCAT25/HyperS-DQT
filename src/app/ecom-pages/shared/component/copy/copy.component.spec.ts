import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyComponent } from './copy.component';

describe('CopyComponent', () => {
  let component: CopyComponent;
  let fixture: ComponentFixture<CopyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyComponent]
    });
    fixture = TestBed.createComponent(CopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
