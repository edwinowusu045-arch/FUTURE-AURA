export type Role = 'ADMIN' | 'MANAGER' | 'VIEWER';

export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string;
  planTier: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  companyId: string;
  email: string;
  name: string;
  role: Role;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dataset {
  id: string;
  companyId: string;
  filename: string;
  contentType: string;
  size: number;
  status: 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'ERROR';
  recordCount: number;
  schemaSummary: Record<string, unknown>;
  uploadedAt: string;
  processedAt?: string;
}

export interface AnalysisResult {
  id: string;
  companyId: string;
  datasetId: string;
  category: string;
  summary: string;
  insights: Record<string, unknown>;
  confidence: number;
  status: 'DRAFT' | 'COMPLETED' | 'FAILED';
  executedAt: string;
}

export interface Prediction {
  id: string;
  companyId: string;
  metric: string;
  value: number;
  horizon: string;
  source: string;
  generatedAt: string;
}

export interface Recommendation {
  id: string;
  companyId: string;
  analysisResultId?: string;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface IncomeForecast {
  id: string;
  companyId: string;
  forecastPeriod: string;
  projectedRevenue: number;
  projectedCost: number;
  projectedProfit: number;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}
