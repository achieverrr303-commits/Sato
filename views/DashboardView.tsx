import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { AppContextType, Request } from '../types';

interface KpiCardProps {
    title: string;
    value: string;
    trend?: string;
    target?: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'purple';
    progress: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, target, icon, color, progress }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400', progress: 'bg-blue-600' },
        green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400', progress: 'bg-green-600' },
        yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-600 dark:text-yellow-400', progress: 'bg-yellow-600' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-400', progress: 'bg-purple-600' },
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 dark:border-blue-400 transition hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {trend && <p className="text-sm text-green-600 dark:text-green-400">{trend}</p>}
                    {target && <p className="text-sm text-gray-500 dark:text-gray-300">{target}</p>}
                </div>
                <div className={`p-3 rounded-full ${colorClasses[color].bg} ${colorClasses[color].text}`}>
                    {icon}
                </div>
            </div>
            <div className="mt-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`${colorClasses[color].progress} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const InsightSkeleton = () => (
    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
    </div>
);


const DashboardView: React.FC = () => {
    const { allRequests } = useContext(AppContext) as AppContextType;
    const [loadingInsights, setLoadingInsights] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoadingInsights(false), 1500); // Simulate loading AI insights
        return () => clearTimeout(timer);
    }, []);


    const totalRequests = allRequests.length;
    const approved = allRequests.filter(r => r.status === 'Approved').length;
    const approvalRate = totalRequests > 0 ? Math.round((approved / totalRequests) * 100) : 0;
    const avgProcessingTime = '3.2d';
    const riskScore = totalRequests > 0 ? Math.round(allRequests.reduce((sum, r) => sum + r.riskScore, 0) / totalRequests) : 20;

    const recentRequests = [...allRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
    
    return (
        <div className="space-y-8">
             {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Requests" value={totalRequests.toString()} trend="↗️ +12% vs last month" icon={<FileTextIcon />} color="blue" progress={Math.min(totalRequests, 100)} />
                <KpiCard title="Approval Rate" value={`${approvalRate}%`} target="🎯 Target: 85%" icon={<CheckCircleIcon />} color="green" progress={approvalRate} />
                <KpiCard title="Avg Processing Time" value={avgProcessingTime} target="⚠️ SLA: 5 days" icon={<ClockIcon />} color="yellow" progress={(3.2 / 5) * 100} />
                <KpiCard title="Avg. Risk Score" value={riskScore.toString()} target={riskScore < 30 ? 'Low Risk' : 'Medium Risk'} icon={<ShieldIcon />} color="purple" progress={riskScore} />
            </div>

            {/* AI Insights & Recent Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🤖 AI-Powered Insights & Recommendations</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loadingInsights ? (
                            <>
                                <InsightSkeleton />
                                <InsightSkeleton />
                                <InsightSkeleton />
                            </>
                        ) : (
                            <>
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                                 <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Smart Recommendations</h4>
                                 <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                  <li>• Focus on Cardiovascular line in Alexandria region</li>
                                  <li>• Increase budget allocation for Q4 campaigns</li>
                                 </ul>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                                 <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">📊 Pattern Detection</h4>
                                 <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                                  <li>• 23% increase in diabetes-related requests</li>
                                  <li>• Peak submission time: Tuesday 10-11 AM</li>
                                 </ul>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                                 <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">⚠️ Risk Alerts</h4>
                                 <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                                  <li>• Budget overrun risk in Oncology line</li>
                                  <li>• 3 requests pending >7 days</li>
                                 </ul>
                                </div>
                            </>
                        )}
                       </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Recent Requests</h3>
                    <div className="space-y-4">
                        {recentRequests.length > 0 ? recentRequests.map(r => <RecentRequestItem key={r.id} request={r} />) : <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent requests.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RecentRequestItem: React.FC<{request: Request}> = ({ request }) => {
    const statusClasses = {
        'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    };
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">{request.id}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{request.dsmName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{request.requestType}</p>
                </div>
                <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusClasses[request.status]}`}>{request.status}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}

const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;

export default DashboardView;