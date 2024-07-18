import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcomAlsoLikeComponent } from './ecom-also-like.component';

describe('EcomAlsoLikeComponent', () => {
  let component: EcomAlsoLikeComponent;
  let fixture: ComponentFixture<EcomAlsoLikeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcomAlsoLikeComponent]
    });
    fixture = TestBed.createComponent(EcomAlsoLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
