import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AppealService } from '../../services/appeal/appeal.service';
import { OuvidorCaseDTO } from '../../models/report.model';

@Component({
  selector: 'app-recurso-cases',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './recurso-cases.html',
  styleUrl: './recurso-cases.css'
})
export class RecursoCases implements OnInit {
  cases = signal<OuvidorCaseDTO[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private readonly appealService: AppealService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.appealService.listAssignedAppealCases().subscribe({
      next: data => {
        this.cases.set(data);
        this.loading.set(false);
      },
      error: err => {
        console.error('Erro ao carregar recursos atribuídos:', err);
        this.error.set('Não foi possível carregar seus recursos.');
        this.loading.set(false);
      }
    });
  }

  statusLabel(status: string | null): string {
    const s = (status || '').toUpperCase();
    if (s === 'APPEAL_UNDER_ANALYSIS') return 'Em análise';
    if (s === 'APPEAL_AWAITING_GENERAL') return 'Aguardando OG';
    return status || '-';
  }
}
