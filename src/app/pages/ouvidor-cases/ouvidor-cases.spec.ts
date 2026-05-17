import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OuvidorCases } from "./ouvidor-cases";

describe('OuvidorCases', () => {
  let component: OuvidorCases;
  let fixture: ComponentFixture<OuvidorCases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OuvidorCases]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OuvidorCases);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
