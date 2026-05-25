import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, Drug } from '../db/database';

const PharmacyDashboard: React.FC = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalDrugs: 0,
        totalValue: 0,
        lowStockCount: 0,
        expiringCount: 0,
        expiredCount: 0
    });
    const [lowStockDrugs, setLowStockDrugs] = useState<Drug[]>([]);
    const [expiringDrugs, setExpiringDrugs] = useState<Drug[]>([]);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        const drugs = await db.getAllDrugs();
        const lowStock = await db.getLowStockDrugs();
        const expiring = await db.getExpiringDrugs(30);
        const expired = await db.getExpiredDrugs();
        
        const totalValue = drugs.reduce((sum, drug) => sum + (drug.quantityInStock * drug.unitPrice), 0);
        
        setStats({
            totalDrugs: drugs.length,
            totalValue: totalValue,
            lowStockCount: lowStock.length,
            expiringCount: expiring.length,
            expiredCount: expired.length
        });
        
        setLowStockDrugs(lowStock);
        setExpiringDrugs(expiring);
    };

    return (
        <div>
            <h3 style={{ marginBottom: '20px' }}>📊 Pharmacy Dashboard</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>💊</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalDrugs}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total Drugs</div>
                </div>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>💰</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${stats.totalValue.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Inventory Value</div>
                </div>
                <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>⚠️</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.lowStockCount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#92400e' }}>Low Stock Items</div>
                </div>
                <div style={{ background: '#fed7aa', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>📅</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.expiringCount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#92400e' }}>Expiring Soon</div>
                </div>
                <div style={{ background: '#fee2e2', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>❌</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.expiredCount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>Expired</div>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {lowStockDrugs.length > 0 && (
                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                        <h4 style={{ color: '#f59e0b', marginBottom: '12px' }}>⚠️ Low Stock Alert</h4>
                        {lowStockDrugs.slice(0, 5).map(drug => (
                            <div key={drug.id} style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                                <strong>{drug.name}</strong> - {drug.quantityInStock} {drug.unit} left
                                <span style={{ float: 'right', fontSize: '0.8rem', color: '#6b7280' }}>Reorder at: {drug.reorderLevel}</span>
                            </div>
                        ))}
                    </div>
                )}
                
                {expiringDrugs.length > 0 && (
                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                        <h4 style={{ color: '#f59e0b', marginBottom: '12px' }}>📅 Expiring Soon (30 days)</h4>
                        {expiringDrugs.slice(0, 5).map(drug => (
                            <div key={drug.id} style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                                <strong>{drug.name}</strong> - Expires: {drug.expiryDate}
                                <span style={{ float: 'right', fontSize: '0.8rem', color: '#6b7280' }}>{drug.quantityInStock} {drug.unit}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PharmacyDashboard;
