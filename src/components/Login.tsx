import React, { useState } from 'react';
import { authService } from '../services/authService';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await authService.login(username, password);
        
        if (result.success) {
            onLoginSuccess();
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#e8f0fe'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem', color: '#0f2b3d' }}>🏥 LiberiaHMS</h1>
                    <p style={{ color: '#6b7280' }}>Hospital Management System</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '16px'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '1rem'
                            }}
                            placeholder="Enter your username"
                        />
                    </div>
                    
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '1rem'
                            }}
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: '#0f2b3d',
                            color: 'white',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>
                    <p>Demo Credentials:</p>
                    <p>Admin: admin / admin123</p>
                    <p>Doctor: doctor / doctor123</p>
                    <p>Nurse: nurse / nurse123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
