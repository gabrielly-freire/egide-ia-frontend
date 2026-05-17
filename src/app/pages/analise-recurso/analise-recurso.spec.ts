import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AnaliseRecurso } from "./analise-recurso";


describe('AnaliseRecurso', () => {
  let component: AnaliseRecurso;
  let fixture: ComponentFixture<AnaliseRecurso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliseRecurso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliseRecurso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
