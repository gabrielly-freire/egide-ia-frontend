import { FinalReportDecision } from './final-report.model';
import { PenaltyType } from './report.model';

export type GeneralValidationAction = 'VALIDATE' | 'ALTER' | 'REPASS';

export interface GeneralValidationAlterRequestDTO {
  alteredDecision: FinalReportDecision;
  alteredJustification?: string | null;
  alteredPenaltyType?: PenaltyType | null;
  alteredPenaltyDescription?: string | null;
}

export interface GeneralValidationResponseDTO {
  id: number;
  reportId: number;
  finalReportId: number | null;
  appealReportId: number | null;
  ouvidorGeralId: number | null;
  ouvidorGeralName: string | null;
  action: GeneralValidationAction;
  alteredDecision: FinalReportDecision | null;
  alteredJustification: string | null;
  alteredPenaltyType: PenaltyType | null;
  alteredPenaltyDescription: string | null;
  repassNewOuvidorId: number | null;
  repassNewOuvidorName: string | null;
  repassCountAfter: number;
  reportStatus: string | null;
  decidedAt: string;
}

export interface OuvidorGeralCaseDTO {
  id: number;
  protocolNumber: string;
  title: string;
  status: string | null;
  repassCount: number;
  canRepass: boolean;
  isAppealReport: boolean;
  pendingDecision: FinalReportDecision | null;
  pendingSubmittedAt: string | null;
}
