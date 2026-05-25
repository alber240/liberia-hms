import React, { useState } from 'react';
import LabTestCatalog from '../components/LabTestCatalog';
import LabOrder from '../components/LabOrder';
import LabResultsEntry from '../components/LabResultsEntry';

const Laboratory: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'catalog' | 'order' | 'results'>('order');

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>🔬 Laboratory Management</h1>
            
            <div style={{ background: 'white', borderBottom: '1px solid #cbd5e1', padding: '0 24px', display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <button onClick={() => setActiveTab('order')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'order' ? 'bold' : 'normal', borderBottom: activeTab === 'order' ? '3px solid #0f2b3d' : 'none' }}>🩸 Order Tests</button>
                <button onClick={() => setActiveTab('results')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'results' ? 'bold' : 'normal', borderBottom: activeTab === 'results' ? '3px solid #0f2b3d' : 'none' }}>📋 Enter Results</button>
                <button onClick={() => setActiveTab('catalog')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'catalog' ? 'bold' : 'normal', borderBottom: activeTab === 'catalog' ? '3px solid #0f2b3d' : 'none' }}>📚 Test Catalog</button>
            </div>
            
            {activeTab === 'catalog' && <LabTestCatalog />}
            {activeTab === 'order' && <LabOrder />}
            {activeTab === 'results' && <LabResultsEntry />}
        </div>
    );
};

export default Laboratory;
