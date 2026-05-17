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

  private static readonly CLOSED_STATUSES = new Set([
    'CLOSED', 'CLOSED_NO_PROOFS', 'REJECTED', 'RESPONDED'
  ]);

  reportsInAnalysis = computed(() =>
    this.reports().filter(r => {
      const s = r.status?.toUpperCase() ?? '';
      return s !== '' && !MyReports.CLOSED_STATUSES.has(s);
    }).length
  );

  reportsCompleted = computed(() =>
    this.reports().filter(r =>
      MyReports.CLOSED_STATUSES.has(r.status?.toUpperCase() ?? '')
    ).length
  );

  constructor(private reportService: ReportService) {}

  

  ngOnInit() {
    this.reportService.getMyReports().subscribe(data => {
      this.reports.set(data);
    });
  }

  getStatusClass(status: string | undefined): string {
    const s = status?.toUpperCase() ?? '';
    if (MyReports.CLOSED_STATUSES.has(s)) return 'status-completed';
    return 'status-analysis';
  }

  statusLabel(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':                  return 'Pendente';
      case 'ANALYZED':                 return 'Analisado pela IA';
      case 'PRELIMINARY_ISSUED':       return 'Parecer preliminar emitido';
      case 'CLOSED_NO_PROOFS':         return 'Encerrado (falta de provas)';
      case 'DEFENSE_OPEN':             return 'Em defesa';
      case 'DEFENSE_UNDER_ANALYSIS':   return 'Defesa em análise';
      case 'FINAL_ISSUED':             return 'Relatório final emitido';
      case 'REPASSED':                 return 'Repassado para novo ouvidor';
      case 'GENERAL_VALIDATED':        return 'Validado pelo Ouvidor Geral';
      case 'APPEAL_OPEN':              return 'Recurso aberto';
      case 'APPEAL_UNDER_ANALYSIS':    return 'Recurso em análise';
      case 'APPEAL_AWAITING_GENERAL':  return 'Recurso aguardando OG';
      case 'CLOSED':                   return 'Encerrado';
      default:                         return status ?? 'Pendente';
    }
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
