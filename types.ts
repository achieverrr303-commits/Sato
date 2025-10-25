import type { GoogleGenAI, Chat } from '@google/genai';

export interface User {
  userId: string;
  userName: string;
  role: 'NSM' | 'DSM' | 'Admin' | 'HR';
  region?: string;
  territory?: string;
  parentId?: string | null;
}

export type ProductLine = 'Cardiovascular' | 'Diabetes' | 'Oncology' | 'Respiratory' | 'Neurology';
export type RequestType = 'Marketing Campaign' | 'Training Program' | 'Equipment Purchase' | 'Event Sponsorship' | 'Research Initiative';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';
export type WorkflowStage = 'DSM Entry' | 'NSM Approval' | 'SFE Validation' | 'Marketing Review' | 'CEO Approval' | 'Finance Finalization';

export interface Product {
    productId: string;
    productName: string;
    line: ProductLine;
}

export interface Pharmacy {
    pharmacyId: string;
    pharmacyName: string;
}

export interface Vendor {
    vendorId: string;
    vendorName: string;
}

export interface RequestProduct {
    productId: string;
    units: number;
    pharmacies: {
        pharmacyId: string;
        units: number;
        vendors: string[];
    }[];
}

export interface Request {
  id: string;
  requestDate: string;
  dsmId: string;
  dsmName: string;
  line: ProductLine;
  requestType: RequestType;
  estimatedCost: number;
  activityObjectives: string;
  status: RequestStatus;
  currentStage: WorkflowStage;
  products: RequestProduct[];
  createdAt: string;
  updatedAt: string;
  riskScore: number;
  complianceStatus: 'Compliant' | 'Under Review' | 'Requires Review';
}

export type View = 'dashboard' | 'requests' | 'new-request' | 'analytics' | 'reports' | 'territory' | 'compliance';

export interface AppContextType {
  currentUser: User | null;
  currentView: View;
  allRequests: Request[];
  isLoading: boolean;
  ai: GoogleGenAI | null;
  chat: Chat | null;
  login: (userId: string) => User | null;
  logout: () => void;
  setCurrentView: (view: View) => void;
  addRequest: (newRequest: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'riskScore' | 'complianceStatus'>) => Promise<Request>;
  setIsLoading: (loading: boolean) => void;
}
