import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaiementComponent } from './modal-paiement.component';

describe('ModalPaiementComponent', () => {
  let component: ModalPaiementComponent;
  let fixture: ComponentFixture<ModalPaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPaiementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
