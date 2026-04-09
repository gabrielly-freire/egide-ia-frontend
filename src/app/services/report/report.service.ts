import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base'; // IMPORTANTE
import { ReportDTO } from '../../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService<ReportDTO> { 
  constructor(http: HttpClient) {
    super(http, '/api/v1/report');
  }
}