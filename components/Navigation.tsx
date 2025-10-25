
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType, View } from '../types';

const NAV_ITEMS: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'requests', label: 'Requests', icon: '📋' },
    { id: 'new-request', label: 'New Request', icon: '➕' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'territory', label: 'Territory', icon: '🗺️' },
    { id: 'compliance', label: 'Compliance', icon: '🛡️' },
];

const Navigation: React.FC = () => {
    const { currentView, setCurrentView } = useContext(AppContext) as AppContextType;

    const handleNavChange = (view: View) => {
        setCurrentView(view);
    };

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:block bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNavChange(item.id)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                    currentView === item.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                                }`}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
            {/* Mobile Navigation */}
            <nav className="md:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2">
                    <select
                        value={currentView}
                        onChange={(e) => handleNavChange(e.target.value as View)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        {NAV_ITEMS.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.icon} {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </nav>
        </>
    );
};

export default Navigation;
