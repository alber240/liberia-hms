import React, { useState, useEffect } from 'react';
import { db, Patient, SOAPNote } from '../db/database';
import { authService } from '../services/authService';

const EMR: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [notes, setNotes] = useState<SOAPNote[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        followUpDate: ''
    });

    const user = authService.getCurrentUser();

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        if (selectedPatient) {
            loadNotes();
        }
    }, [selectedPatient]);

    const loadPatients = async () => {
        const allPatients = await db.getAllPatients();
        setPatients(allPatients);
    };

    const loadNotes = async () => {
        const patientNotes = await db.soapNotes.where('patientUhid').equals(selectedPatient).toArray();
        setNotes(patientNotes);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const patient = patients.find(p => p.uhid === selectedPatient);
        
        await db.soapNotes.add({
            patientUhid: selectedPatient,
            patientName: patient?.fullName || '',
            doctorId: user?.staffId || '',
            doctorName: user?.name || '',
            date: new Date().toISOString(),
            subjective: formData.subjective,
            objective: formData.objective,
            assessment: formData.assessment,
            plan: formData.plan,
            followUpDate: formData.followUpDate,
            status: 'final',
            createdBy: user?.name || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            synced: 0
        });
        
        setShowForm(false);
        setFormData({ subjective: '', objective: '', assessment: '', plan: '', followUpDate: '' });
        await loadNotes();
        alert('SOAP Note saved successfully!');
    };

    const getRole = authService.getUserRole();
    if (getRole !== 'doctor' && getRole !== 'admin') {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Access denied. Doctors only.</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>📋 Electronic Medical Records (SOAP Notes)</h3>
                <button onClick={() => setShowForm(!showForm)} style={{ background: '#0f2b3d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    + New SOAP Note
                </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <label>Select Patient</label>
                <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p.uhid} value={p.uhid}>{p.fullName} ({p.uhid})</option>)}
                </select>
            </div>
            
            {showForm && selectedPatient && (
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h4>New SOAP Note - {patients.find(p => p.uhid === selectedPatient)?.fullName}</h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div><label>S (Subjective) - Patient's complaint *</label><textarea required value={formData.subjective} onChange={(e) => setFormData({...formData, subjective: e.target.value})} rows={3} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="What the patient tells you..." /></div>
                        <div><label>O (Objective) - Physical findings *</label><textarea required value={formData.objective} onChange={(e) => setFormData({...formData, objective: e.target.value})} rows={3} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="Vital signs, exam findings, lab results..." /></div>
                        <div><label>A (Assessment) - Diagnosis *</label><textarea required value={formData.assessment} onChange={(e) => setFormData({...formData, assessment: e.target.value})} rows={2} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="What you think is wrong..." /></div>
                        <div><label>P (Plan) - Treatment *</label><textarea required value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} rows={2} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="Medications, tests, follow-up..." /></div>
                        <div><label>Follow-up Date</label><input type="date" value={formData.followUpDate} onChange={(e) => setFormData({...formData, followUpDate: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                        <button type="submit" style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save SOAP Note</button>
                        <button type="button" onClick={() => setShowForm(false)} style={{ background: '#e2e8f0', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            )}
            
            {selectedPatient && notes.length > 0 && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h4>Clinical History</h4>
                    {notes.map(note => (
                        <div key={note.id} style={{ borderBottom: '1px solid #e2e8f0', padding: '12px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>{new Date(note.date).toLocaleDateString()}</strong>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Dr. {note.doctorName}</span>
                            </div>
                            <div style={{ marginTop: '8px' }}><strong>S:</strong> {note.subjective}</div>
                            <div><strong>O:</strong> {note.objective}</div>
                            <div><strong>A:</strong> {note.assessment}</div>
                            <div><strong>P:</strong> {note.plan}</div>
                            {note.followUpDate && <div style={{ marginTop: '8px', color: '#f59e0b' }}>Follow-up: {new Date(note.followUpDate).toLocaleDateString()}</div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EMR;
