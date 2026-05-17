import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OuvidorGeralService } from '../../services/ouvidor-geral/ouvidor-geral.service';
import { OuvidorGeralCaseDTO } from '../../models/general-validation.model';

@Component({
  selector: 'app-ouvidor-geral-cases',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './ouvidor-geral-cases.html',
  styleUrl: './ouvidor-geral-cases.css'
})
export class OuvidorGeralCases implements OnInit {
  cases = signal<OuvidorGeralCaseDTO[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  finalReportsCount = computed(() => this.cases().filter(c => !c.isAppealReport).length);
  appealReportsCount = computed(() => this.cases().filter(c => c.isAppealReport).length);
  repassedCount = computed(() => this.cases().filter(c => c.repassCount > 0).length);

  constructor(private readonly service: OuvidorGeralService) { }

  ngOnInit(): void {
    this.loading.set(true);
    this.service.listPendingCases().subscribe({
      next: data => {
        this.cases.set(data);
        this.loading.set(false);
      },
      error: err => {
        console.error('Erro ao carregar casos pendentes:', err);
        this.error.set('Não foi possível carregar os casos pendentes.');
        this.loading.set(false);
      }
    });
  }

  decisionLabel(d: string | null): string {
    if (d === 'ACATAR') return 'Acatar';
    if (d === 'NEGAR') return 'Negar';
    return '-';
  }

  statusLabel(status: string | null): string {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'FINAL_ISSUED':
        return 'Aguardando validação';
      case 'APPEAL_AWAITING_GENERAL':
        return 'Aguardando validação pós-recurso';
      default:
        return status || '-';
    }
  }
}
