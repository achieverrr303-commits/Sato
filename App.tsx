import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import { User, Request, AppContextType, View } from './types';
import { USERS } from './constants';
import LoadingOverlay from './components/LoadingOverlay';
import { api } from './services/api';

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [allRequests, setAllRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true for initial fetch
    const [ai, setAi] = useState<GoogleGenAI | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);

    // Initialize AI SDK and fetch initial data
    useEffect(() => {
        // AI Setup
        if (process.env.API_KEY) {
            const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
            setAi(genAI);
            const chatInstance = genAI.chats.create({
                model: 'gemini-2.5-flash',
                systemInstruction: 'You are a helpful assistant for Sato Pharma, a pharmaceutical company. Be concise and professional.',
            });
            setChat(chatInstance);
        }
        
        // Initial Data Fetch
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const initialRequests = await api.getRequests();
                setAllRequests(initialRequests);
            } catch (error) {
                console.error("Failed to fetch initial requests:", error);
                // Handle error state if necessary
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const login = useCallback((userId: string): User | null => {
        const user = USERS.find(u => u.userId === userId);
        if (user) {
            setCurrentUser(user);
            return user;
        }
        return null;
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        setCurrentView('dashboard');
    }, []);

    const addRequest = useCallback(async (newRequestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'riskScore' | 'complianceStatus'>) => {
        const newRequest = await api.addRequest(newRequestData);
        setAllRequests(prev => [...prev, newRequest]);
        return newRequest; // Return the new request for confirmation
    }, []);

    const appContextValue: AppContextType = {
        currentUser,
        currentView,
        allRequests,
        isLoading,
        ai,
        chat,
        login,
        logout,
        setCurrentView,
        addRequest,
        setIsLoading,
    };

    return (
        <AppContext.Provider value={appContextValue}>
            <div className="min-h-screen">
                {isLoading && <LoadingOverlay />}
                {currentUser ? (
                    <MainScreen />
                ) : (
                    <LoginScreen />
                )}
            </div>
        </AppContext.Provider>
    );
};

export default App;
