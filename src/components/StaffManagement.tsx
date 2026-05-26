import React, { useState, useEffect } from 'react';
import { db, Staff } from '../db/database';
import { authService } from '../services/authService';

const StaffManagement: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [roles] = useState(['admin', 'doctor', 'nurse', 'pharmacist', 'lab_tech', 'cashier', 'accountant', 'hr', 'receptionist']);
    const [departments] = useState(['Administration', 'Medical', 'Nursing', 'Pharmacy', 'Laboratory', 'Finance', 'HR', 'Reception']);

    const [formData, setFormData] = useState({
        staffId: '',
        username: '',
        password: '',
        name: '',
        role: 'receptionist' as any,
        department: '',
        licenseNumber: '',
        phone: '',
        email: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        salary: 0,
        salaryCurrency: 'USD' as 'USD' | 'LRD',
        paySchedule: 'monthly' as 'monthly' | 'biweekly' | 'weekly',
        bankName: '',
        accountNumber: '',
        startDate: new Date().toISOString().split('T')[0],
        status: 'active' as 'active' | 'on_leave' | 'terminated',
        qualifications: '',
        createdAt: new Date().toISOString(),
        synced: 0
    });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        const allStaff = await db.staff.toArray();
        setStaff(allStaff);
    };

    const generateStaffId = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `EMP-${year}-${random}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingStaff) {
            await db.staff.update(editingStaff.id!, { ...formData, synced: 0 });
        } else {
            const newStaff = { ...formData, staffId: generateStaffId(), createdAt: new Date().toISOString(), synced: 0 };
            await db.staff.add(newStaff);
        }
        
        setShowAddForm(false);
        setEditingStaff(null);
        setFormData({
            staffId: '', username: '', password: '', name: '', role: 'receptionist', department: '',
            licenseNumber: '', phone: '', email: '', address: '', emergencyContact: '', emergencyPhone: '',
            salary: 0, salaryCurrency: 'USD', paySchedule: 'monthly', bankName: '', accountNumber: '',
            startDate: new Date().toISOString().split('T')[0], status: 'active', qualifications: '',
            createdAt: '', synced: 0
        });
        await loadStaff();
    };

        const handleEdit = (staffMember: Staff) => {
        setEditingStaff(staffMember);
        setFormData({
            staffId: staffMember.staffId || '',
            username: staffMember.username || '',
            password: '',
            name: staffMember.name || '',
            role: staffMember.role,
            department: staffMember.department || '',
            licenseNumber: staffMember.licenseNumber || '',
            phone: staffMember.phone || '',
            email: staffMember.email || '',
            address: staffMember.address || '',
            emergencyContact: staffMember.emergencyContact || '',
            emergencyPhone: staffMember.emergencyPhone || '',
            salary: staffMember.salary || 0,
            salaryCurrency: staffMember.salaryCurrency || 'USD',
            paySchedule: staffMember.paySchedule || 'monthly',
            bankName: staffMember.bankName || '',
            accountNumber: staffMember.accountNumber || '',
            startDate: staffMember.startDate || new Date().toISOString().split('T')[0],
            status: staffMember.status || 'active',
            qualifications: staffMember.qualifications || '',
            createdAt: staffMember.createdAt || new Date().toISOString(),
            synced: staffMember.synced || 0
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this staff member?')) {
            await db.staff.delete(id);
            await loadStaff();
        }
    };

    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
            admin: '#ef4444', doctor: '#3b82f6', nurse: '#10b981', pharmacist: '#8b5cf6',
            lab_tech: '#f59e0b', cashier: '#ec4898', accountant: '#06b6d4', hr: '#6366f1', receptionist: '#6b7280'
        };
        return colors[role] || '#6b7280';
    };

    if (!authService.isAdmin()) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Access denied. Admin only.</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>👥 Staff Management</h3>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#0f2b3d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    + Add Staff Member
                </button>
            </div>
            
            {showAddForm && (
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                    <h3>{editingStaff ? 'Edit Staff' : 'Add New Staff Member'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                        <div><label>Full Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Username *</label><input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        {!editingStaff && <div><label>Password *</label><input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>}
                        <div><label>Role *</label><select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as any})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>{roles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}</select></div>
                        <div><label>Department</label><select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}><option value="">Select</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                        <div><label>Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Salary Amount</label><input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Salary Currency</label><select value={formData.salaryCurrency} onChange={(e) => setFormData({...formData, salaryCurrency: e.target.value as any})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}><option value="USD">USD</option><option value="LRD">LRD</option></select></div>
                        <div><label>Start Date</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}><option value="active">Active</option><option value="on_leave">On Leave</option><option value="terminated">Terminated</option></select></div>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                        <button type="submit" style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => { setShowAddForm(false); setEditingStaff(null); }} style={{ background: '#e2e8f0', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            )}
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead style={{ background: '#f1f5f9' }}>
                        <tr><th style={{ padding: '12px' }}>Staff ID</th><th>Name</th><th>Role</th><th>Department</th><th>Phone</th><th>Salary</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {staff.map(member => (
                            <tr key={member.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px' }}>{member.staffId}</td>
                                <td style={{ padding: '12px' }}><strong>{member.name}</strong><br /><span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{member.username}</span></td>
                                <td style={{ padding: '12px' }}><span style={{ background: getRoleColor(member.role), color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{member.role}</span></td>
                                <td style={{ padding: '12px' }}>{member.department}</td>
                                <td style={{ padding: '12px' }}>{member.phone}</td>
                                <td style={{ padding: '12px' }}>{member.salaryCurrency} {member.salary.toLocaleString()} </td>
                                <td style={{ padding: '12px' }}><span style={{ color: member.status === 'active' ? '#10b981' : '#f59e0b' }}>{member.status}</span></td>
                                <td style={{ padding: '12px' }}><button onClick={() => handleEdit(member)} style={{ marginRight: '8px', background: '#6b7280', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button><button onClick={() => handleDelete(member.id!)} style={{ background: '#ef4444', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffManagement;

