import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DoctorScheduleManager from "./DoctorScheduleManager";
import { db, Appointment, Doctor } from '../db/database';

interface AppointmentCalendarProps {
    onSelectAppointment?: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ onSelectAppointment }) => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showScheduleManager, setShowScheduleManager] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        patientUhid: '',
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        doctorId: '',
        doctorName: '',
        time: '09:00',
        duration: 30,
        purpose: '',
        notes: '',
        isRecurring: false,
        recurringPattern: 'weekly' as 'daily' | 'weekly' | 'monthly',
        recurringEndDate: ''
    });

    useEffect(() => {
        loadAppointments();
        loadDoctors();
        loadPatients();
    }, [selectedDate]);

    useEffect(() => {
        if (formData.doctorId && selectedDate) {
            loadAvailableTimeSlots();
        }
    }, [formData.doctorId, selectedDate, appointments]);

    const loadAppointments = async () => {
        const apps = await db.getAppointmentsByDate(selectedDate);
        setAppointments(apps);
    };

    const loadDoctors = async () => {
        const docs = await db.getAllDoctors();
        setDoctors(docs);
    };

    const loadPatients = async () => {
        const pts = await db.getAllPatients();
        setPatients(pts);
    };

    const loadAvailableTimeSlots = async () => {
        const slots = await db.getAvailableTimeSlots(formData.doctorId, selectedDate);
        setAvailableTimeSlots(slots);
        if (slots.length > 0 && !formData.time) {
            setFormData(prev => ({ ...prev, time: slots[0] }));
        }
    };

    const handlePatientSelect = (uhid: string) => {
        const patient = patients.find(p => p.uhid === uhid);
        if (patient) {
            setFormData({
                ...formData,
                patientUhid: uhid,
                patientName: patient.fullName,
                patientPhone: patient.phone,
                patientEmail: patient.email || ''
            });
        }
    };

    const handleDoctorSelect = (id: string) => {
        const doctor = doctors.find(d => d.id === id);
        if (doctor) {
            setFormData({
                ...formData,
                doctorId: id,
                doctorName: doctor.name,
                duration: doctor.appointmentDuration
            });
        }
    };

    const handleBookAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const appointmentData = {
            patientUhid: formData.patientUhid,
            patientName: formData.patientName,
            patientPhone: formData.patientPhone,
            patientEmail: formData.patientEmail || undefined,
            doctorId: formData.doctorId,
            doctorName: formData.doctorName,
            date: selectedDate,
            time: formData.time,
            duration: formData.duration,
            purpose: formData.purpose,
            status: 'scheduled' as const,
            notes: formData.notes,
            isRecurring: formData.isRecurring,
            recurringPattern: formData.isRecurring ? formData.recurringPattern : undefined,
            recurringEndDate: formData.isRecurring ? formData.recurringEndDate : undefined,
            parentAppointmentId: undefined
        };
        
        const id = await db.addAppointment(appointmentData);
        
        // If recurring, create future appointments
        if (formData.isRecurring && formData.recurringEndDate) {
            const parentAppointment = { ...appointmentData, id };
            await db.createRecurringAppointments(parentAppointment as Appointment, formData.recurringEndDate);
        }
        
        setShowBookingForm(false);
        loadAppointments();
        setFormData({
            patientUhid: '', patientName: '', patientPhone: '', patientEmail: '',
            doctorId: '', doctorName: '', time: '09:00', duration: 30,
            purpose: '', notes: '', isRecurring: false, recurringPattern: 'weekly', recurringEndDate: ''
        });
        
        alert('Appointment booked successfully!');
    };

    const updateStatus = async (id: number, status: string) => {
        await db.updateAppointmentStatus(id, status as any);
        loadAppointments();
    };

    const timeSlots = availableTimeSlots.length > 0 ? availableTimeSlots : 
        ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setShowScheduleManager(!showScheduleManager)}
                        style={{ background: '#6b7280', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        ?? {t('doctor.manageSchedule')}
                    </button>
                    <button
                        onClick={() => setShowBookingForm(!showBookingForm)}
                        style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        + {t('appointment.book')}
                    </button>
                </div>
            </div>

            {showScheduleManager && (
                <div style={{ marginBottom: '20px' }}>
                    <DoctorScheduleManager />
                </div>
            )}

            {showBookingForm && (
                <form onSubmit={handleBookAppointment} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h3>{t('appointment.bookNew')}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label>{t('appointment.selectPatient')} *</label>
                            <select
                                required
                                value={formData.patientUhid}
                                onChange={(e) => handlePatientSelect(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="">Select Patient</option>
                                {patients.map(p => (
                                    <option key={p.uhid} value={p.uhid}>{p.fullName} ({p.uhid})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>{t('appointment.selectDoctor')} *</label>
                            <select
                                required
                                value={formData.doctorId}
                                onChange={(e) => handleDoctorSelect(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>{t('appointment.time')} *</label>
                            <select
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            >
                                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {availableTimeSlots.length === 0 && formData.doctorId && (
                                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>
                                    No available slots for this doctor on selected date
                                </p>
                            )}
                        </div>
                        <div>
                            <label>{t('appointment.purpose')}</label>
                            <input
                                type="text"
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.isRecurring}
                                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                                />
                                {' '}{t('appointment.recurring')}
                            </label>
                        </div>
                        {formData.isRecurring && (
                            <>
                                <div>
                                    <label>{t('appointment.recurringPattern')}</label>
                                    <select
                                        value={formData.recurringPattern}
                                        onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value as any })}
                                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                <div>
                                    <label>{t('appointment.recurringEndDate')}</label>
                                    <input
                                        type="date"
                                        required={formData.isRecurring}
                                        value={formData.recurringEndDate}
                                        onChange={(e) => setFormData({ ...formData, recurringEndDate: e.target.value })}
                                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label>{t('appointment.notes')}</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                rows={3}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button type="submit" style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            {t('appointment.book')}
                        </button>
                        <button type="button" onClick={() => setShowBookingForm(false)} style={{ background: '#e2e8f0', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            {t('common.cancel')}
                        </button>
                    </div>
                </form>
            )}

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f1f5f9' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left' }}>{t('appointment.time')}</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>{t('appointment.patient')}</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>{t('appointment.doctor')}</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>{t('appointment.purpose')}</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>{t('appointment.status')}</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(slot => {
                            const appt = appointments.find(a => a.time === slot);
                            return (
                                <tr key={slot} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{slot}</td>
                                    <td style={{ padding: '12px' }}>
                                        {appt?.patientName || '—'}
                                        {appt?.isRecurring && <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: '#e0e7ff', padding: '2px 6px', borderRadius: '12px' }}>?? Recurring</span>}
                                    </td>
                                    <td style={{ padding: '12px' }}>{appt?.doctorName || '—'}</td>
                                    <td style={{ padding: '12px' }}>{appt?.purpose || '—'}</td>
                                    <td style={{ padding: '12px' }}>
                                        {appt && (
                                            <select
                                                value={appt.status}
                                                onChange={(e) => updateStatus(appt.id!, e.target.value)}
                                                style={{
                                                    background: appt.status === 'scheduled' ? '#fef3c7' : appt.status === 'completed' ? '#d1fae5' : '#fee2e2',
                                                    color: appt.status === 'scheduled' ? '#92400e' : appt.status === 'completed' ? '#065f46' : '#991b1b',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="scheduled">{t('appointment.status_scheduled')}</option>
                                                <option value="completed">{t('appointment.status_completed')}</option>
                                                <option value="cancelled">{t('appointment.status_cancelled')}</option>
                                                <option value="no-show">{t('appointment.status_no-show')}</option>
                                            </select>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        {appt && (
                                            <button
                                                onClick={() => onSelectAppointment?.(appt)}
                                                style={{ background: '#6b7280', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}
                                            >
                                                {t('common.view')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
                ?? {t('appointment.reminderNote')} - SMS/Email reminders are checked hourly for next day's appointments
            </div>
        </div>
    );
};

export default AppointmentCalendar;
