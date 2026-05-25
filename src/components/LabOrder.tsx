import React, { useState, useEffect } from 'react';
import { db, LabTest, Patient } from '../db/database';

const LabOrder: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [tests, setTests] = useState<LabTest[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedTests, setSelectedTests] = useState<number[]>([]);
    const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
    const [notes, setNotes] = useState('');
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const allPatients = await db.getAllPatients();
        const allTests = await db.labTests.toArray();
        const allOrders = await db.labOrders.reverse().limit(20).toArray();
        setPatients(allPatients);
        setTests(allTests);
        setOrders(allOrders);
    };

    const generateOrderNumber = () => {
        const date = new Date();
        return `LAB-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const patient = patients.find(p => p.uhid === selectedPatient);
        if (!patient || selectedTests.length === 0) return;
        
        const orderNumber = generateOrderNumber();
        const orderId = await db.labOrders.add({
            orderNumber,
            patientUhid: selectedPatient,
            patientName: patient.fullName,
            doctorName: 'Current Doctor',
            orderDate: new Date().toISOString(),
            status: 'ordered',
            priority,
            notes,
            synced: 0
        });
        
        for (const testId of selectedTests) {
            const test = tests.find(t => t.id === testId);
            if (test) {
                await db.labOrderItems.add({
                    orderId: orderId as number,
                    testId: test.id!,
                    testName: test.name,
                    normalRange: test.normalRange,
                    unit: test.unit,
                    isAbnormal: false,
                    status: 'pending',
                    notes: '',
                    synced: 0
                });
            }
        }
        
        alert(`Lab order created: ${orderNumber}`);
        setSelectedPatient('');
        setSelectedTests([]);
        setPriority('routine');
        setNotes('');
        await loadData();
    };

    const toggleTest = (testId: number) => {
        setSelectedTests(prev => prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]);
    };

    const getPriorityColor = (priority: string) => {
        switch(priority) {
            case 'stat': return '#ef4444';
            case 'urgent': return '#f59e0b';
            default: return '#10b981';
        }
    };

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h3>🩸 Order Lab Test</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Select Patient *</label>
                            <select required value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                <option value="">Select Patient</option>
                                {patients.map(p => <option key={p.uhid} value={p.uhid}>{p.fullName} ({p.uhid})</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                <option value="routine">Routine</option>
                                <option value="urgent">Urgent</option>
                                <option value="stat">STAT (Immediate)</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Select Tests *</label>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px' }}>
                                {tests.map(test => (
                                    <label key={test.id} style={{ display: 'block', padding: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={selectedTests.includes(test.id!)} onChange={() => toggleTest(test.id!)} />
                                        <span style={{ marginLeft: '8px' }}><strong>{test.name}</strong> - ${test.price}</span>
                                        {test.requiresFasting && <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#f59e0b' }}>(Fasting required)</span>}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Clinical Notes</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="Any clinical information for the lab?" />
                        </div>
                        <button type="submit" disabled={selectedTests.length === 0} style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
                            Create Lab Order ({selectedTests.length} tests)
                        </button>
                    </form>
                </div>
                <div>
                    <h3>Recent Orders</h3>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                        {orders.length === 0 ? <p style={{ textAlign: 'center', color: '#6b7280' }}>No lab orders yet</p> : orders.map(order => (
                            <div key={order.id} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{order.orderNumber}</strong><span style={{ background: getPriorityColor(order.priority), color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{order.priority}</span></div>
                                <div style={{ fontSize: '0.85rem' }}>{order.patientName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Ordered: {new Date(order.orderDate).toLocaleDateString()}</div>
                                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Status: <span style={{ fontWeight: 'bold' }}>{order.status}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabOrder;
