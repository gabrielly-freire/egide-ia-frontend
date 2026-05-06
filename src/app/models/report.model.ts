export interface ReportDTO {
  id?: number;
  protocolNumber?: string;
  title: string;
  description: string;
  status?: string;
  createdAt?: string;
  hasSurvey?: boolean;
}

export interface ReportResponseSuggestionResponseDTO {
  reportId: number;
  suggestedResponse: string;
}

export interface ReportRespondRequestDTO {
  responseText?: string;
  aiSuggestion?: string;
}

export interface ReportRespondResponseDTO {
  reportId: number;
  responseText: string;
  aiSuggestion: string | null;
  usedAiSuggestion: boolean;
  status: string;
  respondedAt: string;
}
