import React, { useState, useEffect } from 'react';
import { db, ExchangeRate } from '../db/database';

const ExchangeRateManager: React.FC = () => {
    const [currentRate, setCurrentRate] = useState<number>(0);
    const [previousRates, setPreviousRates] = useState<ExchangeRate[]>([]);
    const [newRate, setNewRate] = useState('');
    const [notes, setNotes] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        loadCurrentRate();
        loadPreviousRates();
    }, []);

    const loadCurrentRate = async () => {
        const latestRate = await db.exchangeRates.orderBy('effectiveDate').reverse().first();
        if (latestRate) {
            setCurrentRate(latestRate.rate);
        } else {
            // Default rate if none exists (1 USD = 200 LRD)
            setCurrentRate(200);
        }
    };

    const loadPreviousRates = async () => {
        const rates = await db.exchangeRates.orderBy('effectiveDate').reverse().limit(10).toArray();
        setPreviousRates(rates);
    };

    const handleUpdateRate = async (e: React.FormEvent) => {
        e.preventDefault();
        const rate = parseFloat(newRate);
        if (isNaN(rate) || rate <= 0) {
            alert('Please enter a valid rate');
            return;
        }

        await db.exchangeRates.add({
            rate: rate,
            effectiveDate: new Date().toISOString(),
            setBy: 'Administrator',
            notes: notes || 'Manual rate update',
            synced: 0
        });

        setCurrentRate(rate);
        setNewRate('');
        setNotes('');
        setEditing(false);
        await loadPreviousRates();
        alert(`Exchange rate updated: 1 USD = ${rate} LRD`);
    };

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <h3>💱 Exchange Rate Management</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#f1f5f9', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Current Exchange Rate</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f2b3d' }}>1 USD = {currentRate} LRD</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '8px' }}>
                        Last updated: {previousRates[0] ? new Date(previousRates[0].effectiveDate).toLocaleDateString() : 'Not set'}
                    </div>
                </div>
                
                <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '12px' }}>
                    {!editing ? (
                        <>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '12px' }}>Update Exchange Rate</div>
                            <div style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
                                Current: <strong>1 USD = {currentRate} LRD</strong>
                            </div>
                            <button onClick={() => setEditing(true)} style={{ background: '#0f2b3d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                Update Rate
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleUpdateRate}>
                            <div style={{ marginBottom: '12px' }}>
                                <label>New Rate (LRD per 1 USD)</label>
                                <input type="number" step="0.01" required value={newRate} onChange={(e) => setNewRate(e.target.value)} placeholder={`Current: ${currentRate}`} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label>Notes</label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Reason for rate update..." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" style={{ background: '#10b981', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                                <button type="button" onClick={() => setEditing(false)} style={{ background: '#e2e8f0', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            
            {previousRates.length > 1 && (
                <div style={{ marginTop: '16px' }}>
                    <h4>Recent Rate History</h4>
                    <table style={{ width: '100%', fontSize: '0.85rem' }}>
                        <thead><tr><th>Date</th><th>Rate (USD to LRD)</th><th>Notes</th></tr></thead>
                        <tbody>
                            {previousRates.slice(1, 6).map(rate => (
                                <tr key={rate.id}>
                                    <td>{new Date(rate.effectiveDate).toLocaleDateString()}</td>
                                    <td>1 USD = {rate.rate} LRD</td>
                                    <td style={{ color: '#6b7280' }}>{rate.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExchangeRateManager;
