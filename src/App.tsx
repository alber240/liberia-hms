import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { authService } from './services/authService';
import { initializeStaff } from './scripts/initStaff';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await initializeStaff();
            setIsAuthenticated(authService.isAuthenticated());
            setLoading(false);
        };
        init();
    }, []);

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8f0fe' }}><div style={{ textAlign: 'center' }}><h1 style={{ color: '#0f2b3d' }}>🏥 LiberiaHMS</h1><p>Loading...</p></div></div>;
    }

    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return <AdminDashboard />;
}

export default App;
