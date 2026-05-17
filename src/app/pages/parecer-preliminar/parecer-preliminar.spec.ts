import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ParecerPreliminar } from "./parecer-preliminar";

describe('ParecerPreliminar', () => {
  let component: ParecerPreliminar;
  let fixture: ComponentFixture<ParecerPreliminar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParecerPreliminar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParecerPreliminar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
