import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { OuvidorGeralService } from '../../services/ouvidor-geral/ouvidor-geral.service';
import { ReportService } from '../../services/report/report.service';
import { FinalReportDecision, FinalReportResponseDTO } from '../../models/final-report.model';
import { GeneralValidationAction, GeneralValidationAlterRequestDTO, GeneralValidationResponseDTO } from '../../models/general-validation.model';
import { PenaltyType, ReportDTO } from '../../models/report.model';

@Component({
  selector: 'app-ouvidor-geral-validation',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './ouvidor-geral-validation.html',
  styleUrl: './ouvidor-geral-validation.css'
})
export class OuvidorGeralValidation implements OnInit {
  report = signal<ReportDTO | null>(null);
  finalReport = signal<FinalReportResponseDTO | null>(null);
  result = signal<GeneralValidationResponseDTO | null>(null);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  serverError = signal<string | null>(null);

  selectedAction = signal<GeneralValidationAction>('VALIDATE');

  readonly penaltyOptions: ReadonlyArray<{ value: PenaltyType; label: string }> = [
    { value: 'ADVERTENCIA', label: 'Advertência' },
    { value: 'SUSPENSAO', label: 'Suspensão' },
    { value: 'DEMISSAO', label: 'Demissão' },
    { value: 'OUTRA', label: 'Outra' }
  ];

  alterForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: OuvidorGeralService,
    private reportService: ReportService
  ) {
    this.alterForm = this.fb.group({
      alteredDecision: ['ACATAR' as FinalReportDecision, [Validators.required]],
      alteredJustification: ['', [Validators.maxLength(5000)]],
      alteredPenaltyType: ['ADVERTENCIA' as PenaltyType],
      alteredPenaltyDescription: ['', [Validators.maxLength(2000)]]
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
      if (pending <= 0) {
        this.loading.set(false);
      }
    };

    this.reportService
      .getById(reportId)
      .pipe(finalize(done))
      .subscribe({
        next: data => this.report.set(data as ReportDTO),
        error: err => console.error('Erro ao carregar manifestação:', err)
      });

    this.service
      .getFinalReport(reportId)
      .pipe(finalize(done))
      .subscribe({
        next: data => {
          this.finalReport.set(data);
          this.alterForm.patchValue({
            alteredDecision: data.decision,
            alteredJustification: data.justification || '',
            alteredPenaltyType: data.penaltyType || 'ADVERTENCIA',
            alteredPenaltyDescription: data.penaltyDescription || ''
          });
        },
        error: err => console.error('Erro ao carregar relatório final:', err)
      });
  }

  get repassCount(): number {
    return this.result()?.repassCountAfter
      ?? Number(this.route.snapshot.queryParamMap.get('repassCount') ?? 0);
  }

  get canRepass(): boolean {
    const after = this.result()?.repassCountAfter;
    if (after != null) return after < 1;
    const qp = Number(this.route.snapshot.queryParamMap.get('repassCount') ?? 0);
    return qp < 1;
  }

  setAction(action: GeneralValidationAction): void {
    if (action === 'REPASS' && !this.canRepass) {
      return;
    }
    this.selectedAction.set(action);
  }

  decisionLabel(d: FinalReportDecision | null): string {
    if (d === 'ACATAR') return 'Acatar';
    if (d === 'NEGAR') return 'Negar';
    return '-';
  }

  submit(): void {
    this.serverError.set(null);
    const reportId = this.report()?.id
      ?? Number(this.route.snapshot.paramMap.get('id') ?? '');
    if (!reportId || Number.isNaN(reportId)) return;

    const action = this.selectedAction();
    if (action === 'REPASS' && !this.canRepass) {
      this.serverError.set('Este caso já foi repassado uma vez (regra de não-loop).');
      return;
    }

    this.submitting.set(true);
    const obs = action === 'VALIDATE'
      ? this.service.validate(reportId)
      : action === 'REPASS'
        ? this.service.repass(reportId)
        : this.service.alter(reportId, this.buildAlterRequest());

    obs.subscribe({
      next: data => {
        this.result.set(data);
        this.submitting.set(false);
      },
      error: err => {
        console.error('Erro ao validar:', err);
        const msg = err?.error?.message || 'Falha ao registrar a ação.';
        this.serverError.set(msg);
        this.submitting.set(false);
      }
    });
  }

  private buildAlterRequest(): GeneralValidationAlterRequestDTO {
    const v = this.alterForm.value;
    return {
      alteredDecision: v.alteredDecision,
      alteredJustification: v.alteredDecision === 'NEGAR' ? (v.alteredJustification || '') : null,
      alteredPenaltyType: v.alteredDecision === 'ACATAR' ? v.alteredPenaltyType : null,
      alteredPenaltyDescription: v.alteredDecision === 'ACATAR' ? (v.alteredPenaltyDescription || null) : null
    };
  }

  voltar(): void {
    this.router.navigate(['/ouvidor-geral/casos']);
  }
}
