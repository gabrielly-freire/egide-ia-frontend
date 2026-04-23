import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportService } from '../../services/report/report.service';
import { finalize } from 'rxjs/operators';
import {
  ReportDTO,
  ReportRespondResponseDTO,
  ReportResponseSuggestionResponseDTO
} from '../../models/report.model';

@Component({
  selector: 'app-report-response',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './report-response.html',
  styleUrl: './report-response.css'
})
export class ReportResponse implements OnInit {
  report = signal<ReportDTO | null>(null);
  suggestion = signal<ReportResponseSuggestionResponseDTO | null>(null);
  result = signal<ReportRespondResponseDTO | null>(null);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);

  form: FormGroup;

  @ViewChild('responseTextarea') responseTextarea?: ElementRef<HTMLTextAreaElement>;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reportService: ReportService
  ) {
    this.form = this.fb.group({
      responseText: ['', [Validators.maxLength(5000)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const reportId = idParam ? Number(idParam) : NaN;
    if (!reportId || Number.isNaN(reportId)) {
      return;
    }

    let pending = 2;
    this.loading.set(true);

    this.reportService
      .getById(reportId)
      .pipe(
        finalize(() => {
          pending -= 1;
          if (pending <= 0) {
            this.loading.set(false);
          }
        })
      )
      .subscribe({
        next: data => this.report.set(data),
        error: err => console.error('Erro ao carregar manifestação:', err)
      });

    this.reportService
      .suggestResponse(reportId)
      .pipe(
        finalize(() => {
          pending -= 1;
          if (pending <= 0) {
            this.loading.set(false);
          }
        })
      )
      .subscribe({
        next: data => {
          this.suggestion.set(data);
          this.form.patchValue({ responseText: data.suggestedResponse });
        },
        error: err => console.error('Erro ao carregar sugestão:', err)
      });
  }

  useSuggestion(): void {
    const suggested = this.suggestion()?.suggestedResponse || '';
    this.form.patchValue({ responseText: suggested });
    this.form.get('responseText')?.markAsDirty();
    this.form.get('responseText')?.markAsTouched();
    this.form.updateValueAndValidity();

    queueMicrotask(() => {
      const el = this.responseTextarea?.nativeElement;
      if (!el) {
        return;
      }
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  submit(): void {
    const reportId = this.report()?.id;
    if (!reportId) {
      return;
    }

    const responseText = this.form.value.responseText as string | undefined;
    const aiSuggestion = this.suggestion()?.suggestedResponse;

    if ((!responseText || responseText.trim().length === 0) && (!aiSuggestion || aiSuggestion.trim().length === 0)) {
      alert('Informe um texto de resposta ou utilize a sugestão da IA.');
      return;
    }
    this.submitting.set(true);

    this.reportService.respond(reportId, { responseText, aiSuggestion }).subscribe({
      next: data => {
        this.result.set(data);
        this.submitting.set(false);
        alert('Resposta registrada com sucesso!');
      },
      error: err => {
        console.error('Erro ao responder:', err);
        this.submitting.set(false);
        alert('Erro ao registrar resposta. Verifique a conexão com o servidor.');
      }
    });
  }

  formatDateTime(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const normalized = this.normalizeIsoDate(value);
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  private normalizeIsoDate(value: string): string {
    const match = value.match(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})?$/
    );
    if (!match) {
      return value;
    }

    const base = match[1];
    const fraction = match[2];
    const tz = match[3] ?? '';

    if (!fraction) {
      return `${base}${tz}`;
    }

    const ms = fraction.slice(0, 3).padEnd(3, '0');
    return `${base}.${ms}${tz}`;
  }
}
