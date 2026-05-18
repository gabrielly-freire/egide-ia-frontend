export type NotificationType = 'PHASE3_STARTED';

export interface NotificationDTO {
  id: number;
  type: NotificationType;
  title: string;
  message?: string | null;
  createdAt?: string | null;
  readAt?: string | null;
  reportId?: number | null;
}
