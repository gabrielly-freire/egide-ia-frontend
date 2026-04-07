import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRegistration } from './report-registration';

describe('ReportRegistration', () => {
  let component: ReportRegistration;
  let fixture: ComponentFixture<ReportRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
