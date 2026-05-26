import React, { useState, useEffect } from 'react';
import { db, Invoice, Payment, ExchangeRate } from '../db/database';

const PaymentProcessor: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile_money' | 'bank_transfer' | 'check' | 'insurance'>('cash');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [exchangeRate, setExchangeRate] = useState(200);

    useEffect(() => {
        loadInvoices();
        loadExchangeRate();
    }, []);

    const loadInvoices = async () => {
        const unpaidInvoices = await db.invoices.where('status').equals('issued').or('status').equals('partial').toArray();
        setInvoices(unpaidInvoices);
    };

    const loadExchangeRate = async () => {
        const latestRate = await db.exchangeRates.orderBy('effectiveDate').reverse().first();
        if (latestRate) {
            setExchangeRate(latestRate.rate);
        }
    };

    const generatePaymentNumber = () => {
        const date = new Date();
        return `PAY-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
    };

    const processPayment = async () => {
        if (!selectedInvoice) return;
        
        const paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const paymentNumber = generatePaymentNumber();
        const newPaidAmount = selectedInvoice.amountPaid + paymentAmount;
        const newBalance = selectedInvoice.total - newPaidAmount;
        const newStatus = newBalance <= 0 ? 'paid' : 'partial';

        await db.payments.add({
            invoiceId: selectedInvoice.id!,
            paymentNumber,
            patientUhid: selectedInvoice.patientUhid,
            patientName: selectedInvoice.patientName,
            amount: paymentAmount,
            currency: selectedInvoice.currency,
            exchangeRate,
            paymentMethod,
            referenceNumber: referenceNumber || undefined,
            paymentDate: new Date().toISOString(),
            receivedBy: 'Cashier',
            notes,
            synced: 0
        });

        await db.invoices.update(selectedInvoice.id!, {
            amountPaid: newPaidAmount,
            balance: newBalance,
            status: newStatus,
            synced: 0
        });

        alert(`Payment of ${paymentAmount} ${selectedInvoice.currency} recorded successfully!`);
        
        setSelectedInvoice(null);
        setAmount('');
        setReferenceNumber('');
        setNotes('');
        await loadInvoices();
    };

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h3>💰 Process Payment</h3>
                    <div style={{ marginBottom: '16px' }}>
                        <label>Select Invoice</label>
                        <select onChange={(e) => {
                            const inv = invoices.find(i => i.id === parseInt(e.target.value));
                            setSelectedInvoice(inv || null);
                        }} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <option value="">Select Invoice</option>
                            {invoices.map(inv => (
                                <option key={inv.id} value={inv.id}>{inv.invoiceNumber} - {inv.patientName} - Balance: {inv.balance} {inv.currency}</option>
                            ))}
                        </select>
                    </div>
                    
                    {selectedInvoice && (
                        <>
                            <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                <div><strong>Invoice:</strong> {selectedInvoice.invoiceNumber}</div>
                                <div><strong>Patient:</strong> {selectedInvoice.patientName}</div>
                                <div><strong>Total:</strong> {selectedInvoice.total} {selectedInvoice.currency}</div>
                                <div><strong>Paid:</strong> {selectedInvoice.amountPaid} {selectedInvoice.currency}</div>
                                <div><strong>Balance Due:</strong> {selectedInvoice.balance} {selectedInvoice.currency}</div>
                            </div>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <label>Payment Amount *</label>
                                <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Max: ${selectedInvoice.balance}`} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                            </div>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <label>Payment Method</label>
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                    <option value="cash">Cash</option>
                                    <option value="mobile_money">Mobile Money</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="check">Check</option>
                                    <option value="insurance">Insurance</option>
                                </select>
                            </div>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <label>Reference Number (Optional)</label>
                                <input type="text" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="Transaction ID / Check number" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                            </div>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <label>Notes</label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                            </div>
                            
                            <button onClick={processPayment} style={{ background: '#10b981', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
                                Process Payment
                            </button>
                        </>
                    )}
                </div>
                
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h3>💡 Payment Information</h3>
                    <div style={{ marginTop: '16px' }}>
                        <p><strong>Exchange Rate:</strong> 1 USD = {exchangeRate} LRD</p>
                        <p><strong>Accepted Currencies:</strong> USD ($) and LRD (L$)</p>
                        <p><strong>Payment Methods:</strong></p>
                        <ul style={{ marginTop: '8px' }}>
                            <li>💵 Cash (USD/LRD)</li>
                            <li>📱 Mobile Money (MTN Money, Orange Money)</li>
                            <li>🏦 Bank Transfer</li>
                            <li>📝 Check</li>
                            <li>🏥 Insurance</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentProcessor;
