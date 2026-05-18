import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';
import { NotificationDTO } from '../../models/notification.model';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  loading = signal(false);
  notifications = signal<NotificationDTO[]>([]);

  unreadCount = computed(() => this.notifications().filter(n => !n.readAt).length);

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.notificationService
      .listMyNotifications()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: data => this.notifications.set(data ?? []),
        error: err => console.error('Erro ao carregar notificações:', err),
      });
  }

  markAsRead(notification: NotificationDTO): void {
    if (!notification?.id || notification.readAt) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        const now = new Date().toISOString();
        this.notifications.update(list =>
          list.map(n => (n.id === notification.id ? { ...n, readAt: now } : n))
        );
      },
      error: err => console.error('Erro ao marcar como lida:', err),
    });
  }

  markAllAsRead(): void {
    if (this.unreadCount() <= 0) return;

    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        const now = new Date().toISOString();
        this.notifications.update(list => list.map(n => (n.readAt ? n : { ...n, readAt: now })));
      },
      error: err => console.error('Erro ao marcar todas como lidas:', err),
    });
  }
}
