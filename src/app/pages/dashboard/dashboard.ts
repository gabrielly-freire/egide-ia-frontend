import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report/report.service';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  status = { total: 0, pendentes: 0, rejeitados: 0, analisados:0 };

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getStatus().subscribe(data => {
      this.status = data;
    });
  }
}