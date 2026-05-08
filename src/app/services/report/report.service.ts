import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from '../base/base';
import {
  ReportDTO,
  ReportRespondRequestDTO,
  ReportRespondResponseDTO,
  ReportResponseSuggestionResponseDTO
} from '../../models/report.model';

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


  suggestResponse(reportId: number | string): Observable<ReportResponseSuggestionResponseDTO> {
    return this.http.get<ReportResponseSuggestionApiDTO>(`${this.url}/${reportId}/sugerir-resposta`).pipe(
      map(data => ({
        reportId: data.report_id,
        suggestedResponse: data.suggested_response
      })),
      catchError(err => this.handleError(err))
    );
  }

  respond(reportId: number | string, request?: ReportRespondRequestDTO | null): Observable<ReportRespondResponseDTO> {
    const responseText = request?.responseText?.trim();
    const aiSuggestion = request?.aiSuggestion?.trim();

    const body =
      (responseText && responseText.length > 0) || (aiSuggestion && aiSuggestion.length > 0)
        ? {
            ...(responseText && responseText.length > 0 ? { responseText } : {}),
            ...(aiSuggestion && aiSuggestion.length > 0 ? { aiSuggestion } : {})
          }
        : null;

    return this.http.post<ReportRespondResponseDTO>(`${this.url}/${reportId}/responder`, body).pipe(
      catchError(err => this.handleError(err))
    );
  }

  getResponse(reportId: number | string): Observable<ReportRespondResponseDTO> {
    return this.http.get<ReportRespondResponseDTO>(`${this.url}/${reportId}/resposta`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  submitSurvey(reportId: number, surveyData: {
    speedRating: number;
    resolutionRating: number;
    comments: string;
  }): Observable<void> {
    return this.http.post<void>(`${this.url}/${reportId}/survey`, surveyData);
  }
}
