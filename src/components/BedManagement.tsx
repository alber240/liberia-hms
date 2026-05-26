import React, { useState, useEffect } from 'react';
import { db, Patient } from '../db/database';

interface Bed {
    id: string;
    number: string;
    ward: string;
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
    patientUhid?: string;
    patientName?: string;
    admissionDate?: string;
}

const BedManagement: React.FC = () => {
    const [beds, setBeds] = useState<Bed[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [showAdmitForm, setShowAdmitForm] = useState(false);

    useEffect(() => {
        initializeBeds();
        loadPatients();
    }, []);

    const initializeBeds = () => {
        const defaultBeds: Bed[] = [
            // ICU Beds
            { id: 'ICU-1', number: 'ICU-01', ward: 'ICU', status: 'available' },
            { id: 'ICU-2', number: 'ICU-02', ward: 'ICU', status: 'available' },
            { id: 'ICU-3', number: 'ICU-03', ward: 'ICU', status: 'available' },
            { id: 'ICU-4', number: 'ICU-04', ward: 'ICU', status: 'available' },
            // General Ward Beds
            { id: 'GW-1', number: 'GW-01', ward: 'General Ward', status: 'available' },
            { id: 'GW-2', number: 'GW-02', ward: 'General Ward', status: 'available' },
            { id: 'GW-3', number: 'GW-03', ward: 'General Ward', status: 'available' },
            { id: 'GW-4', number: 'GW-04', ward: 'General Ward', status: 'available' },
            { id: 'GW-5', number: 'GW-05', ward: 'General Ward', status: 'available' },
            { id: 'GW-6', number: 'GW-06', ward: 'General Ward', status: 'available' },
            // Private Ward Beds
            { id: 'PW-1', number: 'PW-01', ward: 'Private Ward', status: 'available' },
            { id: 'PW-2', number: 'PW-02', ward: 'Private Ward', status: 'available' },
            { id: 'PW-3', number: 'PW-03', ward: 'Private Ward', status: 'available' },
            { id: 'PW-4', number: 'PW-04', ward: 'Private Ward', status: 'available' },
        ];
        setBeds(defaultBeds);
    };

    const loadPatients = async () => {
        const allPatients = await db.getAllPatients();
        setPatients(allPatients);
    };

    const admitPatient = (bedId: string) => {
        if (!selectedPatient) {
            alert('Please select a patient');
            return;
        }
        const patient = patients.find(p => p.uhid === selectedPatient);
        setBeds(beds.map(bed => 
            bed.id === bedId 
                ? { ...bed, status: 'occupied', patientUhid: selectedPatient, patientName: patient?.fullName, admissionDate: new Date().toISOString() }
                : bed
        ));
        setSelectedPatient('');
        setShowAdmitForm(false);
        alert(`Patient ${patient?.fullName} admitted to bed ${bedId}`);
    };

    const dischargePatient = (bedId: string) => {
        const bed = beds.find(b => b.id === bedId);
        if (bed && window.confirm(`Discharge ${bed.patientName} from bed ${bed.number}?`)) {
            setBeds(beds.map(b => 
                b.id === bedId 
                    ? { ...b, status: 'cleaning', patientUhid: undefined, patientName: undefined, admissionDate: undefined }
                    : b
            ));
            alert(`Patient discharged. Bed ${bed.number} sent for cleaning.`);
        }
    };

    const markAsClean = (bedId: string) => {
        setBeds(beds.map(b => 
            b.id === bedId ? { ...b, status: 'available' } : b
        ));
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'available': return '#10b981';
            case 'occupied': return '#ef4444';
            case 'maintenance': return '#f59e0b';
            case 'cleaning': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const wards = [...new Set(beds.map(b => b.ward))];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>🛏️ Bed Management</h3>
                <button onClick={() => setShowAdmitForm(!showAdmitForm)} style={{ background: '#0f2b3d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    + New Admission
                </button>
            </div>
            
            {showAdmitForm && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h4>Admit Patient</h4>
                    <div style={{ marginBottom: '16px' }}>
                        <label>Select Patient</label>
                        <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <option value="">Select Patient</option>
                            {patients.map(p => <option key={p.uhid} value={p.uhid}>{p.fullName} ({p.uhid})</option>)}
                        </select>
                    </div>
                    <p style={{ color: '#6b7280' }}>Click on any available bed to admit the patient</p>
                </div>
            )}
            
            {wards.map(ward => (
                <div key={ward} style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '12px' }}>🏥 {ward}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        {beds.filter(b => b.ward === ward).map(bed => (
                            <div key={bed.id} style={{
                                background: 'white',
                                padding: '16px',
                                borderRadius: '12px',
                                border: `2px solid ${getStatusColor(bed.status)}`,
                                cursor: bed.status === 'available' && showAdmitForm ? 'pointer' : 'default'
                            }} onClick={() => {
                                if (bed.status === 'available' && showAdmitForm && selectedPatient) {
                                    admitPatient(bed.id);
                                }
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ fontSize: '1.1rem' }}>{bed.number}</strong>
                                    <span style={{ background: getStatusColor(bed.status), color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>
                                        {bed.status}
                                    </span>
                                </div>
                                {bed.patientName && (
                                    <>
                                        <div style={{ marginTop: '8px' }}><strong>Patient:</strong> {bed.patientName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Admitted: {bed.admissionDate ? new Date(bed.admissionDate).toLocaleDateString() : 'N/A'}</div>
                                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                            <button onClick={(e) => { e.stopPropagation(); dischargePatient(bed.id); }} style={{ background: '#ef4444', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
                                                Discharge
                                            </button>
                                        </div>
                                    </>
                                )}
                                {bed.status === 'cleaning' && (
                                    <button onClick={(e) => { e.stopPropagation(); markAsClean(bed.id); }} style={{ marginTop: '8px', background: '#10b981', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', width: '100%' }}>
                                        Mark as Clean & Available
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            <div style={{ marginTop: '24px', background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                    <div><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', marginRight: '8px' }}></span> Available</div>
                    <div><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', marginRight: '8px' }}></span> Occupied</div>
                    <div><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', marginRight: '8px' }}></span> Cleaning</div>
                    <div><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%', marginRight: '8px' }}></span> Maintenance</div>
                </div>
            </div>
        </div>
    );
};

export default BedManagement;
