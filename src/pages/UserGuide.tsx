import React, { useState } from 'react';
import FeedbackForm from '../components/FeedbackForm';

const UserGuide: React.FC = () => {
    const [activeSection, setActiveSection] = useState('welcome');

    const sections = [
        { id: 'welcome', label: '👋 Welcome' },
        { id: 'getting-started', label: '🚀 Getting Started' },
        { id: 'prediction', label: '🧠 Prediction Engine' },
        { id: 'modules', label: '📦 Modules' },
        { id: 'feedback', label: '📝 Feedback' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>
                📚 Help & User Guide
            </h1>

            {/* Sub-navigation */}
            <div style={{ background: 'white', borderBottom: '1px solid #cbd5e1', padding: '0 24px', display: 'flex', gap: '24px', marginBottom: '24px', overflowX: 'auto' }}>
                {sections.map(s => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeSection === s.id ? 'bold' : 'normal', borderBottom: activeSection === s.id ? '3px solid #0f2b3d' : 'none' }}>
                        {s.label}
                    </button>
                ))}
            </div>

            {activeSection === 'welcome' && <WelcomeSection />}
            {activeSection === 'getting-started' && <GettingStartedSection />}
            {activeSection === 'prediction' && <PredictionSection />}
            {activeSection === 'modules' && <ModulesSection />}
            {activeSection === 'feedback' && <FeedbackForm />}
        </div>
    );
};

const WelcomeSection: React.FC = () => (
    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', lineHeight: '1.8' }}>
        <h2>👋 Welcome to LiberiaHMS</h2>
        <p><strong>LiberiaHMS</strong> is an offline-first Hospital Management System and Clinical Decision Support tool designed specifically for rural clinics and small hospitals in Liberia and West Africa.</p>

        <h3 style={{ marginTop: '24px' }}>🎯 What You Can Do</h3>
        <ul>
            <li>✅ Register patients offline</li>
            <li>✅ Schedule appointments</li>
            <li>✅ Manage pharmacy inventory</li>
            <li>✅ Order and track lab tests</li>
            <li>✅ Create invoices (USD + LRD)</li>
            <li>✅ Write clinical notes (SOAP)</li>
            <li>✅ Record vital signs</li>
            <li>✅ Track beds and admissions</li>
            <li>✅ <strong>Get clinical decision support based on symptoms</strong></li>
        </ul>

        <h3 style={{ marginTop: '24px' }}>🔑 Demo Login Credentials</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Password</th>
                </tr>
            </thead>
            <tbody>
                <tr><td style={{ padding: '12px' }}>Admin</td><td style={{ padding: '12px' }}>admin</td><td style={{ padding: '12px' }}>admin123</td></tr>
                <tr><td style={{ padding: '12px' }}>Doctor</td><td style={{ padding: '12px' }}>doctor</td><td style={{ padding: '12px' }}>doctor123</td></tr>
                <tr><td style={{ padding: '12px' }}>Nurse</td><td style={{ padding: '12px' }}>nurse</td><td style={{ padding: '12px' }}>nurse123</td></tr>
                <tr><td style={{ padding: '12px' }}>Receptionist</td><td style={{ padding: '12px' }}>receptionist</td><td style={{ padding: '12px' }}>reception123</td></tr>
            </tbody>
        </table>
    </div>
);

const GettingStartedSection: React.FC = () => (
    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', lineHeight: '1.8' }}>
        <h2>🚀 Getting Started</h2>

        <h3>Step 1: Login</h3>
        <p>Choose your role and login with the credentials provided. If you're new, your admin will give you a temporary password — you must change it on first login.</p>

        <h3>Step 2: Register Patients</h3>
        <p>Click <strong>📝 Patients</strong>. Fill in the form and click <strong>Register Patient</strong>. Each patient gets a unique UHID (e.g., LR-2026-12345).</p>

        <h3>Step 3: Use the Prediction Engine</h3>
        <p>Click <strong>🧠 Prediction</strong>. Select a patient, check their symptoms, and click <strong>Analyze</strong>. The system will suggest possible conditions and actions.</p>

        <h3>Step 4: Offline Mode</h3>
        <p>LiberiaHMS works <strong>completely offline</strong>. Register patients, book appointments, dispense drugs — all without internet. Data syncs automatically when you reconnect.</p>
    </div>
);

