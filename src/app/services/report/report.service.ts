import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base';
import { ReportDTO } from '../../models/report.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService<ReportDTO> { 
  constructor(http: HttpClient) {
    super(http, '/api/v1/report');
  }

  getStatus(): Observable<any> {
    return this.http.get<any>(`${this.url}/dashboard/status`);
  }

}