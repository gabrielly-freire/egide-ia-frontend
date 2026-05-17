import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppealRequestDTO, AppealResponseDTO } from '../../models/appeal.model';
import { FinalReportRequestDTO, FinalReportResponseDTO } from '../../models/final-report.model';
import { OuvidorCaseDTO } from '../../models/report.model';

@Injectable({ providedIn: 'root' })
export class AppealService {
  private readonly base = '/api/v1';

  constructor(private readonly http: HttpClient) {}

  submit(reportId: number | string, request: AppealRequestDTO): Observable<AppealResponseDTO> {
    return this.http
      .post<AppealResponseDTO>(`${this.base}/report/${reportId}/recurso`, request)
      .pipe(catchError(err => this.bubble(err)));
  }

  listByReport(reportId: number | string): Observable<AppealResponseDTO[]> {
    return this.http
      .get<AppealResponseDTO[]>(`${this.base}/report/${reportId}/recursos`)
      .pipe(catchError(err => this.bubble(err)));
  }

  listAssignedAppealCases(): Observable<OuvidorCaseDTO[]> {
    return this.http
      .get<OuvidorCaseDTO[]>(`${this.base}/recurso/ouvidor/casos`)
      .pipe(catchError(err => this.bubble(err)));
  }

  submitAppealReport(
    reportId: number | string,
    request: FinalReportRequestDTO
  ): Observable<FinalReportResponseDTO> {
    return this.http
      .post<FinalReportResponseDTO>(`${this.base}/recurso/report/${reportId}/relatorio`, request)
      .pipe(catchError(err => this.bubble(err)));
  }

  private bubble(err: unknown): Observable<never> {
    return new Observable(subscriber => subscriber.error(err));
  }
}
