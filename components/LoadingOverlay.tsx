
import React from 'react';

const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-2xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-700 font-medium">Processing with AI...</span>
            </div>
        </div>
    );
};

export default LoadingOverlay;
