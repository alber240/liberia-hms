import React, { useState, useEffect } from 'react';
import { db, Patient, VitalSign } from '../db/database';
import { authService } from '../services/authService';

const VitalSigns: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [vitals, setVitals] = useState<VitalSign[]>([]);
    const [formData, setFormData] = useState({
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        pulse: '',
        temperature: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        weight: '',
        height: '',
        notes: ''
    });

    const user = authService.getCurrentUser();

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        if (selectedPatient) {
            loadVitals();
        }
    }, [selectedPatient]);

    const loadPatients = async () => {
        const allPatients = await db.getAllPatients();
        setPatients(allPatients);
    };

    const loadVitals = async () => {
        const patientVitals = await db.vitalSigns.where('patientUhid').equals(selectedPatient).toArray();
        setVitals(patientVitals);
    };

    const calculateBMI = (weight: number, height: number) => {
        if (weight && height) {
            return (weight / ((height / 100) ** 2)).toFixed(1);
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const patient = patients.find(p => p.uhid === selectedPatient);
        
        const systolic = parseFloat(formData.bloodPressureSystolic);
        const diastolic = parseFloat(formData.bloodPressureDiastolic);
        const weight = parseFloat(formData.weight);
        const height = parseFloat(formData.height);
        
        await db.vitalSigns.add({
            patientUhid: selectedPatient,
            patientName: patient?.fullName || '',
            recordedBy: user?.name || '',
            recordedAt: new Date().toISOString(),
            bloodPressureSystolic: systolic || undefined,
            bloodPressureDiastolic: diastolic || undefined,
            pulse: parseFloat(formData.pulse) || undefined,
            temperature: parseFloat(formData.temperature) || undefined,
            respiratoryRate: parseFloat(formData.respiratoryRate) || undefined,
            oxygenSaturation: parseFloat(formData.oxygenSaturation) || undefined,
            weight: weight || undefined,
            height: height || undefined,
            bmi: calculateBMI(weight, height) ? parseFloat(calculateBMI(weight, height)!) : undefined,
            notes: formData.notes,
            synced: 0
        });
        
        setFormData({
            bloodPressureSystolic: '', bloodPressureDiastolic: '', pulse: '', temperature: '',
            respiratoryRate: '', oxygenSaturation: '', weight: '', height: '', notes: ''
        });
        await loadVitals();
        alert('Vital signs recorded successfully!');
    };

    const getBPStatus = (systolic: number, diastolic: number) => {
        if (systolic < 120 && diastolic < 80) return { text: 'Normal', color: '#10b981' };
        if (systolic < 130 && diastolic < 80) return { text: 'Elevated', color: '#f59e0b' };
        if (systolic < 140 || diastolic < 90) return { text: 'High BP Stage 1', color: '#ef4444' };
        return { text: 'High BP Stage 2', color: '#dc2626' };
    };

    const getPulseStatus = (pulse: number) => {
        if (pulse >= 60 && pulse <= 100) return { text: 'Normal', color: '#10b981' };
        if (pulse < 60) return { text: 'Bradycardia', color: '#f59e0b' };
        return { text: 'Tachycardia', color: '#ef4444' };
    };

    const getTempStatus = (temp: number) => {
        if (temp >= 36.5 && temp <= 37.5) return { text: 'Normal', color: '#10b981' };
        if (temp < 36.5) return { text: 'Hypothermia', color: '#3b82f6' };
        return { text: 'Fever', color: '#ef4444' };
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <label>Select Patient</label>
                <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p.uhid} value={p.uhid}>{p.fullName} ({p.uhid})</option>)}
                </select>
            </div>
            
            {selectedPatient && (
                <>
                    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                        <h3>🩺 Record Vital Signs - {patients.find(p => p.uhid === selectedPatient)?.fullName}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div><label>Blood Pressure (Systolic)</label><input type="number" step="1" value={formData.bloodPressureSystolic} onChange={(e) => setFormData({...formData, bloodPressureSystolic: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="120" /></div>
                            <div><label>Blood Pressure (Diastolic)</label><input type="number" step="1" value={formData.bloodPressureDiastolic} onChange={(e) => setFormData({...formData, bloodPressureDiastolic: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="80" /></div>
                            <div><label>Pulse (bpm)</label><input type="number" step="1" value={formData.pulse} onChange={(e) => setFormData({...formData, pulse: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="72" /></div>
                            <div><label>Temperature (°C)</label><input type="number" step="0.1" value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="36.6" /></div>
                            <div><label>Respiratory Rate</label><input type="number" step="1" value={formData.respiratoryRate} onChange={(e) => setFormData({...formData, respiratoryRate: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="16" /></div>
                            <div><label>O2 Saturation (%)</label><input type="number" step="1" value={formData.oxygenSaturation} onChange={(e) => setFormData({...formData, oxygenSaturation: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="98" /></div>
                            <div><label>Weight (kg)</label><input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="70" /></div>
                            <div><label>Height (cm)</label><input type="number" step="0.1" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="170" /></div>
                            <div><label>BMI</label><input type="text" value={calculateBMI(parseFloat(formData.weight), parseFloat(formData.height)) || ''} disabled style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#f3f4f6' }} /></div>
                        </div>
                        <div><label>Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="Any additional notes..." /></div>
                        <button type="submit" style={{ marginTop: '16px', background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save Vital Signs</button>
                    </form>
                    
                    {vitals.length > 0 && (
                        <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                            <h4>Vital Signs History</h4>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f1f5f9' }}>
                                        <tr>
                                            <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
                                            <th style={{ padding: '8px', textAlign: 'left' }}>BP</th>
                                            <th style={{ padding: '8px', textAlign: 'left' }}>Pulse</th>
                                            <th style={{ padding: '8px', textAlign: 'left' }}>Temp</th>
                                            <th style={{ padding: '8px', textAlign: 'left' }}>RR</th>
                                            <th style={{ padding: '8px', textAlign: 'left' }}>SpO2</th>
                                            <th style={{ padding: '8px', textAlign: 'left' }}>BMI</th>
                                            <th style={{ padding: '8px', textAlign: 'left' }}>Recorded By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vitals.map(v => {
                                            const bpStatus = v.bloodPressureSystolic && v.bloodPressureDiastolic ? getBPStatus(v.bloodPressureSystolic, v.bloodPressureDiastolic) : null;
                                            const pulseStatus = v.pulse ? getPulseStatus(v.pulse) : null;
                                            const tempStatus = v.temperature ? getTempStatus(v.temperature) : null;
                                            return (
                                                <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                    <td style={{ padding: '8px' }}>{new Date(v.recordedAt).toLocaleDateString()}</td>
                                                    <td style={{ padding: '8px', color: bpStatus?.color }}>{v.bloodPressureSystolic}/{v.bloodPressureDiastolic}</td>
                                                    <td style={{ padding: '8px', color: pulseStatus?.color }}>{v.pulse}</td>
                                                    <td style={{ padding: '8px', color: tempStatus?.color }}>{v.temperature}°C</td>
                                                    <td style={{ padding: '8px' }}>{v.respiratoryRate}</td>
                                                    <td style={{ padding: '8px' }}>{v.oxygenSaturation}%</td>
                                                    <td style={{ padding: '8px' }}>{v.bmi}</td>
                                                    <td style={{ padding: '8px' }}>{v.recordedBy}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VitalSigns;
