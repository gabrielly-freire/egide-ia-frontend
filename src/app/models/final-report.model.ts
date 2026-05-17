import { PenaltyType } from './report.model';

export type FinalReportDecision = 'ACATAR' | 'NEGAR';

export interface FinalReportRequestDTO {
  decision: FinalReportDecision;
  justification?: string | null;
  penaltyType?: PenaltyType | null;
  penaltyDescription?: string | null;
  defenseId?: number | null;
}

export interface FinalReportResponseDTO {
  id: number;
  reportId: number;
  ouvidorId: number | null;
  ouvidorName: string | null;
  defenseId: number | null;
  decision: FinalReportDecision;
  justification: string | null;
  penaltyType: PenaltyType | null;
  penaltyDescription: string | null;
  reportStatus: string | null;
  submittedAt: string;
}
