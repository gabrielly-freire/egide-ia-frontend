export interface CaseFileDTO {
  id: number;
  name: string;
  contentType: string;
  size: number;
}

export type PreliminaryReportDecision = 'ACATAR' | 'NEGAR' | 'NEGAR_FALTA_PROVAS';

export type PenaltyType = 'ADVERTENCIA' | 'SUSPENSAO' | 'DEMISSAO' | 'OUTRA';

export interface DenouncedPreliminaryReportDTO {
  decision: PreliminaryReportDecision;
  justification?: string | null;
  penaltyType?: PenaltyType | null;
  penaltyDescription?: string | null;
  submittedAt?: string | null;
}

export interface DenouncedCaseDTO {
  reportId: number;
  protocolNumber: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  preliminaryReport?: DenouncedPreliminaryReportDTO | null;
  evidenceFiles: CaseFileDTO[];
}

export interface DefenseRequestDTO {
  defenseText: string;
}

export interface DefenseDTO {
  reportId: number;
  defenseText: string;
  submittedAt: string;
  submittedByUserId: number;
  files: CaseFileDTO[];
}
