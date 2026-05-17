import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GeneralValidationAlterRequestDTO, GeneralValidationResponseDTO, OuvidorGeralCaseDTO } from '../../models/general-validation.model';
import { FinalReportResponseDTO } from '../../models/final-report.model';

@Injectable({ providedIn: 'root' })
export class OuvidorGeralService {
  private readonly baseUrl = '/api/v1/ouvidor-geral';
  private readonly reportUrl = '/api/v1/report';

  constructor(private readonly http: HttpClient) {}

  listPendingCases(): Observable<OuvidorGeralCaseDTO[]> {
    return this.http
      .get<OuvidorGeralCaseDTO[]>(`${this.baseUrl}/casos`)
      .pipe(catchError(err => this.bubble(err)));
  }

  validate(reportId: number | string): Observable<GeneralValidationResponseDTO> {
    return this.http
      .post<GeneralValidationResponseDTO>(`${this.baseUrl}/relatorio-final/${reportId}/validar`, {})
      .pipe(catchError(err => this.bubble(err)));
  }

  alter(
    reportId: number | string,
    request: GeneralValidationAlterRequestDTO
  ): Observable<GeneralValidationResponseDTO> {
    return this.http
      .post<GeneralValidationResponseDTO>(`${this.baseUrl}/relatorio-final/${reportId}/alterar`, request)
      .pipe(catchError(err => this.bubble(err)));
  }

  repass(reportId: number | string): Observable<GeneralValidationResponseDTO> {
    return this.http
      .post<GeneralValidationResponseDTO>(`${this.baseUrl}/relatorio-final/${reportId}/repassar`, {})
      .pipe(catchError(err => this.bubble(err)));
  }

  getFinalReport(reportId: number | string): Observable<FinalReportResponseDTO> {
    return this.http.get<FinalReportResponseDTO>(`${this.reportUrl}/${reportId}/relatorio-final`);
  }

  private bubble(err: unknown): Observable<never> {
    return new Observable(subscriber => subscriber.error(err));
  }
}
