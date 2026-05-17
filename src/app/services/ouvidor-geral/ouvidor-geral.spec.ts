import { TestBed } from "@angular/core/testing";
import { OuvidorGeralService } from "./ouvidor-geral.service";

describe('Base', () => {
  let service: OuvidorGeralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuvidorGeralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});