export type FinalReportDecision = 'ACATAR' | 'NEGAR';
export type PenaltyType = 'ADVERTENCIA' | 'SUSPENSAO' | 'DEMISSAO' | 'OUTRA';

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
  ouvidorId: number;
  ouvidorName: string;
  defenseId: number | null;
  decision: FinalReportDecision;
  justification: string | null;
  penaltyType: PenaltyType | null;
  penaltyDescription: string | null;
  reportStatus: string;
  submittedAt: string;
}
