import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, Doctor } from '../db/database';

const DoctorScheduleManager: React.FC = () => {
    const { t } = useTranslation();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [editing, setEditing] = useState(false);

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        const docs = await db.getAllDoctors();
        // Ensure all doctors have schedule object
        const docsWithSchedule = docs.map(doc => ({
            ...doc,
            schedule: doc.schedule || {
                monday: { start: "09:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                tuesday: { start: "09:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                wednesday: { start: "09:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                thursday: { start: "09:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                friday: { start: "09:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                saturday: { start: "09:00", end: "13:00", breakStart: undefined, breakEnd: undefined },
                sunday: null
            }
        }));
        setDoctors(docsWithSchedule);
    };

    const handleScheduleChange = (day: string, field: string, value: string) => {
        if (!selectedDoctor) return;
        
        const updatedSchedule = { ...selectedDoctor.schedule };
        const currentDay = updatedSchedule[day as keyof typeof updatedSchedule];
        
        if (value === 'off') {
            updatedSchedule[day as keyof typeof updatedSchedule] = null;
        } else {
            if (!currentDay) {
                updatedSchedule[day as keyof typeof updatedSchedule] = {
                    start: '09:00',
                    end: '17:00',
                    breakStart: '12:00',
                    breakEnd: '13:00'
                };
            }
            const daySchedule = updatedSchedule[day as keyof typeof updatedSchedule];
            if (daySchedule) {
                (daySchedule as any)[field] = value;
            }
        }
        
        setSelectedDoctor({ ...selectedDoctor, schedule: updatedSchedule });
    };

    const saveSchedule = async () => {
        if (selectedDoctor) {
            await db.updateDoctorSchedule(selectedDoctor.id, selectedDoctor.schedule);
            setEditing(false);
            await loadDoctors();
            alert('Schedule saved successfully!');
        }
    };

    // Helper to safely get schedule or default
    const getDaySchedule = (day: string) => {
        if (!selectedDoctor || !selectedDoctor.schedule) return null;
        return selectedDoctor.schedule[day as keyof typeof selectedDoctor.schedule];
    };

    return (
        <div>
            <h3>{t('doctor.scheduleManagement') || 'Doctor Schedule Management'}</h3>
            
            <div style={{ marginBottom: '20px' }}>
                <label>{t('doctor.selectDoctor') || 'Select Doctor'}</label>
                <select
                    value={selectedDoctor?.id || ''}
                    onChange={(e) => {
                        const doctor = doctors.find(d => d.id === e.target.value);
                        setSelectedDoctor(doctor || null);
                        setEditing(false);
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
                    ))}
                </select>
            </div>
            
            {selectedDoctor && selectedDoctor.schedule && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <h4>{selectedDoctor.name}</h4>
                        {!editing ? (
                            <button onClick={() => setEditing(true)} style={{ background: '#0f2b3d', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                ✏️ {t('common.edit') || 'Edit'}
                            </button>
                        ) : (
                            <button onClick={saveSchedule} style={{ background: '#10b981', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                💾 {t('common.save') || 'Save'}
                            </button>
                        )}
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('doctor.day') || 'Day'}</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('doctor.status') || 'Status'}</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('doctor.start') || 'Start Time'}</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('doctor.end') || 'End Time'}</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('doctor.breakStart') || 'Break Start'}</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('doctor.breakEnd') || 'Break End'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {days.map(day => {
                                    const schedule = getDaySchedule(day);
                                    return (
                                        <tr key={day} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '12px' }}>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                                            <td style={{ padding: '12px' }}>
                                                {editing ? (
                                                    <select
                                                        value={schedule ? 'working' : 'off'}
                                                        onChange={(e) => handleScheduleChange(day, 'status', e.target.value)}
                                                        style={{ padding: '6px', borderRadius: '6px' }}
                                                    >
                                                        <option value="working">Working</option>
                                                        <option value="off">Day Off</option>
                                                    </select>
                                                ) : (
                                                    schedule ? '✅ Working' : '❌ Day Off'
                                                )}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {editing && schedule ? (
                                                    <input
                                                        type="time"
                                                        value={schedule.start || '09:00'}
                                                        onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                                                        style={{ padding: '6px', borderRadius: '6px' }}
                                                    />
                                                ) : (schedule?.start || '—')}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {editing && schedule ? (
                                                    <input
                                                        type="time"
                                                        value={schedule.end || '17:00'}
                                                        onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                                                        style={{ padding: '6px', borderRadius: '6px' }}
                                                    />
                                                ) : (schedule?.end || '—')}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {editing && schedule ? (
                                                    <input
                                                        type="time"
                                                        value={schedule.breakStart || ''}
                                                        onChange={(e) => handleScheduleChange(day, 'breakStart', e.target.value)}
                                                        style={{ padding: '6px', borderRadius: '6px' }}
                                                    />
                                                ) : (schedule?.breakStart || '—')}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {editing && schedule ? (
                                                    <input
                                                        type="time"
                                                        value={schedule.breakEnd || ''}
                                                        onChange={(e) => handleScheduleChange(day, 'breakEnd', e.target.value)}
                                                        style={{ padding: '6px', borderRadius: '6px' }}
                                                    />
                                                ) : (schedule?.breakEnd || '—')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style={{ marginTop: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '8px', fontSize: '0.85rem' }}>
                        ⏰ {t('doctor.appointmentDuration') || 'Appointment Duration'}: {selectedDoctor.appointmentDuration || 30} minutes
                        <br />
                        📅 {t('doctor.maxAppointments') || 'Max Appointments per Day'}: {selectedDoctor.maxAppointmentsPerDay || 20}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorScheduleManager;
