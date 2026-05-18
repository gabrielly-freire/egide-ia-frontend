import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ReportService } from '../../services/report/report.service';
import { FileDTO, ReportDTO } from '../../models/report.model';
import { DefenseDTO } from '../../models/defense.model';
import { FinalReportRequestDTO } from '../../models/final-report.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-defense-review',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './defense-review.html',
  styleUrl: './defense-review.css'
})
export class DefenseReview implements OnInit {
  report = signal<ReportDTO | null>(null);
  proofs = signal<FileDTO[]>([]);
  defense = signal<DefenseDTO | null>(null);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  message = signal<string | null>(null);

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reportService: ReportService
  ) {
    this.form = this.fb.group({
      decision: ['ACATAR', [Validators.required]],
      justification: ['', [Validators.maxLength(8000)]],
      penaltyType: [null],
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
    let pending = 3;
    const done = () => {
      pending -= 1;
      if (pending <= 0) {
        this.loading.set(false);
      }
    };

    this.reportService
      .getById(reportId)
      .pipe(finalize(() => done()))
      .subscribe({
        next: data => this.report.set(data),
        error: err => console.error('Erro ao carregar manifestação:', err)
      });

    this.reportService
      .getDefense(reportId)
      .pipe(finalize(() => done()))
      .subscribe({
        next: data => this.defense.set(data),
        error: (err: unknown) => {
          const httpErr = err as HttpErrorResponse;
          if (httpErr?.status === 404) {
            this.defense.set(null);
            return;
          }
          console.error('Erro ao carregar defesa:', err);
        }
      });

    this.reportService
      .listProofs(reportId)
      .pipe(finalize(() => done()))
      .subscribe({
        next: data => this.proofs.set(data ?? []),
        error: err => {
          this.proofs.set([]);
          console.error('Erro ao carregar provas do denunciante:', err);
        }
      });
  }

  fileDownloadUrl(fileId: number): string {
    return `/api/v1/files/download/${fileId}`;
  }

  submitFinalReport(): void {
    const reportId = this.report()?.id;
    if (!reportId) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const req: FinalReportRequestDTO = {
      decision: this.form.value.decision,
      justification: ((this.form.value.justification as string | undefined) || '').trim() || undefined,
      penaltyType: this.form.value.penaltyType || undefined,
      penaltyDescription: ((this.form.value.penaltyDescription as string | undefined) || '').trim() || undefined
    };

    this.submitting.set(true);
    this.message.set(null);
    this.reportService.submitFinalReport(reportId, req).subscribe({
      next: () => {
        this.submitting.set(false);
        this.message.set('Relatório final emitido com sucesso.');
      },
      error: err => {
        console.error('Erro ao emitir relatório final:', err);
        this.submitting.set(false);
        this.message.set(typeof err === 'string' ? err : 'Erro ao emitir relatório final.');
      }
    });
  }
}
