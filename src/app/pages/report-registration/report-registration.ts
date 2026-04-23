import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../services/report/report.service';

@Component({
  selector: 'app-report-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-registration.html',
  styleUrl: './report-registration.css'
})
export class ReportRegistration {
  reportForm: FormGroup;
  loading = false;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.reportForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.reportForm.valid) {
      this.loading = true;

      const formData = new FormData();

      const reportData = new Blob([JSON.stringify(this.reportForm.value)], {
        type: 'application/json'
      });
      formData.append('report', reportData);

      if (this.selectedFile) {
        formData.append('files', this.selectedFile);
      }

      this.reportService.create(formData as any).subscribe({
        next: () => {
          alert('Manifestação enviada com sucesso!');
          this.reportForm.reset();
          this.selectedFile = null;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao enviar:', err);
          alert('Erro ao enviar manifestação. Verifique a conexão com o servidor.');
          this.loading = false;
        }
      });
    }
  }
}