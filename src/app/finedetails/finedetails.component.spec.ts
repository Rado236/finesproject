import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinedetailsComponent } from './finedetails.component';

describe('FinedetailsComponent', () => {
  let component: FinedetailsComponent;
  let fixture: ComponentFixture<FinedetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinedetailsComponent]
    });
    fixture = TestBed.createComponent(FinedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
