import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportDTO } from '../../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly API = '/api/v1/report'; 

  constructor(private http: HttpClient) {}

  create(report: ReportDTO): Observable<ReportDTO> {
    return this.http.post<ReportDTO>(this.API, report);
  }
}