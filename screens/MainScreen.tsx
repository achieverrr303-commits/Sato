
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { AppContextType } from '../types';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import DashboardView from '../views/DashboardView';
import RequestsView from '../views/RequestsView';
import NewRequestView from '../views/NewRequestView';
import AnalyticsView from '../views/AnalyticsView';
import ReportsView from '../views/ReportsView';
import TerritoryView from '../views/TerritoryView';
import ComplianceView from '../views/ComplianceView';
import Chatbot from '../components/Chatbot';

const MainScreen: React.FC = () => {
    const { currentView } = useContext(AppContext) as AppContextType;
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardView />;
            case 'requests': return <RequestsView />;
            case 'new-request': return <NewRequestView />;
            case 'analytics': return <AnalyticsView />;
            case 'reports': return <ReportsView />;
            case 'territory': return <TerritoryView />;
            case 'compliance': return <ComplianceView />;
            default: return <DashboardView />;
        }
    };
    
    return (
        <div className={theme === 'dark' ? 'theme-dark' : ''}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                <Header toggleTheme={toggleTheme} currentTheme={theme}/>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 py-8">
                    {renderView()}
                </main>
                <Chatbot />
            </div>
        </div>
    );
};

export default MainScreen;
