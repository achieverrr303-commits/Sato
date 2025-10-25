import { User, Product, Pharmacy, Vendor, ProductLine, RequestType, WorkflowStage } from './types';

export const USERS: User[] = [
    { userId: 'nsm001', userName: 'Ahmed Hassan', role: 'NSM', region: 'Cairo', parentId: null },
    { userId: 'nsm002', userName: 'Fatma Ali', role: 'NSM', region: 'Alexandria', parentId: null },
    { userId: 'dsm001', userName: 'Mohamed Saeed', role: 'DSM', region: 'Cairo', territory: 'Nasr City', parentId: 'nsm001' },
    { userId: 'dsm002', userName: 'Sara Ahmed', role: 'DSM', region: 'Cairo', territory: 'Heliopolis', parentId: 'nsm001' },
    { userId: 'dsm003', userName: 'Omar Khaled', role: 'DSM', region: 'Alexandria', territory: 'Smouha', parentId: 'nsm002' },
    { userId: 'dsm004', userName: 'Nour Hassan', role: 'DSM', region: 'Alexandria', territory: 'Stanley', parentId: 'nsm002' },
    { userId: 'admin', userName: 'System Admin', role: 'Admin' },
    { userId: 'hr001', userName: 'HR Manager', role: 'HR' },
];

export const PRODUCTS: Product[] = [
    { productId: 'cv001', productName: 'CardioMax 10mg', line: 'Cardiovascular' },
    { productId: 'cv002', productName: 'HeartGuard 5mg', line: 'Cardiovascular' },
    { productId: 'db001', productName: 'DiabetesControl 500mg', line: 'Diabetes' },
    { productId: 'db002', productName: 'GlucoSafe 1000mg', line: 'Diabetes' },
    { productId: 'on001', productName: 'OncoShield 25mg', line: 'Oncology' },
    { productId: 'rs001', productName: 'BreathEasy 200mcg', line: 'Respiratory' },
    { productId: 'nr001', productName: 'NeuroProtect 10mg', line: 'Neurology' },
];

export const PHARMACIES: Pharmacy[] = [
    { pharmacyId: 'ph001', pharmacyName: 'Al-Shifa Pharmacy' },
    { pharmacyId: 'ph002', pharmacyName: 'Nour Pharmacy' },
    { pharmacyId: 'ph003', pharmacyName: 'Seif Pharmacy' },
    { pharmacyId: 'ph004', pharmacyName: 'Misr Pharmacy' },
    { pharmacyId: 'ph005', pharmacyName: 'El-Ezaby Pharmacy' },
];

export const VENDORS: Vendor[] = [
    { vendorId: 'v001', vendorName: 'MedSupply Egypt' },
    { vendorId: 'v002', vendorName: 'PharmaLogistics' },
    { vendorId: 'v003', vendorName: 'HealthTech Solutions' },
    { vendorId: 'v004', vendorName: 'BioMed Services' },
];

export const PRODUCT_LINES: ProductLine[] = ['Cardiovascular', 'Diabetes', 'Oncology', 'Respiratory', 'Neurology'];
export const REQUEST_TYPES: RequestType[] = ['Marketing Campaign', 'Training Program', 'Equipment Purchase', 'Event Sponsorship', 'Research Initiative'];
export const WORKFLOW_STAGES: WorkflowStage[] = ['DSM Entry', 'NSM Approval', 'SFE Validation', 'Marketing Review', 'CEO Approval', 'Finance Finalization'];
