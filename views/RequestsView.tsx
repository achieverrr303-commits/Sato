import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../App';
import { AppContextType, Request, RequestStatus } from '../types';
import { Type } from '@google/genai';

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const RequestsView: React.FC = () => {
    const { allRequests, ai } = useContext(AppContext) as AppContextType;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('');
    const [riskFilter, setRiskFilter] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);
    const [displayedRequests, setDisplayedRequests] = useState<Request[]>(allRequests);

    const applyFilters = useCallback(() => {
        const filtered = allRequests
            .filter(r => statusFilter === '' || r.status === statusFilter)
            .filter(r => {
                if (riskFilter === '') return true;
                const riskLevel = r.riskScore < 30 ? 'low' : r.riskScore < 60 ? 'medium' : 'high';
                return riskLevel === riskFilter;
            });
        setDisplayedRequests(filtered);
    }, [allRequests, statusFilter, riskFilter]);

    useEffect(() => {
        // Apply basic dropdown filters immediately
        applyFilters();
    }, [allRequests, statusFilter, riskFilter, applyFilters]);

    const handleAiSearch = async () => {
        if (!searchTerm.trim()) {
            applyFilters(); // Reset to just dropdown filters if search is empty
            return;
        }
        if (!ai) {
            alert("AI service is not available.");
            return;
        }

        setIsFiltering(true);
        try {
            const prompt = `
                You are a data analysis expert for Sato Pharma.
                Analyze the following JSON data which contains a list of operational requests.
                Based on the user's query, return a JSON object containing only the "id" fields of the requests that match the query.
                User Query: "${searchTerm}"
                
                JSON Data:
                ${JSON.stringify(allRequests)}
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            requestIds: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING
                                }
                            }
                        }
                    }
                }
            });

            const resultJson = JSON.parse(response.text);
            const matchingIds = new Set(resultJson.requestIds || []);
            const filtered = allRequests.filter(r => matchingIds.has(r.id));
            setDisplayedRequests(filtered);

        } catch (error) {
            console.error("AI Smart Search Error:", error);
            alert("Sorry, the AI search failed. Please try a different query or use the filters.");
            // Reset to basic filters on error
            applyFilters();
        } finally {
            setIsFiltering(false);
        }
    };


    const RiskIndicator: React.FC<{ score: number }> = ({ score }) => {
        const riskLevel = score < 30 ? 'low' : score < 60 ? 'medium' : 'high';
        const riskColor = score < 30 ? 'bg-green-500' : score < 60 ? 'bg-yellow-500' : 'bg-red-500';
        return (
            <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${riskColor}`}></span>
                <span className="capitalize">{riskLevel}</span>
            </div>
        )
    };
    
    const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
        const classes = {
            'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📋 Advanced Request Management</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered request processing with smart insights</p>
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as RequestStatus | '')} className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="">All Risk Levels</option>
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                    </select>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAiSearch()}
                    placeholder="Ask AI to find requests... (e.g., approved marketing campaigns > 40k)" 
                    className="flex-grow border border-gray-300 rounded-lg px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button 
                    onClick={handleAiSearch}
                    disabled={isFiltering}
                    className="inline-flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:bg-blue-400 disabled:cursor-wait"
                >
                    {isFiltering ? <SpinnerIcon/> : '🤖'}
                    <span className="ml-2">AI Search</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {['Request ID', 'DSM', 'Type', 'Line', 'Cost (EGP)', 'Risk', 'Status', 'Stage', 'Actions'].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {isFiltering ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                            <span>🤖 Asking AI to find your requests...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : displayedRequests.length > 0 ? displayedRequests.map(r => (
                                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{r.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{r.dsmName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{r.requestType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{r.line}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{r.estimatedCost.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"><RiskIndicator score={r.riskScore} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{r.currentStage}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No requests match your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RequestsView;
