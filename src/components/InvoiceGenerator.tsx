import React, { useState, useEffect } from 'react';
import { db, Patient, ExchangeRate } from '../db/database';

const InvoiceGenerator: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [currency, setCurrency] = useState<'LRD' | 'USD'>('USD');
    const [exchangeRate, setExchangeRate] = useState(200);
    const [items, setItems] = useState<any[]>([]);
    const [newItem, setNewItem] = useState({ description: '', quantity: 1, unitPrice: 0 });
    const [discount, setDiscount] = useState({ type: 'fixed', value: 0 });
    const [notes, setNotes] = useState('');
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        loadPatients();
        loadExchangeRate();
        loadRecentInvoices();
    }, []);

    const loadPatients = async () => {
        const allPatients = await db.getAllPatients();
        setPatients(allPatients);
    };

    const loadExchangeRate = async () => {
        const latestRate = await db.exchangeRates.orderBy('effectiveDate').reverse().first();
        if (latestRate) {
            setExchangeRate(latestRate.rate);
        }
    };

    const loadRecentInvoices = async () => {
        const recent = await db.invoices.orderBy('date').reverse().limit(10).toArray();
        setInvoices(recent);
    };

    const generateInvoiceNumber = () => {
        const date = new Date();
        return `INV-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
    };

    const addItem = () => {
        if (newItem.description && newItem.unitPrice > 0) {
            setItems([...items, { ...newItem, totalPrice: newItem.quantity * newItem.unitPrice }]);
            setNewItem({ description: '', quantity: 1, unitPrice: 0 });
        }
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    const calculateDiscount = (subtotal: number) => {
        if (discount.type === 'percentage') {
            return subtotal * (discount.value / 100);
        }
        return discount.value;
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const discountAmount = calculateDiscount(subtotal);
        return subtotal - discountAmount;
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const patient = patients.find(p => p.uhid === selectedPatient);
        if (!patient || items.length === 0) {
            alert('Please select a patient and add at least one item');
            return;
        }

        const subtotal = calculateSubtotal();
        const discountAmount = calculateDiscount(subtotal);
        const total = calculateTotal();
        const invoiceNumber = generateInvoiceNumber();

        const invoiceId = await db.invoices.add({
            invoiceNumber,
            patientUhid: selectedPatient,
            patientName: patient.fullName,
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
            currency,
            exchangeRate,
            subtotal,
            discount: discount.value,
            discountType: discount.type as any,
            tax: 0,
            total,
            amountPaid: 0,
            balance: total,
            status: 'issued',
            notes,
            createdBy: 'Billing Officer',
            synced: 0
        });

        for (const item of items) {
            await db.invoiceItems.add({
                invoiceId: invoiceId as number,
                itemType: 'other',
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                synced: 0
            });
        }

        alert(`Invoice created: ${invoiceNumber}\nTotal: ${total} ${currency}`);
        
        setSelectedPatient('');
        setItems([]);
        setDiscount({ type: 'fixed', value: 0 });
        setNotes('');
        await loadRecentInvoices();
    };

    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount(subtotal);
    const total = calculateTotal();

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h3>💰 Create Invoice</h3>
                    <form onSubmit={handleCreateInvoice}>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Select Patient *</label>
                            <select required value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                <option value="">Select Patient</option>
                                {patients.map(p => <option key={p.uhid} value={p.uhid}>{p.fullName} ({p.uhid})</option>)}
                            </select>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div>
                                <label>Currency *</label>
                                <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                    <option value="USD">USD ($)</option>
                                    <option value="LRD">LRD (L$)</option>
                                </select>
                            </div>
                            <div>
                                <label>Exchange Rate</label>
                                <input type="text" value={`1 USD = ${exchangeRate} LRD`} disabled style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#f3f4f6' }} />
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label>Add Invoice Items</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
                                <input type="text" placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                <input type="number" placeholder="Qty" value={newItem.quantity} onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                <input type="number" placeholder="Price" value={newItem.unitPrice} onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                <button type="button" onClick={addItem} style={{ background: '#0f2b3d', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
                            </div>
                        </div>
                        
                        {items.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <table style={{ width: '100%', fontSize: '0.85rem' }}>
                                    <thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr></thead>
                                    <tbody>
                                        {items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.description}</td><td>{item.quantity}</td><td>{item.unitPrice}</td><td>{item.totalPrice}</td>
                                                <td><button type="button" onClick={() => removeItem(idx)} style={{ color: '#ef4444', cursor: 'pointer' }}>×</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div>
                                <label>Discount Type</label>
                                <select value={discount.type} onChange={(e) => setDiscount({...discount, type: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                    <option value="fixed">Fixed Amount</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                            </div>
                            <div>
                                <label>Discount Value</label>
                                <input type="number" step="0.01" value={discount.value} onChange={(e) => setDiscount({...discount, value: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label>Notes</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                        </div>
                        
                        <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><strong>{subtotal.toFixed(2)} {currency}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}><span>Discount:</span><strong>-{discountAmount.toFixed(2)} {currency}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #cbd5e1' }}><span>Total:</span><strong>{total.toFixed(2)} {currency}</strong></div>
                        </div>
                        
                        <button type="submit" disabled={items.length === 0} style={{ background: '#0f2b3d', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
                            Generate Invoice
                        </button>
                    </form>
                </div>
                
                <div>
                    <h3>Recent Invoices</h3>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                        {invoices.length === 0 ? <p style={{ textAlign: 'center', color: '#6b7280' }}>No invoices yet</p> : invoices.map(inv => (
                            <div key={inv.id} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{inv.invoiceNumber}</strong>
                                    <span style={{ background: inv.status === 'paid' ? '#d1fae5' : '#fef3c7', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{inv.status}</span>
                                </div>
                                <div>{inv.patientName}</div>
                                <div>Total: {inv.total} {inv.currency}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(inv.date).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceGenerator;
