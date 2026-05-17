import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AppealService } from '../../services/appeal/appeal.service';
import { ReportService } from '../../services/report/report.service';
import { AppealResponseDTO } from '../../models/appeal.model';
import { ReportDTO } from '../../models/report.model';

@Component({
  selector: 'app-recurso',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './recurso.html',
  styleUrl: './recurso.css'
})
export class Recurso implements OnInit {
  report = signal<ReportDTO | null>(null);
  existingAppeals = signal<AppealResponseDTO[]>([]);
  result = signal<AppealResponseDTO | null>(null);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  serverError = signal<string | null>(null);

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private appealService: AppealService,
    private reportService: ReportService
  ) {
    this.form = this.fb.group({
      grounds: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(5000)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const reportId = idParam ? Number(idParam) : NaN;
    if (!reportId || Number.isNaN(reportId)) {
      return;
    }

    this.loading.set(true);
    let pending = 2;
    const done = () => {
      pending -= 1;
      if (pending <= 0) this.loading.set(false);
    };

    this.reportService.getById(reportId).pipe(finalize(done)).subscribe({
      next: data => this.report.set(data as ReportDTO),
      error: err => console.error('Erro ao carregar manifestação:', err)
    });

    this.appealService.listByReport(reportId).pipe(finalize(done)).subscribe({
      next: data => this.existingAppeals.set(data),
      error: err => console.error('Erro ao carregar recursos:', err)
    });
  }

  canAppeal(): boolean {
    const status = (this.report()?.status || '').toUpperCase();
    return status === 'GENERAL_VALIDATED';
  }

  statusHint(): string {
    const s = (this.report()?.status || '').toUpperCase();
    if (s === 'GENERAL_VALIDATED') return 'Janela de recurso aberta.';
    if (s === 'APPEAL_OPEN' || s === 'APPEAL_UNDER_ANALYSIS' || s === 'APPEAL_AWAITING_GENERAL') {
      return 'Já existe um recurso em andamento neste caso.';
    }
    return 'O recurso só pode ser aberto após a decisão do Ouvidor Geral.';
  }

  submit(): void {
    this.serverError.set(null);
    const reportId = this.report()?.id;
    if (!reportId) return;

    const grounds = (this.form.value.grounds as string).trim();
    if (grounds.length < 20) {
      this.serverError.set('Descreva os fundamentos do recurso com pelo menos 20 caracteres.');
      return;
    }

    this.submitting.set(true);
    this.appealService.submit(reportId, { grounds }).subscribe({
      next: data => {
        this.result.set(data);
        this.existingAppeals.set([...this.existingAppeals(), data]);
        this.submitting.set(false);
      },
      error: err => {
        console.error('Erro ao submeter recurso:', err);
        this.serverError.set(err?.error?.message || 'Falha ao registrar o recurso.');
        this.submitting.set(false);
      }
    });
  }
}
