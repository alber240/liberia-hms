import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PharmacyDashboard from '../components/PharmacyDashboard';
import DrugInventory from '../components/DrugInventory';
import DispensingModule from '../components/DispensingModule';

const Pharmacy: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'dispensing'>('dashboard');

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>💊 Pharmacy Management</h1>
            
            <div style={{ background: 'white', borderBottom: '1px solid #cbd5e1', padding: '0 24px', display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <button
                    onClick={() => setActiveTab('dashboard')}
                    style={{
                        padding: '14px 0',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
                        borderBottom: activeTab === 'dashboard' ? '3px solid #0f2b3d' : 'none'
                    }}
                >
                    📊 Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    style={{
                        padding: '14px 0',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'inventory' ? 'bold' : 'normal',
                        borderBottom: activeTab === 'inventory' ? '3px solid #0f2b3d' : 'none'
                    }}
                >
                    📦 Drug Inventory
                </button>
                <button
                    onClick={() => setActiveTab('dispensing')}
                    style={{
                        padding: '14px 0',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'dispensing' ? 'bold' : 'normal',
                        borderBottom: activeTab === 'dispensing' ? '3px solid #0f2b3d' : 'none'
                    }}
                >
                    💊 Dispense Medication
                </button>
            </div>
            
            <div>
                {activeTab === 'dashboard' && <PharmacyDashboard />}
                {activeTab === 'inventory' && <DrugInventory />}
                {activeTab === 'dispensing' && <DispensingModule />}
            </div>
        </div>
    );
};

export default Pharmacy;
