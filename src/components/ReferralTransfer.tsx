import React, { useState, useEffect } from 'react';
import { db, Patient } from '../db/database';
import { authService } from '../services/authService';

interface Referral {
    id?: number;
    patientUhid: string;
    patientName: string;
    fromHospital: string;
    toHospital: string;
    reason: string;
    diagnosis: string;
    referringDoctor: string;
    referringDoctorPhone: string;
    receivingDoctor?: string;
    receivingDoctorPhone?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'transferred';
    referralDate: string;
    notes: string;
    synced: number;
}

const ReferralTransfer: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        toHospital: '',
        reason: '',
        diagnosis: '',
        referringDoctorPhone: '',
        notes: ''
    });

    const user = authService.getCurrentUser();

    useEffect(() => {
        loadPatients();
        loadReferrals();
    }, []);

    const loadPatients = async () => {
        const allPatients = await db.getAllPatients();
        setPatients(allPatients);
    };

    const loadReferrals = async () => {
        // Load from localStorage for demo
        const saved = localStorage.getItem('referrals');
        if (saved) {
            setReferrals(JSON.parse(saved));
        }
    };

    const saveReferrals = (newReferrals: Referral[]) => {
        localStorage.setItem('referrals', JSON.stringify(newReferrals));
        setReferrals(newReferrals);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const patient = patients.find(p => p.uhid === selectedPatient);
        
        const newReferral: Referral = {
            patientUhid: selectedPatient,
            patientName: patient?.fullName || '',
            fromHospital: 'LiberiaHMS Hospital',
            toHospital: formData.toHospital,
            reason: formData.reason,
            diagnosis: formData.diagnosis,
            referringDoctor: user?.name || '',
            referringDoctorPhone: formData.referringDoctorPhone,
            status: 'pending',
            referralDate: new Date().toISOString(),
            notes: formData.notes,
            synced: 0
        };
        
        const updatedReferrals = [newReferral, ...referrals];
        saveReferrals(updatedReferrals);
        
        setShowForm(false);
        setFormData({ toHospital: '', reason: '', diagnosis: '', referringDoctorPhone: '', notes: '' });
        alert(`Referral sent to ${formData.toHospital}`);
    };

    const updateStatus = (index: number, status: 'accepted' | 'rejected' | 'transferred') => {
        const updated = [...referrals];
        updated[index].status = status;
        saveReferrals(updated);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>🔄 Referral & Transfer Management</h3>
                <button onClick={() => setShowForm(!showForm)} style={{ background: '#0f2b3d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    + New Referral
                </button>
            </div>
            
            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h3>Refer Patient to Another Facility</h3>
                    <div style={{ marginBottom: '16px' }}>
                        <label>Select Patient *</label>
                        <select required value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <option value="">Select Patient</option>
                            {patients.map(p => <option key={p.uhid} value={p.uhid}>{p.fullName} ({p.uhid})</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div><label>Referring Hospital</label><input type="text" value="LiberiaHMS Hospital" disabled style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#f3f4f6' }} /></div>
                        <div><label>Receiving Hospital *</label><input type="text" required value={formData.toHospital} onChange={(e) => setFormData({...formData, toHospital: e.target.value})} placeholder="e.g., JFK Medical Center" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Reason for Referral *</label><textarea required value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows={2} placeholder="Why is this patient being referred?" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Diagnosis *</label><textarea required value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} rows={2} placeholder="Current diagnosis" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Referring Doctor Phone</label><input type="tel" value={formData.referringDoctorPhone} onChange={(e) => setFormData({...formData, referringDoctorPhone: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Additional Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                    </div>
                    <button type="submit" style={{ marginTop: '16px', background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Send Referral</button>
                </form>
            )}
            
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                <h4>Referral History</h4>
                {referrals.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#6b7280' }}>No referrals yet</p>
                ) : (
                    referrals.map((ref, idx) => (
                        <div key={idx} style={{ borderBottom: '1px solid #e2e8f0', padding: '12px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>{ref.patientName}</strong>
                                <span style={{ background: ref.status === 'pending' ? '#fef3c7' : ref.status === 'accepted' ? '#d1fae5' : '#fee2e2', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>
                                    {ref.status}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.85rem' }}>From: {ref.fromHospital} → To: {ref.toHospital}</div>
                            <div style={{ fontSize: '0.85rem' }}>Reason: {ref.reason}</div>
                            <div style={{ fontSize: '0.85rem' }}>Diagnosis: {ref.diagnosis}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Referred: {new Date(ref.referralDate).toLocaleString()}</div>
                            {ref.status === 'pending' && (
                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                    <button onClick={() => updateStatus(idx, 'accepted')} style={{ background: '#10b981', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Accept</button>
                                    <button onClick={() => updateStatus(idx, 'rejected')} style={{ background: '#ef4444', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                                </div>
                            )}
                            {ref.status === 'accepted' && (
                                <button onClick={() => updateStatus(idx, 'transferred')} style={{ marginTop: '8px', background: '#3b82f6', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Mark as Transferred</button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReferralTransfer;
