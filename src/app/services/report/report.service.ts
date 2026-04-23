import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../base/base'; // IMPORTANTE
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
}
