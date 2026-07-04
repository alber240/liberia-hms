import React, { useState, useEffect } from 'react';
import { db, Patient } from '../db/database';

const PatientMedicalReport: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [medicalData, setMedicalData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        const allPatients = await db.getAllPatients();
        setPatients(allPatients);
    };

    const loadMedicalHistory = async () => {
        if (!selectedPatient) return;
        setLoading(true);
        
        const patient = patients.find(p => p.uhid === selectedPatient);
        const soapNotes = await db.soapNotes.where('patientUhid').equals(selectedPatient).toArray();
        const vitals = await db.vitalSigns.where('patientUhid').equals(selectedPatient).toArray();
        const prescriptions = await db.dispensingRecords.where('patientUhid').equals(selectedPatient).toArray();
        const labOrders = await db.labOrders.where('patientUhid').equals(selectedPatient).toArray();
        const invoices = await db.invoices.where('patientUhid').equals(selectedPatient).toArray();
        
        setMedicalData({
            patient,
            soapNotes,
            vitals,
            prescriptions,
            labOrders,
            invoices
        });
        setLoading(false);
    };

    const printReport = () => {
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
            <html>
            <head><title>Medical Report - ${medicalData?.patient?.fullName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; border-bottom: 2px solid #0f2b3d; padding-bottom: 20px; }
                .section { margin: 20px 0; page-break-inside: avoid; }
                .section-title { background: #0f2b3d; color: white; padding: 10px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #f1f5f9; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
            </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏥 LiberiaHMS</h1>
                    <h2>Patient Medical History Report</h2>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="section">
                    <h3 class="section-title">Patient Information</h3>
                    <table>
                        <tr><th>UHID</th><td>${medicalData.patient.uhid}</td><th>Name</th><td>${medicalData.patient.fullName}</td></tr>
                        <tr><th>Date of Birth</th><td>${medicalData.patient.dateOfBirth}</td><th>Gender</th><td>${medicalData.patient.gender}</td></tr>
                        <tr><th>Phone</th><td>${medicalData.patient.phone}</td><th>Email</th><td>${medicalData.patient.email || 'N/A'}</td></tr>
                        <tr><th>Address</th><td colspan="3">${medicalData.patient.address}</td></tr>
                    </table>
                </div>
                
                <div class="section">
                    <h3 class="section-title">Clinical Notes (SOAP)</h3>
                    ${medicalData.soapNotes.map((note: any) => `
                        <div style="border:1px solid #ddd; margin:10px 0; padding:10px">
                            <strong>Date:</strong> ${new Date(note.date).toLocaleDateString()}<br>
                            <strong>Doctor:</strong> ${note.doctorName}<br>
                            <strong>S:</strong> ${note.subjective}<br>
                            <strong>O:</strong> ${note.objective}<br>
                            <strong>A:</strong> ${note.assessment}<br>
                            <strong>P:</strong> ${note.plan}
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h3 class="section-title">Vital Signs History</h3>
                    <table>
                        <tr><th>Date</th><th>BP</th><th>Pulse</th><th>Temp</th><th>Weight</th><th>BMI</th></tr>
                        ${medicalData.vitals.map((v: any) => `
                            <tr>
                                <td>${new Date(v.recordedAt).toLocaleDateString()}</td>
                                <td>${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}</td>
                                <td>${v.pulse}</td>
                                <td>${v.temperature}°C</td>
                                <td>${v.weight}kg</td>
                                <td>${v.bmi}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                
                <div class="section">
                    <h3 class="section-title">Prescriptions & Dispensed Medications</h3>
                    <table>
                        <tr><th>Date</th><th>Medication</th><th>Quantity</th><th>Batch</th></tr>
                        ${medicalData.prescriptions.map((p: any) => `
                            <tr>
                                <td>${new Date(p.dispensedAt).toLocaleDateString()}</td>
                                <td>${p.drugName}</td>
                                <td>${p.quantity}</td>
                                <td>${p.batchNumber}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                
                <div class="footer">
                    <p>This is an official medical record. Please keep confidential.</p>
                    <p>LiberiaHMS - Hospital Management System</p>
                </div>
            </body>
            </html>
        `);
        printWindow?.document.close();
        printWindow?.print();
    };

    return (
        <div>
            <h3>📄 Patient Medical History Report</h3>
            <div style={{ marginBottom: '20px' }}>
                <label>Select Patient</label>
                <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p.uhid} value={p.uhid}>{p.fullName} ({p.uhid})</option>)}
                </select>
            </div>
            
            <button onClick={loadMedicalHistory} disabled={!selectedPatient || loading} style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                {loading ? 'Loading...' : 'Generate Report'}
            </button>
            
            {medicalData && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={printReport} style={{ background: '#10b981', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '10px' }}>
                        🖨️ Print / PDF Report
                    </button>
                    
                    <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                        <p><strong>Patient:</strong> {medicalData.patient.fullName} ({medicalData.patient.uhid})</p>
                        <p><strong>Total Visits:</strong> {medicalData.soapNotes.length}</p>
                        <p><strong>Total Prescriptions:</strong> {medicalData.prescriptions.length}</p>
                        <p><strong>Total Lab Tests:</strong> {medicalData.labOrders.length}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientMedicalReport;
