import React from 'react';

export interface SubItem {
  id: string;
  label: string;
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  methodology: string;
  mentalModel: string;
  icon: React.ElementType;
  subItems: SubItem[];
  color: string;
  diagnosticQuestions: string[]; // Legacy probes
  symptoms: string[]; 
  outcomes: string[]; 
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  INPUT = 'INPUT',
  LOADING = 'LOADING', // Used for Initial Analysis & Diagnostic Report Generation
  INQUIRY = 'INQUIRY', 
  DIAGNOSTIC_REPORT = 'DIAGNOSTIC_REPORT', 
  GENERATING_PROMPT = 'GENERATING_PROMPT', // New: Specifically for Report -> Result transition
  RESULT = 'RESULT',
  CONSULTANT_SESSION = 'CONSULTANT_SESSION',
}

export interface SimulationStep {
  message: string;
  icon: string;
  delay: number;
}

export interface UserFormData {
  industry: string;
  orgMaturity: string;
  stakeholders: string;
  currentState: string; 
  futureState: string;  
}

// New: Structure for a single diagnostic step
export interface DiagnosticStep {
  question: string;
  options: string[];
  isComplete: boolean; // Signal to stop asking and generate report
}

export interface InquiryHistoryItem {
  question: string;
  answer: string;
  stepSnapshot?: DiagnosticStep; // New: Store the full step state for backtracking
}

// Helper to get full challenge for legacy support if needed
export const getFullChallenge = (data: UserFormData) => 
  `Current State: ${data.currentState}\nDesired Future: ${data.futureState}`;

export interface HistorySession {
  id: string;
  timestamp: number;
  domainId: string;
  domainTitle: string;
  subTaskLabel: string;
  formData: UserFormData;
  inquiryHistory?: InquiryHistoryItem[]; // Store the linear QA
  diagnosticReport?: string; // Store the report
  generatedContent: string;
}

export type RefineType = 'STRICTER' | 'EMPATHETIC' | 'RISK_FOCUSED' | 'TACTICAL';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}