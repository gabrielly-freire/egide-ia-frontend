import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AppealService } from '../../services/appeal/appeal.service';
import { ReportService } from '../../services/report/report.service';
import { AppealResponseDTO } from '../../models/appeal.model';
import { FinalReportDecision, FinalReportRequestDTO, FinalReportResponseDTO } from '../../models/final-report.model';
import { FileDTO, OuvidorCaseDTO, PenaltyType } from '../../models/report.model';

@Component({
  selector: 'app-analise-recurso',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './analise-recurso.html',
  styleUrl: './analise-recurso.css'
})
export class AnaliseRecurso implements OnInit {
  caseInfo = signal<OuvidorCaseDTO | null>(null);
  appeals = signal<AppealResponseDTO[]>([]);
  proofs = signal<FileDTO[]>([]);
  result = signal<FinalReportResponseDTO | null>(null);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  serverError = signal<string | null>(null);

  readonly penaltyOptions: ReadonlyArray<{ value: PenaltyType; label: string }> = [
    { value: 'ADVERTENCIA', label: 'Advertência' },
    { value: 'SUSPENSAO', label: 'Suspensão' },
    { value: 'DEMISSAO', label: 'Demissão' },
    { value: 'OUTRA', label: 'Outra' }
  ];

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private appealService: AppealService,
    private reportService: ReportService
  ) {
    this.form = this.fb.group({
      decision: ['ACATAR' as FinalReportDecision, [Validators.required]],
      justification: ['', [Validators.maxLength(5000)]],
      penaltyType: ['ADVERTENCIA' as PenaltyType],
      penaltyDescription: ['', [Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const reportId = idParam ? Number(idParam) : NaN;
    if (!reportId || Number.isNaN(reportId)) return;

    this.loading.set(true);
    let pending = 3;
    const done = () => {
      pending -= 1;
      if (pending <= 0) this.loading.set(false);
    };

    this.appealService.listAssignedAppealCases().pipe(finalize(done)).subscribe({
      next: cases => {
        const match = cases.find(c => c.id === reportId);
        if (match) this.caseInfo.set(match);
      },
      error: err => console.error('Erro ao carregar caso anti-viés:', err)
    });

    this.appealService.listByReport(reportId).pipe(finalize(done)).subscribe({
      next: data => this.appeals.set(data),
      error: err => console.error('Erro ao carregar recursos:', err)
    });

    this.reportService.listProofs(reportId).pipe(finalize(done)).subscribe({
      next: data => this.proofs.set(data),
      error: err => console.error('Erro ao carregar provas:', err)
    });
  }

  get currentDecision(): FinalReportDecision {
    return this.form.value.decision as FinalReportDecision;
  }

  previewUrl(file: FileDTO): string {
    return `/api/v1/files/preview/${file.id}`;
  }

  submit(): void {
    this.serverError.set(null);
    const reportId = this.caseInfo()?.id;
    if (!reportId) {
      this.serverError.set('Caso não encontrado ou não atribuído a você como novo ouvidor.');
      return;
    }

    const decision = this.form.value.decision as FinalReportDecision;
    const justification = (this.form.value.justification as string)?.trim() || '';
    const penaltyType = this.form.value.penaltyType as PenaltyType;
    const penaltyDescription = (this.form.value.penaltyDescription as string)?.trim() || '';

    if (decision === 'ACATAR' && !penaltyType) {
      this.serverError.set('Informe a penalidade ao acatar.');
      return;
    }
    if (decision === 'NEGAR' && !justification) {
      this.serverError.set('Informe a justificativa ao negar.');
      return;
    }

    const request: FinalReportRequestDTO = {
      decision,
      justification: decision === 'NEGAR' ? justification : null,
      penaltyType: decision === 'ACATAR' ? penaltyType : null,
      penaltyDescription: decision === 'ACATAR' ? penaltyDescription || null : null,
      defenseId: null
    };

    this.submitting.set(true);
    this.appealService.submitAppealReport(reportId, request).subscribe({
      next: data => {
        this.result.set(data);
        this.submitting.set(false);
      },
      error: err => {
        console.error('Erro ao submeter relatório do recurso:', err);
        this.serverError.set(err?.error?.message || 'Falha ao registrar.');
        this.submitting.set(false);
      }
    });
  }
}
