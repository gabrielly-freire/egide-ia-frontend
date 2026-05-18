import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  unreadCount = signal(0);
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    timer(0, 30000)
      .pipe(
        switchMap(() => this.notificationService.unreadCount()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: count => this.unreadCount.set(Number(count ?? 0)),
        error: () => this.unreadCount.set(0),
      });
  }
}
