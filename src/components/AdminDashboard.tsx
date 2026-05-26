import React, { useState } from 'react';
import { authService } from '../services/authService';
import StaffManagement from './StaffManagement';
import PayrollManagement from './PayrollManagement';
import Dashboard from '../pages/Dashboard';
import PatientRegistration from '../pages/PatientRegistration';
import Appointments from '../pages/Appointments';
import Pharmacy from '../pages/Pharmacy';
import Laboratory from '../pages/Laboratory';
import Billing from '../pages/Billing';
import LanguageSwitcher from './LanguageSwitcher';
import OfflineIndicator from './OfflineIndicator';
import SyncButton from './SyncButton';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const user = authService.getCurrentUser();
    const userRole = user?.role || '';

    const rolePermissions: Record<string, string[]> = {
        admin: ['dashboard', 'staff', 'payroll', 'patients', 'appointments', 'pharmacy', 'laboratory', 'billing'],
        doctor: ['dashboard', 'patients', 'appointments', 'pharmacy', 'laboratory'],
        nurse: ['dashboard', 'patients', 'appointments'],
        pharmacist: ['dashboard', 'pharmacy'],
        lab_tech: ['dashboard', 'laboratory'],
        cashier: ['dashboard', 'billing'],
        accountant: ['dashboard', 'billing', 'payroll'],
        hr: ['dashboard', 'staff', 'payroll'],
        receptionist: ['dashboard', 'patients', 'appointments']
    };

    const allowedTabs = rolePermissions[userRole] || ['dashboard'];

    const handleLogout = () => {
        authService.logout();
        window.location.reload();
    };

    return (
        <div style={{ minHeight: '100vh', background: '#e8f0fe' }}>
            <div style={{ background: '#0f2b3d', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem' }}>🏥 LiberiaHMS</h1>
                    <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Welcome, {user?.name} ({userRole})</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <SyncButton />
                    <OfflineIndicator />
                    <LanguageSwitcher />
                    <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ background: 'white', borderBottom: '1px solid #cbd5e1', padding: '0 24px', display: 'flex', gap: '24px', overflowX: 'auto' }}>
                {allowedTabs.includes('dashboard') && (
                    <button onClick={() => setActiveTab('dashboard')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal', borderBottom: activeTab === 'dashboard' ? '3px solid #0f2b3d' : 'none' }}>
                        📊 Dashboard
                    </button>
                )}
                {allowedTabs.includes('staff') && (
                    <button onClick={() => setActiveTab('staff')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'staff' ? 'bold' : 'normal', borderBottom: activeTab === 'staff' ? '3px solid #0f2b3d' : 'none' }}>
                        👥 Staff
                    </button>
                )}
                {allowedTabs.includes('payroll') && (
                    <button onClick={() => setActiveTab('payroll')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'payroll' ? 'bold' : 'normal', borderBottom: activeTab === 'payroll' ? '3px solid #0f2b3d' : 'none' }}>
                        💰 Payroll
                    </button>
                )}
                {allowedTabs.includes('patients') && (
                    <button onClick={() => setActiveTab('patients')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'patients' ? 'bold' : 'normal', borderBottom: activeTab === 'patients' ? '3px solid #0f2b3d' : 'none' }}>
                        📝 Patients
                    </button>
                )}
                {allowedTabs.includes('appointments') && (
                    <button onClick={() => setActiveTab('appointments')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'appointments' ? 'bold' : 'normal', borderBottom: activeTab === 'appointments' ? '3px solid #0f2b3d' : 'none' }}>
                        📅 Appointments
                    </button>
                )}
                {allowedTabs.includes('pharmacy') && (
                    <button onClick={() => setActiveTab('pharmacy')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'pharmacy' ? 'bold' : 'normal', borderBottom: activeTab === 'pharmacy' ? '3px solid #0f2b3d' : 'none' }}>
                        💊 Pharmacy
                    </button>
                )}
                {allowedTabs.includes('laboratory') && (
                    <button onClick={() => setActiveTab('laboratory')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'laboratory' ? 'bold' : 'normal', borderBottom: activeTab === 'laboratory' ? '3px solid #0f2b3d' : 'none' }}>
                        🔬 Laboratory
                    </button>
                )}
                {allowedTabs.includes('billing') && (
                    <button onClick={() => setActiveTab('billing')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'billing' ? 'bold' : 'normal', borderBottom: activeTab === 'billing' ? '3px solid #0f2b3d' : 'none' }}>
                        💰 Billing
                    </button>
                )}
            </div>

            <div style={{ padding: '24px' }}>
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'staff' && <StaffManagement />}
                {activeTab === 'payroll' && <PayrollManagement />}
                {activeTab === 'patients' && <PatientRegistration />}
                {activeTab === 'appointments' && <Appointments />}
                {activeTab === 'pharmacy' && <Pharmacy />}
                {activeTab === 'laboratory' && <Laboratory />}
                {activeTab === 'billing' && <Billing />}
            </div>
        </div>
    );
};

export default AdminDashboard;
