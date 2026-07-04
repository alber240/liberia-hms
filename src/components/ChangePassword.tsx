import React, { useState } from 'react';
import { secureAuthService } from '../services/secureAuthService';

interface ChangePasswordProps {
    onSuccess: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onSuccess }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const user = secureAuthService.getCurrentUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Check if user exists
        if (!user) {
            setError('User not found. Please login again.');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        if (!/[A-Z]/.test(newPassword)) {
            setError('Password must contain at least one uppercase letter');
            setLoading(false);
            return;
        }

        if (!/[0-9]/.test(newPassword)) {
            setError('Password must contain at least one number');
            setLoading(false);
            return;
        }

        const result = await secureAuthService.changePassword(user.id, oldPassword, newPassword);
        
        if (result.success) {
            alert('Password changed successfully. Please login again.');
            secureAuthService.logout();
            onSuccess();
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    if (!user) {
        return (
            <div style={{ maxWidth: '500px', margin: '50px auto', background: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
                <h2>Session Expired</h2>
                <p>Please login again.</p>
                <button onClick={() => window.location.reload()} style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', background: 'white', padding: '30px', borderRadius: '12px' }}>
            <h2>Change Password</h2>
            <p>Welcome {user.name}. Please change your temporary password.</p>
            
            <form onSubmit={handleSubmit}>
                {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}
                
                <div style={{ marginBottom: '16px' }}>
                    <label>Current Password</label>
                    <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                    <label>New Password</label>
                    <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    <small>Minimum 8 characters, 1 uppercase, 1 number</small>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                    <label>Confirm New Password</label>
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                
                <button type="submit" disabled={loading} style={{ width: '100%', background: '#0f2b3d', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    {loading ? 'Changing...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
