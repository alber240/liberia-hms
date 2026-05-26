import React, { useState, useEffect } from 'react';
import { db, Staff, Payroll } from '../db/database';
import { authService } from '../services/authService';

const PayrollManagement: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [payrollRecords, setPayrollRecords] = useState<Payroll[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7));
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadStaff();
        loadPayroll();
    }, [selectedPeriod]);

    const loadStaff = async () => {
        const allStaff = await db.staff.where('status').equals('active').toArray();
        setStaff(allStaff);
    };

    const loadPayroll = async () => {
        const records = await db.payroll.where('period').equals(selectedPeriod).toArray();
        setPayrollRecords(records);
    };

    const calculatePay = (staffMember: Staff, overtimeHours: number = 0) => {
        const monthlyRate = staffMember.salary;
        const dailyRate = monthlyRate / 26;
        const hourlyRate = dailyRate / 8;
        const overtimePay = overtimeHours * hourlyRate * 1.5;
        const allowances = monthlyRate * 0.1;
        const bonuses = 0;
        const grossPay = monthlyRate + overtimePay + allowances + bonuses;
        const tax = grossPay * 0.05;
        const pension = grossPay * 0.05;
        const deductions = tax + pension;
        const netPay = grossPay - deductions;
        return { monthlyRate, overtimePay, allowances, grossPay, tax, pension, deductions, netPay };
    };

    const processPayroll = async () => {
        setProcessing(true);
        for (const staffMember of staff) {
            const { monthlyRate, overtimePay, allowances, grossPay, tax, pension, deductions, netPay } = calculatePay(staffMember);
            const existing = await db.payroll.where('staffId').equals(staffMember.id!).and(p => p.period === selectedPeriod).first();
            if (!existing) {
                await db.payroll.add({
                    staffId: staffMember.id!,
                    staffName: staffMember.name,
                    period: selectedPeriod,
                    baseSalary: monthlyRate,
                    currency: staffMember.salaryCurrency,
                    overtimeHours: 0,
                    overtimePay,
                    allowances,
                    bonuses: 0,
                    grossPay,
                    deductions,
                    tax,
                    pension,
                    netPay,
                    paymentMethod: 'bank',
                    paymentDate: new Date().toISOString(),
                    status: 'pending',
                    payslipGenerated: false,
                    notes: '',
                    synced: 0
                });
            }
        }
        await loadPayroll();
        setProcessing(false);
        alert(`Payroll processed for ${selectedPeriod}`);
    };

    const markAsPaid = async (id: number) => {
        await db.payroll.update(id, { status: 'paid', paymentDate: new Date().toISOString(), synced: 0 });
        await loadPayroll();
        alert('Payment recorded');
    };

    const generatePayslip = (record: Payroll) => {
        const content = `========== LIBERIAHMS PAYSLIP ==========\nStaff: ${record.staffName}\nPeriod: ${record.period}\nGross Pay: ${record.currency} ${record.grossPay.toFixed(2)}\nDeductions: ${record.currency} ${record.deductions.toFixed(2)}\nNet Pay: ${record.currency} ${record.netPay.toFixed(2)}\nStatus: ${record.status}\n=========================================`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payslip_${record.staffName}_${record.period}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!authService.hasRole(['admin', 'accountant', 'hr'])) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Access denied. Admin/Accountant/HR only.</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h3>💰 Payroll Management</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="month" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    <button onClick={processPayroll} disabled={processing} style={{ background: '#0f2b3d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{processing ? 'Processing...' : 'Process Payroll'}</button>
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead style={{ background: '#f1f5f9' }}><tr><th style={{ padding: '12px' }}>Staff Name</th><th>Role</th><th>Gross Pay</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {payrollRecords.map(record => {
                            const staffMember = staff.find(s => s.id === record.staffId);
                            return (
                                <tr key={record.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px' }}><strong>{record.staffName}</strong></td>
                                    <td style={{ padding: '12px' }}>{staffMember?.role}</td>
                                    <td style={{ padding: '12px' }}>{record.currency} {record.grossPay.toFixed(2)}</td>
                                    <td style={{ padding: '12px' }}>{record.currency} {record.deductions.toFixed(2)}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#10b981' }}>{record.currency} {record.netPay.toFixed(2)}</td>
                                    <td style={{ padding: '12px' }}><span style={{ background: record.status === 'paid' ? '#d1fae5' : '#fef3c7', padding: '4px 8px', borderRadius: '12px' }}>{record.status}</span></td>
                                    <td style={{ padding: '12px' }}>{record.status === 'pending' && <button onClick={() => markAsPaid(record.id!)} style={{ background: '#10b981', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>Mark Paid</button>}<button onClick={() => generatePayslip(record)} style={{ background: '#6b7280', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Payslip</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayrollManagement;
