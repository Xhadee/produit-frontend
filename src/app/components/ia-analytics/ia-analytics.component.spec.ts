import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaAnalyticsComponent } from './ia-analytics.component';

describe('IaAnalyticsComponent', () => {
  let component: IaAnalyticsComponent;
  let fixture: ComponentFixture<IaAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IaAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IaAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