const PredictionSection: React.FC = () => (
    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', lineHeight: '1.8' }}>
        <h2>🧠 Clinical Prediction Engine</h2>

        <h3>How It Works</h3>
        <p>The Prediction Engine uses a <strong>3-tier clinical decision support system</strong>:</p>

        <h4 style={{ marginTop: '16px' }}>🔴 Tier 1 — Emergency</h4>
        <p>Danger signs detected. <strong>Immediate action required.</strong></p>
        <p>Example: Fever + Convulsions → Refer NOW</p>

        <h4 style={{ marginTop: '16px' }}>🟡 Tier 2 — Common Conditions</h4>
        <p>Standard treatment protocols apply.</p>
        <p>Example: Fever + Headache → Likely Malaria → Test and treat</p>

        <h4 style={{ marginTop: '16px' }}>🟠 Tier 3 — Dangerous Possibilities</h4>
        <p>Take precautions. Escalate if needed.</p>
        <p>Example: Fever + Sore throat + No malaria response → Possible Lassa Fever</p>

        <h3 style={{ marginTop: '24px' }}>How to Use</h3>
        <ol>
            <li>Click <strong>🧠 Prediction</strong></li>
            <li>Select a patient from the dropdown</li>
            <li>Enter age and temperature</li>
            <li>Check all relevant symptoms</li>
            <li>Click <strong>Analyze Symptoms</strong></li>
        </ol>

        <h3>Understanding the Output</h3>
        <ul>
            <li><strong>Possible Conditions:</strong> Ranked by likelihood</li>
            <li><strong>Recommended Actions:</strong> What to do clinically</li>
            <li><strong>RETURN IMMEDIATELY IF:</strong> Red flags to watch</li>
            <li><strong>RETURN IN 24H IF:</strong> Urgent follow-up</li>
            <li><strong>RETURN IN 48H IF:</strong> Standard follow-up</li>
        </ul>

        <h3 style={{ marginTop: '24px' }}>Syndromes Covered</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Syndrome</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Conditions</th>
                </tr>
            </thead>
            <tbody>
                <tr><td style={{ padding: '12px' }}>Fever</td><td style={{ padding: '12px' }}>Malaria, Lassa, Meningitis, Measles, Typhoid, Dengue, Neonatal</td></tr>
                <tr><td style={{ padding: '12px' }}>Respiratory</td><td style={{ padding: '12px' }}>Pneumonia, TB, COVID-19, Bronchitis, Asthma, Pertussis</td></tr>
                <tr><td style={{ padding: '12px' }}>Diarrheal</td><td style={{ padding: '12px' }}>Cholera, Dysentery, Child diarrhea, Malnutrition</td></tr>
            </tbody>
        </table>
    </div>
);

const ModulesSection: React.FC = () => (
    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', lineHeight: '1.8' }}>
        <h2>📦 System Modules</h2>

        <h3>🧠 Prediction Engine</h3>
        <p>Clinical decision support based on symptoms.</p>

        <h3>📝 Patient Registration</h3>
        <p>Register patients with UHID. Works offline.</p>

        <h3>📅 Appointments</h3>
        <p>Book, reschedule, and track appointments. Doctor schedules supported.</p>

        <h3>💊 Pharmacy</h3>
        <p>Track drug inventory, expiry dates, and dispense medications.</p>

        <h3>🔬 Laboratory</h3>
        <p>Order tests, enter results, flag abnormal values.</p>

        <h3>💰 Billing</h3>
        <p>Create invoices in USD or LRD. Process payments. Generate reports.</p>

        <h3>📋 EMR (SOAP Notes)</h3>
        <p>Document clinical encounters in SOAP format.</p>

        <h3>🩺 Vital Signs</h3>
        <p>Record BP, pulse, temperature, SpO2, weight, BMI.</p>

        <h3>🛏️ Beds</h3>
        <p>Track bed occupancy, admissions, discharges.</p>

        <h3>🔄 Referral & Transfer</h3>
        <p>Refer patients to other facilities. Track status.</p>

        <h3>👥 Staff Management</h3>
        <p>Add staff, assign roles, manage permissions.</p>

        <h3>💰 Payroll</h3>
        <p>Process salaries, add allowances/deductions, generate payslips.</p>
    </div>
);

export default UserGuide;