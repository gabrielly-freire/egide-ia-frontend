import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../services/report/report.service';
import { ReportDTO } from '../../models/report.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './report-list.html',
  styleUrl: './report-list.css'
})
export class ReportList implements OnInit {
  reports = signal<ReportDTO[]>([]);

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.list().subscribe({
      next: (data: ReportDTO[]) => { 
        this.reports.set(data);
      },
      error: (err: any) => {
        console.error('Erro na listagem:', err);
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    const s = status?.toUpperCase();
    if (s === 'PENDING' || s === 'PENDENTE') return 'status-analysis';
    if (s === 'ANALYZED' || s === 'ANALISADO') return 'status-completed';
    return 'status-analysis';
  }
}