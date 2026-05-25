import React, { useState, useEffect } from 'react';
import { db } from '../db/database';

const LabResultsEntry: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [results, setResults] = useState<Record<number, string>>({});

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        const pendingOrders = await db.labOrders.where('status').equals('ordered').or('status').equals('processing').toArray();
        setOrders(pendingOrders);
    };

    const loadOrderDetails = async (orderId: number) => {
        const order = await db.labOrders.get(orderId);
        const items = await db.labOrderItems.where('orderId').equals(orderId).toArray();
        setSelectedOrder(order);
        setOrderItems(items);
        const initialResults: Record<number, string> = {};
        items.forEach((item: any) => { initialResults[item.id!] = item.result || ''; });
        setResults(initialResults);
    };

    const updateResult = (itemId: number, value: string) => { setResults(prev => ({ ...prev, [itemId]: value })); };

    const isAbnormal = (result: string, normalRange: string): boolean => {
        if (!result || !normalRange) return false;
        const range = normalRange.match(/([\d.]+)\s*-\s*([\d.]+)/);
        if (range && result) {
            const value = parseFloat(result);
            const min = parseFloat(range[1]);
            const max = parseFloat(range[2]);
            if (!isNaN(value) && (value < min || value > max)) return true;
        }
        return false;
    };

    const saveResults = async () => {
        for (const item of orderItems) {
            const result = results[item.id!];
            const abnormal = isAbnormal(result, item.normalRange);
            await db.labOrderItems.update(item.id!, { result, isAbnormal: abnormal, resultDate: new Date().toISOString(), resultEnteredBy: 'Lab Technician', status: 'completed' });
        }
        await db.labOrders.update(selectedOrder.id, { status: 'completed' });
        alert('Results saved successfully!');
        setSelectedOrder(null);
        setOrderItems([]);
        await loadOrders();
    };

    return (
        <div>
            {!selectedOrder ? (
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h3>📋 Pending Lab Orders</h3>
                    <div style={{ marginTop: '16px' }}>
                        {orders.length === 0 ? <p style={{ textAlign: 'center', color: '#6b7280' }}>No pending lab orders</p> : orders.map(order => (
                            <div key={order.id} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' }} onClick={() => loadOrderDetails(order.id!)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{order.orderNumber}</strong><span style={{ background: order.priority === 'stat' ? '#ef4444' : order.priority === 'urgent' ? '#f59e0b' : '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{order.priority}</span></div>
                                <div>{order.patientName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Ordered: {new Date(order.orderDate).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h3>Enter Results - {selectedOrder.orderNumber}</h3><button onClick={() => setSelectedOrder(null)} style={{ background: '#e2e8f0', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Back</button></div>
                    <div style={{ marginBottom: '16px' }}><p><strong>Patient:</strong> {selectedOrder.patientName}</p><p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p><p><strong>Notes:</strong> {selectedOrder.notes || 'None'}</p></div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f1f5f9' }}><tr><th style={{ padding: '12px', textAlign: 'left' }}>Test</th><th>Normal Range</th><th>Result</th><th>Unit</th><th>Status</th></tr></thead>
                        <tbody>
                            {orderItems.map((item: any) => {
                                const abnormal = isAbnormal(results[item.id!], item.normalRange);
                                return (<tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '12px' }}><strong>{item.testName}</strong></td><td style={{ padding: '12px' }}>{item.normalRange}</td><td style={{ padding: '12px' }}><input type="text" value={results[item.id!] || ''} onChange={(e) => updateResult(item.id!, e.target.value)} style={{ width: '120px', padding: '6px', borderRadius: '6px', border: `2px solid ${abnormal ? '#ef4444' : '#cbd5e1'}` }} /></td><td style={{ padding: '12px' }}>{item.unit}</td><td style={{ padding: '12px' }}>{abnormal && results[item.id!] ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ Abnormal</span> : 'Normal'}</td></tr>);
                            })}
                        </tbody>
                    </table>
                    <button onClick={saveResults} style={{ marginTop: '20px', background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save All Results</button>
                </div>
            )}
        </div>
    );
};

export default LabResultsEntry;
