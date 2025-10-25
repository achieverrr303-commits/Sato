
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType } from '../types';
import { USERS } from '../constants';

const LoginScreen: React.FC = () => {
    const { login } = useContext(AppContext) as AppContextType;
    const [selectedUser, setSelectedUser] = useState('');
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            setError('Please select a user.');
            return;
        }
        if (passcode !== '1234') {
            setError('Invalid passcode. Hint: try 1234');
            return;
        }
        setError('');
        const user = login(selectedUser);
        if (!user) {
            setError('User not found.');
        }
    };
    
    const nsms = USERS.filter(u => u.role === 'NSM');
    const dsms = USERS.filter(u => u.role === 'DSM');
    const admins = USERS.filter(u => u.role === 'Admin' || u.role === 'HR');


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-500 p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sato Pharma</h1>
                        <h2 className="text-xl text-blue-600 font-semibold mb-4">Corporate Ops Hub</h2>
                        <p className="text-gray-600">A Unified Digital Requests & Governance Portal</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">🤖 AI-Powered</span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">📊 Predictive Analytics</span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">📱 Mobile-First</span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                            <select
                                id="user-select"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="">Choose User</option>
                                <optgroup label="NSM - National Sales Managers">
                                    {nsms.map(u => <option key={u.userId} value={u.userId}>{u.userName} ({u.role} - {u.region})</option>)}
                                </optgroup>
                                <optgroup label="DSM - District Sales Managers">
                                    {dsms.map(u => <option key={u.userId} value={u.userId}>{u.userName} ({u.role} - {u.territory})</option>)}
                                </optgroup>
                                <optgroup label="Admin Users">
                                    {admins.map(u => <option key={u.userId} value={u.userId}>{u.userName}</option>)}
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-2">Passcode</label>
                            <input
                                type="password"
                                id="passcode"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Enter your passcode"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all transform hover:translate-y-[-2px] shadow-lg hover:shadow-xl">
                            Access Advanced Portal
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
