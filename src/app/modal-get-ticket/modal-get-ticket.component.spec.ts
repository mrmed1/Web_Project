import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGetTicketComponent } from './modal-get-ticket.component';

describe('ModalGetTicketComponent', () => {
  let component: ModalGetTicketComponent;
  let fixture: ComponentFixture<ModalGetTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGetTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGetTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
