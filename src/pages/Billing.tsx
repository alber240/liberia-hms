import React, { useState } from 'react';
import ExchangeRateManager from '../components/ExchangeRateManager';
import InvoiceGenerator from '../components/InvoiceGenerator';
import PaymentProcessor from '../components/PaymentProcessor';

const Billing: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'rate' | 'invoice' | 'payment'>('invoice');

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>💰 Billing & Finance</h1>
            
            <div style={{ background: 'white', borderBottom: '1px solid #cbd5e1', padding: '0 24px', display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <button onClick={() => setActiveTab('invoice')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'invoice' ? 'bold' : 'normal', borderBottom: activeTab === 'invoice' ? '3px solid #0f2b3d' : 'none' }}>💰 Create Invoice</button>
                <button onClick={() => setActiveTab('payment')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'payment' ? 'bold' : 'normal', borderBottom: activeTab === 'payment' ? '3px solid #0f2b3d' : 'none' }}>💳 Process Payment</button>
                <button onClick={() => setActiveTab('rate')} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'rate' ? 'bold' : 'normal', borderBottom: activeTab === 'rate' ? '3px solid #0f2b3d' : 'none' }}>💱 Exchange Rate</button>
            </div>
            
            {activeTab === 'rate' && <ExchangeRateManager />}
            {activeTab === 'invoice' && <InvoiceGenerator />}
            {activeTab === 'payment' && <PaymentProcessor />}
        </div>
    );
};

export default Billing;
