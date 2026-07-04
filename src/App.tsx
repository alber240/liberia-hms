import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import AdminDashboard from './components/AdminDashboard';
import { secureAuthService } from './services/secureAuthService';
import { initializeStaff } from './scripts/initStaff';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mustChangePassword, setMustChangePassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            await initializeStaff();
            
            // Check if user is already logged in
            const user = secureAuthService.getCurrentUser();
            if (user) {
                setIsAuthenticated(true);
                setUserData(user);
                // Check if user needs to change password
                const staff = await secureAuthService.getStaffById(user.id);
                setMustChangePassword(staff?.mustChangePassword || false);
            }
            setLoading(false);
        };
        init();
    }, []);

    const handleLoginSuccess = async (user: any, mustChange: boolean) => {
        setUserData(user);
        setIsAuthenticated(true);
        setMustChangePassword(mustChange);
    };

    const handlePasswordChanged = async () => {
        // After password change, get fresh user data
        const user = secureAuthService.getCurrentUser();
        if (user) {
            const staff = await secureAuthService.getStaffById(user.id);
            setUserData(staff);
            setMustChangePassword(false);
            setIsAuthenticated(true);
        }
    };

    const handleLogout = () => {
        secureAuthService.logout();
        setIsAuthenticated(false);
        setUserData(null);
        setMustChangePassword(false);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8f0fe' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: '#0f2b3d' }}>🏥 LiberiaHMS</h1>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    if (mustChangePassword) {
        return <ChangePassword onSuccess={handlePasswordChanged} />;
    }

    return <AdminDashboard onLogout={handleLogout} />;
}

export default App;
