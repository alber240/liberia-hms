import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, Drug, Patient } from '../db/database';

const DispensingModule: React.FC = () => {
    const { t } = useTranslation();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string>('');
    const [selectedDrug, setSelectedDrug] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [notes, setNotes] = useState('');
    const [dispensingHistory, setDispensingHistory] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const allPatients = await db.getAllPatients();
        const allDrugs = await db.getAllDrugs();
        setPatients(allPatients);
        setDrugs(allDrugs);
    };

    const loadHistory = async (uhid: string) => {
        const history = await db.getDispensingHistory(uhid);
        setDispensingHistory(history);
    };

    const handleDispense = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const drug = drugs.find(d => d.id === selectedDrug);
        const patient = patients.find(p => p.uhid === selectedPatient);
        
        if (!drug || !patient) return;
        
        if (drug.quantityInStock < quantity) {
            alert(`Insufficient stock! Only ${drug.quantityInStock} ${drug.unit}s available.`);
            return;
        }
        
        await db.dispenseMedication({
            prescriptionId: 0, // Simplified for now
            patientUhid: selectedPatient,
            patientName: patient.fullName,
            drugId: selectedDrug,
            drugName: drug.name,
            quantity: quantity,
            dispensedBy: 'Pharmacist',
            dispensedAt: new Date().toISOString(),
            batchNumber: drug.batchNumber,
            expiryDate: drug.expiryDate,
            notes: notes
        });
        
        alert(`Dispensed ${quantity} ${drug.unit}(s) of ${drug.name} to ${patient.fullName}`);
        
        setSelectedDrug(0);
        setQuantity(1);
        setNotes('');
        await loadData();
        await loadHistory(selectedPatient);
    };

    const selectedDrugInfo = drugs.find(d => d.id === selectedDrug);

    return (
        <div>
            <h3 style={{ marginBottom: '20px' }}>💊 Dispense Medication</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <form onSubmit={handleDispense}>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Select Patient *</label>
                            <select
                                required
                                value={selectedPatient}
                                onChange={(e) => {
                                    setSelectedPatient(e.target.value);
                                    loadHistory(e.target.value);
                                }}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="">Select Patient</option>
                                {patients.map(p => <option key={p.uhid} value={p.uhid}>{p.fullName} ({p.uhid})</option>)}
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label>Select Medication *</label>
                            <select
                                required
                                value={selectedDrug}
                                onChange={(e) => setSelectedDrug(parseInt(e.target.value))}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="0">Select Drug</option>
                                {drugs.filter(d => d.quantityInStock > 0).map(d => (
                                    <option key={d.id} value={d.id}>{d.name} - {d.quantityInStock} {d.unit}s available - ${d.sellingPrice}</option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedDrugInfo && (
                            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                <div><strong>Stock Available:</strong> {selectedDrugInfo.quantityInStock} {selectedDrugInfo.unit}s</div>
                                <div><strong>Expiry Date:</strong> {selectedDrugInfo.expiryDate}</div>
                                <div><strong>Requires Prescription:</strong> {selectedDrugInfo.requiresPrescription ? 'Yes' : 'No'}</div>
                                <div><strong>Price per unit:</strong> ${selectedDrugInfo.sellingPrice}</div>
                            </div>
                        )}
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label>Quantity *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max={selectedDrugInfo?.quantityInStock || 0}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label>Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        
                        <button type="submit" style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
                            Dispense Medication
                        </button>
                    </form>
                </div>
                
                <div>
                    <h4>Dispensing History</h4>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                        {dispensingHistory.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#6b7280' }}>No dispensing history</p>
                        ) : (
                            dispensingHistory.map(record => (
                                <div key={record.id} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>
                                    <div><strong>{record.drugName}</strong> - {record.quantity} units</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Dispensed: {new Date(record.dispensedAt).toLocaleString()}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Batch: {record.batchNumber} | Exp: {record.expiryDate}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DispensingModule;
