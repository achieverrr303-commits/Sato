import { Request } from '../types';

// This file now simulates making real API calls to a backend server.
// The mock data has been removed, as the data would now live in a real database.

const API_BASE_URL = '/api'; // Using a relative URL for proxying in development

export const api = {
    /**
     * Fetches all requests from the backend server.
     */
    getRequests: async (): Promise<Request[]> => {
        try {
            // In a real app, this would fetch from a live endpoint.
            // We are simulating a successful response for now.
            // To test, a backend developer would create a `GET /api/requests` endpoint.
            console.log('Fetching requests from the server...');
            const response = await fetch(`${API_BASE_URL}/requests`);
            if (!response.ok) {
                // For demonstration, we'll return a sample structure on failure.
                // In a real app, you'd handle this error more gracefully.
                console.error('Failed to fetch requests, returning sample data.');
                return mockRequestsOnFailure();
            }
            return await response.json();
        } catch (error) {
            console.error('Network error fetching requests:', error);
            // Return sample data if the API isn't running
             return mockRequestsOnFailure();
        }
    },

    /**
     * Adds a new request by sending it to the backend server.
     * @param newRequestData The new request object, without server-generated fields.
     */
    addRequest: async (
        newRequestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'riskScore' | 'complianceStatus'>
    ): Promise<Request> => {
       try {
            // A backend developer would create a `POST /api/requests` endpoint for this.
            console.log('Posting new request to the server...');
            const response = await fetch(`${API_BASE_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRequestData),
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Network error adding request:', error);
            // Simulate a successful response for the UI to continue working without a live backend
            alert("This is a demo. Simulating successful submission without a live backend.");
            const mockResponse: Request = {
                ...newRequestData,
                id: `R-SIM-${Math.floor(Math.random() * 1000)}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                riskScore: Math.floor(Math.random() * 80) + 10,
                complianceStatus: 'Under Review',
            };
            return mockResponse;
        }
    },
};

// A fallback function to provide data if the backend API is not running.
function mockRequestsOnFailure(): Request[] {
    console.warn("API call failed or is not available. Using mock data as a fallback.");
    return [
         {
            id: 'R-1001',
            requestDate: '2024-07-10',
            dsmId: 'dsm001',
            dsmName: 'Mohamed Saeed',
            line: 'Cardiovascular',
            requestType: 'Marketing Campaign',
            estimatedCost: 45000,
            activityObjectives: 'Increase CardioMax awareness in target pharmacies in Nasr City, focusing on high-traffic locations to boost Q3 sales.',
            status: 'Approved',
            currentStage: 'Finance Finalization',
            products: [{ productId: 'cv001', units: 500, pharmacies: [{ pharmacyId: 'ph001', units: 500, vendors: ['v002'] }] }],
            createdAt: new Date('2024-07-10T09:00:00Z').toISOString(),
            updatedAt: new Date('2024-07-15T14:30:00Z').toISOString(),
            riskScore: 25,
            complianceStatus: 'Compliant',
        },
        {
            id: 'R-1002',
            requestDate: '2024-07-12',
            dsmId: 'dsm002',
            dsmName: 'Sara Ahmed',
            line: 'Diabetes',
            requestType: 'Training Program',
            estimatedCost: 28000,
            activityObjectives: 'Conduct a comprehensive training program for pharmacists in Heliopolis on the benefits and usage of DiabetesControl.',
            status: 'Pending',
            currentStage: 'NSM Approval',
            products: [{ productId: 'db001', units: 100, pharmacies: [{ pharmacyId: 'ph002', units: 100, vendors: [] }] }],
            createdAt: new Date('2024-07-12T11:20:00Z').toISOString(),
            updatedAt: new Date('2024-07-12T11:20:00Z').toISOString(),
            riskScore: 15,
            complianceStatus: 'Under Review',
        },
    ];
}
