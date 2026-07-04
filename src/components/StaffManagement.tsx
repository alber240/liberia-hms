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
        synced: 0,
        mustChangePassword: true,
        lastPasswordChange: '',
        passwordHistory: '',
        failedLoginAttempts: 0,
        lockedUntil: '',
        lastLoginAt: '',
        lastLoginIP: '',
        isActive: true,
        deactivatedAt: '',
        deactivatedBy: '',
        deactivationReason: ''
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

    const generateTempPassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password + '@2024';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const tempPassword = !editingStaff ? generateTempPassword() : '';
        
        if (editingStaff) {
            await db.staff.update(editingStaff.id!, { ...formData, synced: 0 });
            alert('Staff updated successfully');
        } else {
            const newStaff = { 
                ...formData, 
                staffId: generateStaffId(), 
                password: tempPassword,
                mustChangePassword: true,
                createdAt: new Date().toISOString(), 
                synced: 0 
            };
            await db.staff.add(newStaff);
            alert(`Staff added successfully!\nTemporary Password: ${tempPassword}\nPlease provide this to the staff member. They must change it on first login.`);
        }
        
        setShowAddForm(false);
        setEditingStaff(null);
        setFormData({
            staffId: '', username: '', password: '', name: '', role: 'receptionist', department: '',
            licenseNumber: '', phone: '', email: '', address: '', emergencyContact: '', emergencyPhone: '',
            salary: 0, salaryCurrency: 'USD', paySchedule: 'monthly', bankName: '', accountNumber: '',
            startDate: new Date().toISOString().split('T')[0], status: 'active', qualifications: '',
            createdAt: '', synced: 0, mustChangePassword: true, lastPasswordChange: '', passwordHistory: '',
            failedLoginAttempts: 0, lockedUntil: '', lastLoginAt: '', lastLoginIP: '', isActive: true,
            deactivatedAt: '', deactivatedBy: '', deactivationReason: ''
        });
        await loadStaff();
    };

    const handleEdit = (staffMember: Staff) => {
        setEditingStaff(staffMember);
        setFormData(staffMember as any);
        setShowAddForm(true);
    };

    const handleDelete = async (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            await db.staff.delete(id);
            alert(`${name} has been deleted.`);
            await loadStaff();
        }
    };

    const resetPassword = async (id: number, name: string) => {
        if (window.confirm(`Reset password for ${name}?`)) {
            const tempPassword = generateTempPassword();
            await db.staff.update(id, { 
                password: tempPassword, 
                mustChangePassword: true,
                failedLoginAttempts: 0,
                lockedUntil: '',
                synced: 0 
            });
            alert(`Password reset for ${name}\nTemporary Password: ${tempPassword}\nThey must change it on next login.`);
            await loadStaff();
        }
    };

    const deactivateStaff = async (id: number, name: string) => {
        const reason = prompt(`Reason for deactivating ${name}? (e.g., Resigned, Terminated, Left without notice)`);
        if (reason) {
            const admin = authService.getCurrentUser();
            await db.staff.update(id, {
                status: 'terminated',
                isActive: false,
                deactivatedAt: new Date().toISOString(),
                deactivatedBy: admin?.name || 'Admin',
                deactivationReason: reason,
                synced: 0
            });
            alert(`${name} has been deactivated. They can no longer access the system.`);
            await loadStaff();
        }
    };

    const reactivateStaff = async (id: number, name: string) => {
        if (window.confirm(`Reactivate ${name}?`)) {
            await db.staff.update(id, {
                status: 'active',
                isActive: true,
                failedLoginAttempts: 0,
                lockedUntil: '',
                synced: 0
            });
            alert(`${name} has been reactivated.`);
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
                        {!editingStaff && <div><label>Password</label><input type="text" disabled value="Auto-generated" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f3f4f6' }} /></div>}
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
                        <tr>
                            <th style={{ padding: '12px' }}>Staff ID</th>
                            <th style={{ padding: '12px' }}>Name</th>
                            <th style={{ padding: '12px' }}>Role</th>
                            <th style={{ padding: '12px' }}>Department</th>
                            <th style={{ padding: '12px' }}>Phone</th>
                            <th style={{ padding: '12px' }}>Salary</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((member) => (
                            <tr key={member.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px' }}>{member.staffId}</td>
                                <td style={{ padding: '12px' }}><strong>{member.name}</strong><br /><span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{member.username}</span></td>
                                <td style={{ padding: '12px' }}><span style={{ background: getRoleColor(member.role), color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{member.role}</span></td>
                                <td style={{ padding: '12px' }}>{member.department}</td>
                                <td style={{ padding: '12px' }}>{member.phone}</td>
                                <td style={{ padding: '12px' }}>{member.salaryCurrency} {member.salary.toLocaleString()}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: member.status === 'active' ? '#10b981' : member.status === 'on_leave' ? '#f59e0b' : '#ef4444', fontWeight: 'bold' }}>
                                        {member.status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button onClick={() => handleEdit(member)} style={{ background: '#6b7280', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}>Edit</button>
                                    <button onClick={() => handleDelete(member.id!, member.name)} style={{ background: '#dc2626', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}>Delete</button>
                                    <button onClick={() => resetPassword(member.id!, member.name)} style={{ background: '#f59e0b', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}>Reset Pwd</button>
                                    {member.status === 'active' ? (
                                        <button onClick={() => deactivateStaff(member.id!, member.name)} style={{ background: '#dc2626', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Deactivate</button>
                                    ) : (
                                        <button onClick={() => reactivateStaff(member.id!, member.name)} style={{ background: '#10b981', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reactivate</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffManagement;
