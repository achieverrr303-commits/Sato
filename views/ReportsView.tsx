
import React from 'react';

const ReportsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📄 Advanced Reporting Suite</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Custom reports with AI insights and automated scheduling</p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 min-h-[400px] flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Report generation options will be available here.</p>
            </div>
        </div>
    );
};

export default ReportsView;
