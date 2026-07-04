import React, { useState, useEffect } from 'react';
import { db, Staff, Payroll } from '../db/database';
import { authService } from '../services/authService';
import PayrollItemEditor from './PayrollItemEditor';

const PayrollManagement: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [payrollRecords, setPayrollRecords] = useState<Payroll[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7));
    const [processing, setProcessing] = useState(false);
    const [expandedStaff, setExpandedStaff] = useState<number | null>(null);

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

    const calculateBasePay = (staffMember: Staff) => {
        return staffMember.salary;
    };

    const processPayroll = async () => {
        setProcessing(true);
        for (const staffMember of staff) {
            const baseSalary = calculateBasePay(staffMember);
            
            const existing = await db.payroll.where('staffId').equals(staffMember.id!).and(p => p.period === selectedPeriod).first();
            
            if (!existing) {
                const payrollId = await db.payroll.add({
                    staffId: staffMember.id!,
                    staffName: staffMember.name,
                    period: selectedPeriod,
                    baseSalary: baseSalary,
                    currency: staffMember.salaryCurrency,
                    overtimeHours: 0,
                    overtimePay: 0,
                    allowances: 0,
                    bonuses: 0,
                    grossPay: baseSalary,
                    deductions: 0,
                    tax: 0,
                    pension: 0,
                    netPay: baseSalary,
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

    const calculateTotals = (record: Payroll) => {
        const grossPay = record.grossPay || 0;
        const deductions = record.deductions || 0;
        const netPay = record.netPay || 0;
        return { grossPay, deductions, netPay };
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'paid': return '#d1fae5';
            case 'pending': return '#fef3c7';
            case 'cancelled': return '#fee2e2';
            default: return '#f3f4f6';
        }
    };

    const markAsPaid = async (id: number) => {
        await db.payroll.update(id, { status: 'paid', paymentDate: new Date().toISOString(), synced: 0 });
        await loadPayroll();
        alert('Payment recorded');
    };

    const generatePayslip = (record: Payroll) => {
        const staffMember = staff.find(s => s.id === record.staffId);
        const content = `
            ========================================
                    LIBERIAHMS - PAYSLIP
            ========================================
            Staff ID: ${staffMember?.staffId}
            Name: ${record.staffName}
            Period: ${record.period}
            Role: ${staffMember?.role}
            Department: ${staffMember?.department}
            ========================================
            EARNINGS:
            Base Salary:     ${record.currency} ${record.baseSalary.toFixed(2)}
            Allowances:      ${record.currency} ${record.allowances.toFixed(2)}
            Bonuses:         ${record.currency} ${record.bonuses.toFixed(2)}
            Overtime:        ${record.currency} ${record.overtimePay.toFixed(2)}
            ----------------------------------------
            GROSS PAY:       ${record.currency} ${record.grossPay.toFixed(2)}
            ========================================
            DEDUCTIONS:
            Tax:             ${record.currency} ${record.tax.toFixed(2)}
            Other Deductions:${record.currency} ${(record.deductions || 0).toFixed(2)}
            ----------------------------------------
            TOTAL DEDUCTIONS: ${record.currency} ${(record.deductions || 0 + (record.tax || 0)).toFixed(2)}
            ========================================
            NET PAY:         ${record.currency} ${record.netPay.toFixed(2)}
            ========================================
            Payment Method: ${record.paymentMethod}
            Status: ${record.status}
            ========================================
        `;
        
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
                    <button onClick={processPayroll} disabled={processing} style={{ background: '#0f2b3d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        {processing ? 'Processing...' : 'Process Payroll'}
                    </button>
                </div>
            </div>

            <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                    💡 Click on a staff row to add allowances, deductions, taxes, and bonuses
                </p>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead style={{ background: '#0f2b3d', color: 'white' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Staff Name</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Base Salary</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Gross Pay</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Deductions</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Net Pay</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrollRecords.map((record) => {
                            const staffMember = staff.find(s => s.id === record.staffId);
                            const { grossPay, deductions, netPay } = calculateTotals(record);
                            const isExpanded = expandedStaff === record.id;
                            
                            return (
                                <React.Fragment key={record.id}>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => setExpandedStaff(isExpanded ? null : record.id!)}>
                                        <td style={{ padding: '12px' }}>
                                            <strong>{record.staffName}</strong>
                                            {record.status === 'pending' && <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#f59e0b' }}>⚡</span>}
                                        </td>
                                        <td style={{ padding: '12px' }}>{staffMember?.role}</td>
                                        <td style={{ padding: '12px' }}>{record.currency} {record.baseSalary.toLocaleString()}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{record.currency} {grossPay.toFixed(2)}</td>
                                        <td style={{ padding: '12px', color: '#ef4444' }}>{record.currency} {deductions.toFixed(2)}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#10b981' }}>{record.currency} {netPay.toFixed(2)}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{ background: getStatusColor(record.status), padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem' }}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {record.status === 'pending' && (
                                                <button onClick={(e) => { e.stopPropagation(); markAsPaid(record.id!); }} style={{ background: '#10b981', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>
                                                    Mark Paid
                                                </button>
                                            )}
                                            <button onClick={(e) => { e.stopPropagation(); generatePayslip(record); }} style={{ background: '#6b7280', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                                Payslip
                                            </button>
                                        </td>
                                    </tr>
                                    {isExpanded && record.id && (
                                        <tr>
                                            <td colSpan={8} style={{ padding: '16px', background: '#f8fafc' }}>
                                                <PayrollItemEditor 
                                                    payrollId={record.id}
                                                    staffId={record.staffId}
                                                    staffName={record.staffName}
                                                    onUpdate={loadPayroll}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {payrollRecords.length === 0 && staff.length > 0 && (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
                    <p>No payroll records for {selectedPeriod}</p>
                    <button onClick={processPayroll} style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '12px' }}>
                        Process Payroll Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default PayrollManagement;
