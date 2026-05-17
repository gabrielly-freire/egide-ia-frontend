export interface ReportDTO {
  id?: number;
  protocolNumber?: string;
  title: string;
  description: string;
  dateOfOccurrence?: string;
  userInfoId?: number;
  status?: string;
  ouvidorId?: number;
  ouvidorName?: string;
  createdAt?: string;
  hasSurvey?: boolean;
}

export interface ReportResponseSuggestionResponseDTO {
  reportId: number;
  suggestedResponse: string;
}

export type PreliminaryReportDecision = 'ACATAR' | 'NEGAR' | 'NEGAR_FALTA_PROVAS';

export type PenaltyType = 'ADVERTENCIA' | 'SUSPENSAO' | 'DEMISSAO' | 'OUTRA';

export interface PreliminaryReportRequestDTO {
  decision: PreliminaryReportDecision;
  justification?: string | null;
  penaltyType?: PenaltyType | null;
  penaltyDescription?: string | null;
  aiSuggestion?: string | null;
}

export interface PreliminaryReportResponseDTO {
  id: number;
  reportId: number;
  ouvidorId: number | null;
  ouvidorName: string | null;
  decision: PreliminaryReportDecision;
  justification: string | null;
  penaltyType: PenaltyType | null;
  penaltyDescription: string | null;
  aiSuggestion: string | null;
  usedAiSuggestion: boolean | null;
  reportStatus: string | null;
  submittedAt: string;
}

export interface ProofObservationRequestDTO {
  observation: string;
}

export interface ProofObservationResponseDTO {
  id: number;
  fileId: number;
  fileName: string;
  ouvidorId: number;
  observation: string;
  createdAt: string;
  updatedAt: string;
}

export interface OuvidorCaseDTO {
  id: number;
  protocolNumber: string;
  title: string;
  description: string;
  dateOfOccurrence: string | null;
  status: string | null;
  category: string | null;
  risk: string | null;
  preliminaryReportIssued: boolean;
  createdAt: string;
}

export interface FileDTO {
  id: number;
  name: string;
  contentType: string;
  size: number;
}
