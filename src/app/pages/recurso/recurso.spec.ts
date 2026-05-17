import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Recurso } from "./recurso";

describe('Recurso', () => {
  let component: Recurso;
  let fixture: ComponentFixture<Recurso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recurso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recurso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
