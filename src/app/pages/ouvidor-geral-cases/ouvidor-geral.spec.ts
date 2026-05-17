import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OuvidorGeralCases } from "./ouvidor-geral-cases";

describe('OuvidorGeralCases', () => {
  let component: OuvidorGeralCases;
  let fixture: ComponentFixture<OuvidorGeralCases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OuvidorGeralCases]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OuvidorGeralCases);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
