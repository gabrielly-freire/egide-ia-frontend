import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationDTO } from '../../models/notification.model';
import { BaseService } from '../base/base';

@Injectable({ providedIn: 'root' })
export class NotificationService extends BaseService<NotificationDTO> {
  constructor(http: HttpClient) {
    super(http, '/api/v1/notifications');
  }

  listMyNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(this.url).pipe(
      catchError(err => this.handleError(err))
    );
  }

  unreadCount(): Observable<number> {
    return this.http.get<number>(`${this.url}/unread-count`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  markAsRead(id: number | string): Observable<void> {
    return this.http.post<void>(`${this.url}/${id}/read`, {}).pipe(
      catchError(err => this.handleError(err))
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.url}/read-all`, {}).pipe(
      catchError(err => this.handleError(err))
    );
  }
}
