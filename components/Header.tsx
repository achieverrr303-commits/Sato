
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType } from '../types';

interface HeaderProps {
    toggleTheme: () => void;
    currentTheme: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, currentTheme }) => {
    const { currentUser, logout } = useContext(AppContext) as AppContextType;

    return (
        <header className="bg-gradient-to-r from-blue-800 to-blue-500 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Sato Pharma Corporate Ops Hub</h1>
                        <p className="text-blue-100 mt-1">Welcome, <span className="font-semibold">{currentUser?.userName} ({currentUser?.role})</span></p>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="relative">
                            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition">
                                <BellIcon />
                                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </button>
                        </div>
                        <button onClick={toggleTheme} className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition">
                            {currentTheme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                        {currentUser?.role === 'Admin' && (
                            <div className="hidden md:block">
                                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition">Advanced Tools</button>
                            </div>
                        )}
                        <button onClick={logout} className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg text-sm font-medium transition">
                            <span className="hidden md:inline">Logout</span>
                            <LogoutIcon className="md:hidden"/>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};


const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


export default Header;
