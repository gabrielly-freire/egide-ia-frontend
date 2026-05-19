import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report/report.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  status = signal({ 
    total: 0, 
    pendentes: 0, 
    rejeitados: 0, 
    analisados: 0,
    mediaAgilidade: 0,
    mediaResolucao: 0 
  });

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getStatus().subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data);
        this.status.set(data);
      },
      error: (err) => console.error('Erro ao buscar dashboard:', err)
    });
  }

  downloadGovernancePdf(): void {
  this.reportService.exportarGovernanca().subscribe(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `governanca-${new Date().toISOString().slice(0, 10)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
}