import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../services/report/report.service';
import { DenouncedCaseDTO } from '../../models/defense.model';

@Component({
  selector: 'app-denounced-cases',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './denounced-cases.html',
  styleUrl: './denounced-cases.css'
})
export class DenouncedCases implements OnInit {
  cases = signal<DenouncedCaseDTO[]>([]);
  loading = signal<boolean>(false);

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.reportService.getDenouncedCases().subscribe({
      next: data => {
        this.cases.set(data || []);
        this.loading.set(false);
      },
      error: err => {
        console.error('Erro ao carregar casos contra mim:', err);
        this.loading.set(false);
      }
    });
  }
}
