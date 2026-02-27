import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurDetailsComponent } from './fournisseur-details.component';

describe('FournisseurDetailsComponent', () => {
  let component: FournisseurDetailsComponent;
  let fixture: ComponentFixture<FournisseurDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FournisseurDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FournisseurDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
