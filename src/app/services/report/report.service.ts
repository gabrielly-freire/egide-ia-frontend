import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from '../base/base';
import {
  FileDTO,
  OuvidorCaseDTO,
  PreliminaryReportRequestDTO,
  PreliminaryReportResponseDTO,
  ProofObservationRequestDTO,
  ProofObservationResponseDTO,
  ReportDTO,
  ReportResponseSuggestionResponseDTO
} from '../../models/report.model';
import { FinalReportRequestDTO, FinalReportResponseDTO } from '../../models/final-report.model';
import { DefenseDTO, DefenseRequestDTO, DenouncedCaseDTO } from '../../models/defense.model';

interface ReportResponseSuggestionApiDTO {
  report_id: number;
  suggested_response: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService<ReportDTO> {
  constructor(http: HttpClient) {
    super(http, '/api/v1/report');
  }

  getMyReports(): Observable<ReportDTO[]> {
    return this.http.get<ReportDTO[]>(`${this.url}/my-reports`);
  }

  getStatus(): Observable<any> {
    return this.http.get<any>(`${this.url}/dashboard/status`);
  }

  getAssignedCases(): Observable<OuvidorCaseDTO[]> {
    return this.http
      .get<OuvidorCaseDTO[]>(`${this.url}/ouvidor/casos`)
      .pipe(catchError(err => this.handleError(err)));
  }

  suggestResponse(reportId: number | string): Observable<ReportResponseSuggestionResponseDTO> {
    return this.http.get<ReportResponseSuggestionApiDTO>(`${this.url}/${reportId}/sugerir-resposta`).pipe(
      map(data => ({
        reportId: data.report_id,
        suggestedResponse: data.suggested_response
      })),
      catchError(err => this.handleError(err))
    );
  }

  submitPreliminaryReport(
    reportId: number | string,
    request: PreliminaryReportRequestDTO
  ): Observable<PreliminaryReportResponseDTO> {
    return this.http
      .post<PreliminaryReportResponseDTO>(`${this.url}/${reportId}/parecer-preliminar`, request)
      .pipe(catchError(err => this.handleError(err)));
  }

  getPreliminaryReport(reportId: number | string): Observable<PreliminaryReportResponseDTO> {
    return this.http.get<PreliminaryReportResponseDTO>(`${this.url}/${reportId}/parecer-preliminar`);
  }

  listProofs(reportId: number | string): Observable<FileDTO[]> {
    return this.http
      .get<FileDTO[]>(`/api/v1/files/by-report/${reportId}`)
      .pipe(catchError(err => this.handleError(err)));
  }

  listProofObservations(reportId: number | string): Observable<ProofObservationResponseDTO[]> {
    return this.http
      .get<ProofObservationResponseDTO[]>(`${this.url}/${reportId}/observacoes`)
      .pipe(catchError(err => this.handleError(err)));
  }

  upsertProofObservation(
    reportId: number | string,
    fileId: number,
    request: ProofObservationRequestDTO
  ): Observable<ProofObservationResponseDTO> {
    return this.http
      .post<ProofObservationResponseDTO>(`${this.url}/${reportId}/provas/${fileId}/observacao`, request)
      .pipe(catchError(err => this.handleError(err)));
  }

  submitFinalReport(
    reportId: number | string,
    request: FinalReportRequestDTO
  ): Observable<FinalReportResponseDTO> {
    return this.http
      .post<FinalReportResponseDTO>(`${this.url}/${reportId}/relatorio-final`, request)
      .pipe(catchError(err => this.handleError(err)));
  }

  getFinalReport(reportId: number | string): Observable<FinalReportResponseDTO> {
    return this.http
      .get<FinalReportResponseDTO>(`${this.url}/${reportId}/relatorio-final`)
      .pipe(catchError(err => this.handleError(err)));
  }

  submitSurvey(
    reportId: number,
    surveyData: {
      speedRating: number;
      resolutionRating: number;
      comments: string;
    }
  ): Observable<void> {
    return this.http.post<void>(`${this.url}/${reportId}/survey`, surveyData);
  }

  getDenouncedCases(): Observable<DenouncedCaseDTO[]> {
    return this.http.get<DenouncedCaseDTO[]>(`/api/v1/denunciado/casos`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  getDefense(reportId: number | string): Observable<DefenseDTO> {
    return this.http.get<DefenseDTO>(`${this.url}/${reportId}/defesa`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  submitDefense(
    reportId: number | string,
    request: DefenseRequestDTO,
    files?: File[] | null
  ): Observable<DefenseDTO> {
    const formData = new FormData();
    formData.append(
      'defense',
      new Blob([JSON.stringify(request)], { type: 'application/json' })
    );

    (files || []).forEach(f => formData.append('files', f));

    return this.http.post<DefenseDTO>(`${this.url}/${reportId}/defesa`, formData).pipe(
      catchError(err => this.handleError(err))
    );
  }

  concluirRelato(reportId: number | string): Observable<ReportDTO> {
    return this.http
      .post<ReportDTO>(`${this.url}/${reportId}/concluir`, {})
      .pipe(catchError(err => this.handleError(err)));
  }

  exportarPdf(reportId: number | string): Observable<Blob> {
    return this.http
      .get(`${this.url}/${reportId}/exportar`, { responseType: 'blob' })
      .pipe(catchError(err => this.handleError(err)));
  }

  exportarGovernanca(): Observable<Blob> {
  return this.http
    .get(`${this.url}/exportar-governanca`, { responseType: 'blob' })
    .pipe(catchError(err => this.handleError(err)));
}

}