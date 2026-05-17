import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RecursoCases } from "./recurso-cases";

describe('RecursoCases', () => {
  let component: RecursoCases;
  let fixture: ComponentFixture<RecursoCases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursoCases]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursoCases);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
