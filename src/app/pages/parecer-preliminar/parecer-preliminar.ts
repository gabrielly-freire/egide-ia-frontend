import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { ReportService } from '../../services/report/report.service';
import { FileDTO, PenaltyType, PreliminaryReportDecision, PreliminaryReportRequestDTO, PreliminaryReportResponseDTO, ProofObservationResponseDTO, ReportDTO, ReportResponseSuggestionResponseDTO } from '../../models/report.model';

interface ProofRow {
  file: FileDTO;
  observation: string;
  saving: boolean;
  savedAt?: string;
}

@Component({
  selector: 'app-parecer-preliminar',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './parecer-preliminar.html',
  styleUrl: './parecer-preliminar.css'
})
export class ParecerPreliminar implements OnInit {
  report = signal<ReportDTO | null>(null);
  suggestion = signal<ReportResponseSuggestionResponseDTO | null>(null);
  proofs = signal<ProofRow[]>([]);
  existingPreliminary = signal<PreliminaryReportResponseDTO | null>(null);
  result = signal<PreliminaryReportResponseDTO | null>(null);
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
    private reportService: ReportService
  ) {
    this.form = this.fb.group({
      decision: ['ACATAR' as PreliminaryReportDecision, [Validators.required]],
      justification: ['', [Validators.maxLength(5000)]],
      penaltyType: ['ADVERTENCIA' as PenaltyType],
      penaltyDescription: ['', [Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const reportId = idParam ? Number(idParam) : NaN;
    if (!reportId || Number.isNaN(reportId)) {
      return;
    }

    this.loading.set(true);
    let pending = 4;
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

    this.reportService
      .listProofs(reportId)
      .pipe(finalize(done))
      .subscribe({
        next: files => this.proofs.set(files.map(f => ({ file: f, observation: '', saving: false }))),
        error: err => console.error('Erro ao carregar provas:', err)
      });

    this.reportService
      .listProofObservations(reportId)
      .pipe(finalize(done))
      .subscribe({
        next: observations => this.mergeObservations(observations),
        error: err => console.error('Erro ao carregar observações:', err)
      });

    this.reportService
      .getPreliminaryReport(reportId)
      .pipe(finalize(done))
      .subscribe({
        next: data => {
          this.existingPreliminary.set(data);
          this.form.patchValue({
            decision: data.decision,
            justification: data.justification || '',
            penaltyType: data.penaltyType || 'ADVERTENCIA',
            penaltyDescription: data.penaltyDescription || ''
          });
        },
        error: (err: unknown) => {
          const httpErr = err as HttpErrorResponse;
          if (httpErr?.status === 404) {
            pending += 1;
            this.reportService
              .suggestResponse(reportId)
              .pipe(finalize(done))
              .subscribe({
                next: data => this.suggestion.set(data),
                error: e => console.error('Erro ao carregar sugestão da IA:', e)
              });
            return;
          }
          console.error('Erro ao carregar parecer preliminar:', err);
        }
      });
  }

  private mergeObservations(observations: ProofObservationResponseDTO[]): void {
    const byFile = new Map(observations.map(o => [o.fileId, o]));
    this.proofs.set(
      this.proofs().map(row => {
        const existing = byFile.get(row.file.id);
        return existing
          ? { ...row, observation: existing.observation, savedAt: existing.updatedAt || existing.createdAt }
          : row;
      })
    );
  }

  updateObservation(fileId: number, value: string): void {
    this.proofs.set(this.proofs().map(p => (p.file.id === fileId ? { ...p, observation: value } : p)));
  }

  saveObservation(row: ProofRow): void {
    const reportId = this.report()?.id;
    if (!reportId) return;
    const trimmed = (row.observation || '').trim();
    if (!trimmed) {
      alert('Escreva uma observação antes de salvar.');
      return;
    }

    this.proofs.set(this.proofs().map(p => (p.file.id === row.file.id ? { ...p, saving: true } : p)));

    this.reportService.upsertProofObservation(reportId, row.file.id, { observation: trimmed }).subscribe({
      next: saved => {
        this.proofs.set(
          this.proofs().map(p =>
            p.file.id === row.file.id
              ? { ...p, saving: false, savedAt: saved.updatedAt || saved.createdAt, observation: saved.observation }
              : p
          )
        );
      },
      error: err => {
        console.error('Erro ao salvar observação:', err);
        this.proofs.set(this.proofs().map(p => (p.file.id === row.file.id ? { ...p, saving: false } : p)));
        alert('Não foi possível salvar a observação.');
      }
    });
  }

  useSuggestion(): void {
    const suggested = this.suggestion()?.suggestedResponse || '';
    const decision: PreliminaryReportDecision = this.form.value.decision;
    if (decision === 'ACATAR') {
      this.form.patchValue({ penaltyDescription: suggested });
    } else {
      this.form.patchValue({ justification: suggested });
    }
  }

  decisionLabel(d: PreliminaryReportDecision): string {
    switch (d) {
      case 'ACATAR':
        return 'Acatar a denúncia';
      case 'NEGAR':
        return 'Negar a denúncia';
      case 'NEGAR_FALTA_PROVAS':
        return 'Encerrar por falta de provas';
    }
  }

  decisionHint(d: PreliminaryReportDecision): string {
    switch (d) {
      case 'ACATAR':
        return 'Caso avança para a defesa do denunciado. Informe a penalidade proposta.';
      case 'NEGAR':
        return 'Caso avança para a defesa do denunciado. Informe a justificativa da negativa.';
      case 'NEGAR_FALTA_PROVAS':
        return 'O caso será encerrado. O denunciado NÃO é notificado.';
    }
  }

  get currentDecision(): PreliminaryReportDecision {
    return this.form.value.decision as PreliminaryReportDecision;
  }

  submit(): void {
    this.serverError.set(null);
    const reportId = this.report()?.id;
    if (!reportId) return;

    const decision = this.form.value.decision as PreliminaryReportDecision;
    const justification = (this.form.value.justification as string)?.trim() || '';
    const penaltyDescription = (this.form.value.penaltyDescription as string)?.trim() || '';
    const penaltyType = this.form.value.penaltyType as PenaltyType;

    if (decision === 'ACATAR') {
      if (!penaltyType) {
        alert('Informe o tipo de penalidade ao acatar a denúncia.');
        return;
      }
    } else if (!justification) {
      alert('Informe a justificativa para negar a denúncia.');
      return;
    }

    const aiSuggestion = this.suggestion()?.suggestedResponse || null;
    const request: PreliminaryReportRequestDTO = {
      decision,
      justification: decision === 'ACATAR' ? null : justification,
      penaltyType: decision === 'ACATAR' ? penaltyType : null,
      penaltyDescription: decision === 'ACATAR' ? penaltyDescription || null : null,
      aiSuggestion
    };

    this.submitting.set(true);
    this.reportService.submitPreliminaryReport(reportId, request).subscribe({
      next: data => {
        this.result.set(data);
        this.existingPreliminary.set(data);
        this.submitting.set(false);
      },
      error: err => {
        console.error('Erro ao submeter parecer preliminar:', err);
        const msg = typeof err === 'string' ? err : (err?.error?.message || 'Falha ao registrar o parecer.');
        this.serverError.set(msg);
        this.submitting.set(false);
      }
    });
  }

  statusLabel(value: string | null | undefined): string {
    const status = (value || '').toUpperCase();
    switch (status) {
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
        return value || '-';
    }
  }

  formatDateTime(value: string | null | undefined): string {
    if (!value) return '';
    const normalized = this.normalizeIsoDate(value);
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  fileSizeLabel(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  previewUrl(file: FileDTO): string {
    return `/api/v1/files/preview/${file.id}`;
  }

  private normalizeIsoDate(value: string): string {
    const match = value.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})?$/);
    if (!match) return value;
    const base = match[1];
    const fraction = match[2];
    const tz = match[3] ?? '';
    if (!fraction) return `${base}${tz}`;
    const ms = fraction.slice(0, 3).padEnd(3, '0');
    return `${base}.${ms}${tz}`;
  }
}
