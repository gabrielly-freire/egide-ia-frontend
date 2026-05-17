export type AppealStatus = 'OPEN' | 'UNDER_ANALYSIS' | 'AWAITING_GENERAL' | 'CLOSED';

export type AppellantRole = 'DENUNCIANTE' | 'DENUNCIADO';

export interface AppealRequestDTO {
  appellantRole?: AppellantRole | null;
  grounds: string;
}

export interface AppealResponseDTO {
  id: number;
  reportId: number;
  appellantUserId: number | null;
  appellantName: string | null;
  appellantRole: AppellantRole;
  grounds: string;
  newOuvidorId: number | null;
  newOuvidorName: string | null;
  status: AppealStatus;
  submittedAt: string;
  closedAt: string | null;
}
