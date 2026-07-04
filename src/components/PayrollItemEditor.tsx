import React, { useState, useEffect } from 'react';
import { db, Staff, Payroll, PayrollItem } from '../db/database';

interface PayrollItemEditorProps {
    payrollId: number;
    staffId: number;
    staffName: string;
    onUpdate: () => void;
}

const PayrollItemEditor: React.FC<PayrollItemEditorProps> = ({ payrollId, staffId, staffName, onUpdate }) => {
    const [items, setItems] = useState<PayrollItem[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({
        type: 'allowance' as 'allowance' | 'deduction' | 'tax' | 'bonus' | 'overtime' | 'other',
        description: '',
        amount: 0
    });

    useEffect(() => {
        loadItems();
    }, [payrollId]);

    const loadItems = async () => {
        const payrollItems = await db.payrollItems.where('payrollId').equals(payrollId).toArray();
        setItems(payrollItems);
    };

    const addItem = async () => {
        if (newItem.amount === 0 || !newItem.description) {
            alert('Please enter description and amount');
            return;
        }

        await db.payrollItems.add({
            payrollId,
            staffId,
            type: newItem.type,
            description: newItem.description,
            amount: newItem.amount,
            currency: 'USD',
            synced: 0
        });

        await updatePayrollTotals();

        setNewItem({ type: 'allowance', description: '', amount: 0 });
        setShowAddForm(false);
        await loadItems();
        onUpdate();
    };

    const deleteItem = async (id: number) => {
        if (window.confirm('Delete this item?')) {
            await db.payrollItems.delete(id);
            await updatePayrollTotals();
            await loadItems();
            onUpdate();
        }
    };

    const updatePayrollTotals = async () => {
        const allItems = await db.payrollItems.where('payrollId').equals(payrollId).toArray();
        
        let totalAllowances = 0;
        let totalDeductions = 0;
        let totalTax = 0;
        let totalBonuses = 0;

        for (const item of allItems) {
            switch(item.type) {
                case 'allowance': totalAllowances += item.amount; break;
                case 'bonus': totalBonuses += item.amount; break;
                case 'deduction': totalDeductions += item.amount; break;
                case 'tax': totalTax += item.amount; break;
                case 'overtime': totalAllowances += item.amount; break;
                default: break;
            }
        }

        const payroll = await db.payroll.get(payrollId);
        if (payroll) {
            const baseSalary = payroll.baseSalary;
            const grossPay = baseSalary + totalAllowances + totalBonuses;
            const totalDeductionsAmount = totalDeductions + totalTax;
            const netPay = grossPay - totalDeductionsAmount;

            await db.payroll.update(payrollId, {
                grossPay,
                deductions: totalDeductionsAmount,
                tax: totalTax,
                allowances: totalAllowances,
                bonuses: totalBonuses,
                netPay,
                synced: 0
            });
        }
    };

    const getTypeColor = (type: string) => {
        switch(type) {
            case 'allowance': return '#10b981';
            case 'bonus': return '#8b5cf6';
            case 'deduction': return '#ef4444';
            case 'tax': return '#f59e0b';
            case 'overtime': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const getTypeEmoji = (type: string) => {
        switch(type) {
            case 'allowance': return '➕';
            case 'bonus': return '🎯';
            case 'deduction': return '➖';
            case 'tax': return '🏛️';
            case 'overtime': return '⏰';
            default: return '📝';
        }
    };

    return (
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong>{staffName}</strong>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#0f2b3d', color: 'white', padding: '4px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    + Add Item
                </button>
            </div>

            {showAddForm && (
                <div style={{ background: 'white', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px' }}>
                        <select value={newItem.type} onChange={(e) => setNewItem({...newItem, type: e.target.value as any})} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            <option value="allowance">Allowance</option>
                            <option value="bonus">Bonus</option>
                            <option value="deduction">Deduction</option>
                            <option value="tax">Tax</option>
                            <option value="overtime">Overtime</option>
                            <option value="other">Other</option>
                        </select>
                        <input type="text" placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        <input type="number" placeholder="Amount" value={newItem.amount} onChange={(e) => setNewItem({...newItem, amount: parseFloat(e.target.value) || 0})} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        <button onClick={addItem} style={{ background: '#10b981', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                    </div>
                </div>
            )}

            {items.length > 0 && (
                <div style={{ fontSize: '0.85rem' }}>
                    {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', borderBottom: '1px solid #e2e8f0' }}>
                            <span>
                                <span style={{ marginRight: '8px' }}>{getTypeEmoji(item.type)}</span>
                                <span style={{ color: getTypeColor(item.type) }}>{item.type.toUpperCase()}</span>
                                <span style={{ marginLeft: '8px', color: '#6b7280' }}>{item.description}</span>
                            </span>
                            <span>
                                <span style={{ fontWeight: 'bold' }}>{item.amount.toFixed(2)}</span>
                                <button onClick={() => deleteItem(item.id!)} style={{ marginLeft: '8px', background: '#ef4444', color: 'white', padding: '2px 6px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>×</button>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PayrollItemEditor;
