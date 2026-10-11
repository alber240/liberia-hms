import React, { useState } from 'react';

const FeedbackForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        organization: '',
        email: '',
        phone: '',
        rating: 5,
        clinicalAccuracy: '',
        whatWorked: '',
        whatToImprove: '',
        missingFeatures: '',
        wouldUse: '',
        otherComments: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Send email via mailto link (simple method)
        const subject = `LiberiaHMS Feedback from ${formData.name} (${formData.role})`;
        const body = `
Name: ${formData.name}
Role: ${formData.role}
Organization: ${formData.organization}
Email: ${formData.email}
Phone: ${formData.phone}

Overall Rating: ${formData.rating}/10

Clinical Accuracy:
${formData.clinicalAccuracy}

What Worked Well:
${formData.whatWorked}

What to Improve:
${formData.whatToImprove}

Missing Features:
${formData.missingFeatures}

Would Use in Practice:
${formData.wouldUse}

Other Comments:
${formData.otherComments}
        `.trim();

        const mailtoLink = `mailto:allen.tech-africa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
        }, 1000);
    };

    if (submitted) {
        return (
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
                <h2 style={{ color: '#10b981' }}>✅ Thank You!</h2>
                <p>Your feedback has been prepared and sent to our email.</p>
                <p style={{ marginTop: '16px' }}>Your review will directly shape the future of LiberiaHMS.</p>
                <p style={{ marginTop: '24px', fontWeight: 'bold' }}>— Albert A. Allen, Developer</p>
            </div>
        );
    }

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
            <h2>📝 Send Feedback</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Your review will be sent to <strong>allen.tech-africa@gmail.com</strong>. Please be honest — your feedback shapes the system.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label>Full Name *</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                        <label>Role *</label>
                        <select name="role" required value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <option value="">Select Role</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Midwife">Midwife</option>
                            <option value="Community Health Worker">Community Health Worker</option>
                            <option value="BLS/First Aid Lecturer">BLS/First Aid Lecturer</option>
                            <option value="Medical Student">Medical Student</option>
                            <option value="Nursing Student">Nursing Student</option>
                            <option value="Public Health Officer">Public Health Officer</option>
                            <option value="Hospital Administrator">Hospital Administrator</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label>Organization / Facility</label>
                        <input type="text" name="organization" value={formData.organization} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                        <label>Email *</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                        <label>Phone (Optional)</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                        <label>Overall Rating (1-10) *</label>
                        <input type="number" name="rating" min="1" max="10" value={formData.rating} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>Is the clinical logic accurate? If not, what's wrong? *</label>
                    <textarea name="clinicalAccuracy" required value={formData.clinicalAccuracy} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="e.g., 'The malaria rule is correct, but the dengue rule needs adjustment'" />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>What worked well?</label>
                    <textarea name="whatWorked" value={formData.whatWorked} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>What should be improved?</label>
                    <textarea name="whatToImprove" value={formData.whatToImprove} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>What rules or symptoms are MISSING?</label>
                    <textarea name="missingFeatures" value={formData.missingFeatures} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="e.g., 'You should add malaria in pregnancy protocol'" />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>Would you use this in your practice? Why or why not?</label>
                    <textarea name="wouldUse" value={formData.wouldUse} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label>Other Comments</label>
                    <textarea name="otherComments" value={formData.otherComments} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>

                <button type="submit" disabled={loading} style={{ background: '#0f2b3d', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                    {loading ? 'Sending...' : '📧 Send Feedback to Developer'}
                </button>

                <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#6b7280' }}>
                    Your feedback goes directly to <strong>allen.tech-africa@gmail.com</strong>. Thank you for your time.
                </p>
            </form>
        </div>
    );
};

export default FeedbackForm;