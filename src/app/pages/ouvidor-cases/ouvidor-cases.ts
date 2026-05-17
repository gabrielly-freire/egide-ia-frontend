import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ReportService } from '../../services/report/report.service';
import { OuvidorCaseDTO } from '../../models/report.model';

@Component({
  selector: 'app-ouvidor-cases',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './ouvidor-cases.html',
  styleUrl: './ouvidor-cases.css'
})
export class OuvidorCases implements OnInit {
  cases = signal<OuvidorCaseDTO[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  pendingAnalysis = computed(() =>
    this.cases().filter(c => !c.preliminaryReportIssued && !this.isClosed(c.status)).length
  );

  issued = computed(() => this.cases().filter(c => c.preliminaryReportIssued).length);

  closedNoProofs = computed(() =>
    this.cases().filter(c => (c.status || '').toUpperCase() === 'CLOSED_NO_PROOFS').length
  );

  constructor(private readonly reportService: ReportService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.reportService.getAssignedCases().subscribe({
      next: data => {
        this.cases.set(data);
        this.loading.set(false);
      },
      error: err => {
        console.error('Erro ao carregar casos atribuídos:', err);
        this.error.set('Não foi possível carregar seus casos.');
        this.loading.set(false);
      }
    });
  }

  isClosed(status: string | null | undefined): boolean {
    const s = (status || '').toUpperCase();
    return s === 'CLOSED_NO_PROOFS' || s === 'REJECTED' || s === 'RESPONDED';
  }

  statusLabel(status: string | null | undefined): string {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'PENDING':
        return 'Pendente';
      case 'ANALYZED':
        return 'Analisado pela IA';
      case 'PRELIMINARY_ISSUED':
        return 'Parecer emitido';
      case 'CLOSED_NO_PROOFS':
        return 'Encerrado (sem provas)';
      case 'REJECTED':
        return 'Rejeitado';
      case 'RESPONDED':
        return 'Respondido';
      default:
        return status || '-';
    }
  }

  statusClass(status: string | null | undefined): string {
    const s = (status || '').toUpperCase();
    if (s === 'PRELIMINARY_ISSUED') return 'status-issued';
    if (s === 'CLOSED_NO_PROOFS') return 'status-closed';
    if (s === 'ANALYZED' || s === 'PENDING') return 'status-analysis';
    return 'status-default';
  }

  riskLabel(risk: string | null): string {
    if (!risk) return '-';
    switch (risk.toUpperCase()) {
      case 'CRITICAL':
        return 'Crítico';
      case 'HIGH':
        return 'Alto';
      case 'MEDIUM':
        return 'Médio';
      case 'LOW':
        return 'Baixo';
      default:
        return risk;
    }
  }

  riskClass(risk: string | null): string {
    const r = (risk || '').toUpperCase();
    if (r === 'CRITICAL') return 'risk-critical';
    if (r === 'HIGH') return 'risk-high';
    if (r === 'MEDIUM') return 'risk-medium';
    return 'risk-low';
  }
}
