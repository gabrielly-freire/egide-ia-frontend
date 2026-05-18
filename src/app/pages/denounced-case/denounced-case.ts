import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportService } from '../../services/report/report.service';
import { DenouncedCaseDTO } from '../../models/defense.model';

@Component({
  selector: 'app-denounced-case',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './denounced-case.html',
  styleUrl: './denounced-case.css'
})
export class DenouncedCase implements OnInit {
  caseData = signal<DenouncedCaseDTO | null>(null);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  resultMessage = signal<string | null>(null);

  form: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reportService: ReportService
  ) {
    this.form = this.fb.group({
      defenseText: ['', [Validators.required, Validators.maxLength(5000)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const reportId = idParam ? Number(idParam) : NaN;
    if (!reportId || Number.isNaN(reportId)) {
      return;
    }

    this.loading.set(true);
    this.reportService.getDenouncedCases().subscribe({
      next: data => {
        const found = (data || []).find(c => c.reportId === reportId) || null;
        this.caseData.set(found);
        this.loading.set(false);
      },
      error: err => {
        console.error('Erro ao carregar caso:', err);
        this.loading.set(false);
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    this.selectedFiles = files;
  }

  fileDownloadUrl(fileId: number): string {
    return `/api/v1/files/download/${fileId}`;
  }

  submit(): void {
    const c = this.caseData();
    if (!c) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const defenseText = (this.form.value.defenseText as string).trim();
    this.submitting.set(true);
    this.resultMessage.set(null);

    this.reportService.submitDefense(c.reportId, { defenseText }, this.selectedFiles).subscribe({
      next: () => {
        this.submitting.set(false);
        this.resultMessage.set('Defesa enviada com sucesso.');
      },
      error: err => {
        console.error('Erro ao enviar defesa:', err);
        this.submitting.set(false);
        this.resultMessage.set(typeof err === 'string' ? err : 'Erro ao enviar defesa.');
      }
    });
  }
}
