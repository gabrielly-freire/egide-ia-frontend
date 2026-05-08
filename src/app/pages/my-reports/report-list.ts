import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../services/report/report.service';
import { ReportDTO } from '../../models/report.model';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule],
  templateUrl: './report-list.html',
  styleUrl: './report-list.css'
})
export class MyReports implements OnInit {
  reports = signal<ReportDTO[]>([]);
  showFeedbackModal = false;
  selectedReportId: number | null = null;
  feedback = {
    speedRating: 0,
    resolutionRating: 0,
    comments: ''
  };

  reportsInAnalysis = computed(() => 
    this.reports().filter(r => {
      const s = r.status?.toUpperCase();
      return s === 'PENDING' || s === 'PENDENTE';
    }).length
  );

  reportsCompleted = computed(() => 
    this.reports().filter(r => {
      const s = r.status?.toUpperCase();
      return s === 'ANALYZED' || s === 'ANALISADO';
    }).length
  );

  constructor(private reportService: ReportService) {}

  

  ngOnInit() {
    this.reportService.getMyReports().subscribe(data => {
      this.reports.set(data);
    });
  }

  getStatusClass(status: string | undefined): string {
    const s = status?.toUpperCase();
    if (s === 'PENDING' || s === 'PENDENTE') return 'status-analysis';
    if (s === 'ANALYZED' || s === 'ANALISADO') return 'status-completed';
    return 'status-analysis';
  }

  openFeedback(reportId: number) {
    this.selectedReportId = reportId;
    this.showFeedbackModal = true;
  }

  enviarFeedback() {
    if (this.selectedReportId) {
      this.reportService.submitSurvey(this.selectedReportId, this.feedback).subscribe({
        next: () => {
          alert('Obrigado pelo seu feedback!');
          this.showFeedbackModal = false;
          this.resetFeedbackForm();
        },
        error: (err) => console.error('Erro ao enviar feedback', err)
      });
    }
  }

  resetFeedbackForm() {
    this.feedback = { speedRating: 0, resolutionRating: 0, comments: '' };
    this.selectedReportId = null;
  }
}
