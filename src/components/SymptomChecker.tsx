import React, { useState, useEffect } from 'react';
import { db, Patient, SymptomEntry } from '../db/database';
import { SYMPTOM_CATALOG, getDangerSigns, getSymptomsByCategory } from '../data/symptomCatalog';
import { predict, createPredictionRecord } from '../services/predictionEngine';

interface SymptomCheckerProps {
    onPredictionComplete: (prediction: any) => void;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onPredictionComplete }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [formData, setFormData] = useState({
        age: 0,
        sex: 'M' as 'M' | 'F',
        temperature: 0,
        duration: 1,
        notes: ''
    });
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        const all = await db.getAllPatients();
        setPatients(all);
    };

    const handlePatientSelect = (uhid: string) => {
        setSelectedPatient(uhid);
        const patient = patients.find(p => p.uhid === uhid);
        if (patient) {
            // Auto-calculate age from DOB
            const birthDate = new Date(patient.dateOfBirth);
            const today = new Date();
            const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            setFormData(prev => ({
                ...prev,
                age: age > 0 ? age : 0,
                sex: patient.gender === 'male' ? 'M' : 'F'
            }));
        }
    };

    const toggleSymptom = (code: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(code)
                ? prev.filter(s => s !== code)
                : [...prev, code]
        );
    };

    const handleSubmit = async () => {
        if (!selectedPatient) {
            alert('Please select a patient');
            return;
        }
        if (selectedSymptoms.length === 0) {
            alert('Please select at least one symptom');
            return;
        }

        setLoading(true);

        try {
            const patient = patients.find(p => p.uhid === selectedPatient);

            // Save symptom entry
            const symptomEntryId = await db.symptomEntries.add({
                patientUhid: selectedPatient,
                patientName: patient?.fullName || '',
                patientAge: formData.age,
                patientSex: formData.sex,
                temperature: formData.temperature || undefined,
                symptoms: selectedSymptoms,
                duration: formData.duration,
                notes: formData.notes,
                createdAt: new Date().toISOString(),
                synced: 0
            });

            // Run prediction
            const output = predict({
                symptoms: selectedSymptoms,
                age: formData.age,
                sex: formData.sex,
                temperature: formData.temperature || undefined
            });

            if (!output.matchedRule) {
                alert('No matching clinical rule found. Please consult senior clinician.');
                setLoading(false);
                return;
            }

            // Save prediction
            const symptomEntry = await db.symptomEntries.get(symptomEntryId as number);
            const predictionRecord = createPredictionRecord(symptomEntry!, output);

            if (predictionRecord) {
                const predictionId = await db.predictions.add(predictionRecord);
                predictionRecord.id = predictionId as number;
                onPredictionComplete(predictionRecord);
            }
        } catch (error) {
            console.error('Prediction error:', error);
            alert('Error running prediction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const dangerSigns = getDangerSigns();
    const generalSymptoms = getSymptomsByCategory('fever');
    const otherSymptoms = SYMPTOM_CATALOG.filter(
        s => s.category !== 'danger' && s.category !== 'fever'
    );

    return (
        <div>
            <h3>🩺 Clinical Prediction — Fever Assessment</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Select a patient, enter symptoms, and the system will suggest possible conditions and actions.
            </p>

            {/* Patient Selection */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                        Select Patient *
                    </label>
                    <select
                        value={selectedPatient}
                        onChange={(e) => handlePatientSelect(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="">-- Select a patient --</option>
                        {patients.map(p => (
                            <option key={p.uhid} value={p.uhid}>
                                {p.fullName} ({p.uhid})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                    <div>
                        <label>Age (years)</label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div>
                        <label>Sex</label>
                        <select
                            value={formData.sex}
                            onChange={(e) => setFormData({...formData, sex: e.target.value as 'M' | 'F'})}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div>
                        <label>Temperature (°C)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.temperature}
                            onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value) || 0})}
                            placeholder="e.g., 38.5"
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div>
                        <label>Duration (days)</label>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                </div>
            </div>

            {/* DANGER SIGNS - Red section */}
            <div style={{
                background: '#fee2e2',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '2px solid #ef4444'
            }}>
                <h4 style={{ color: '#991b1b', marginBottom: '12px' }}>
                    🚨 DANGER SIGNS (check if present)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
                    {dangerSigns.map(s => (
                        <label key={s.code} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={selectedSymptoms.includes(s.code)}
                                onChange={() => toggleSymptom(s.code)}
                            />
                            <span>{s.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Fever symptoms */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '12px' }}>🌡️ Fever-Related Symptoms</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
                    {generalSymptoms.map(s => (
                        <label key={s.code} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={selectedSymptoms.includes(s.code)}
                                onChange={() => toggleSymptom(s.code)}
                            />
                            <span>{s.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Other symptoms */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '12px' }}>📝 Other Symptoms</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
                    {otherSymptoms.map(s => (
                        <label key={s.code} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={selectedSymptoms.includes(s.code)}
                                onChange={() => toggleSymptom(s.code)}
                            />
                            <span>{s.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <label>Additional Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    placeholder="Any other clinical observations..."
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={loading || !selectedPatient || selectedSymptoms.length === 0}
                style={{
                    width: '100%',
                    background: '#0f2b3d',
                    color: 'white',
                    padding: '14px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'wait' : 'pointer'
                }}
            >
                {loading ? 'Analyzing...' : '🔍 Analyze Symptoms'}
            </button>
        </div>
    );
};

export default SymptomChecker;