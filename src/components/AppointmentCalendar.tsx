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

    // ✅ SAFE LOAD DOCTORS - no duplicates
    const loadDoctors = async () => {
    try {
        // Just load existing doctors, no auto-creation here
        const docs = await db.doctors.toArray();
        
        if (docs.length === 0) {
            // Create defaults ONE TIME
            const defaultDoctors = [
                { id: "doc1", name: "Dr. John Williams", specialty: "General Medicine", phone: "0888123456", email: "john@hospital.com", schedule: {}, appointmentDuration: 30, maxAppointmentsPerDay: 20, synced: 1 },
                { id: "doc2", name: "Dr. Sarah Johnson", specialty: "Pediatrics", phone: "0888123457", email: "sarah@hospital.com", schedule: {}, appointmentDuration: 30, maxAppointmentsPerDay: 18, synced: 1 },
                { id: "doc3", name: "Dr. Michael Brown", specialty: "Cardiology", phone: "0888123458", email: "michael@hospital.com", schedule: {}, appointmentDuration: 45, maxAppointmentsPerDay: 12, synced: 1 },
                { id: "doc4", name: "Dr. Patricia Davis", specialty: "Obstetrics and Gynecology", phone: "0888123459", email: "patricia@hospital.com", schedule: {}, appointmentDuration: 30, maxAppointmentsPerDay: 16, synced: 1 }
            ];
            
            for (const doctor of defaultDoctors) {
                try {
                    const existing = await db.doctors.get(doctor.id);
                    if (!existing) {
                        await db.doctors.add(doctor);
                    }
                } catch (err) {
                    // Ignore - another render already added it
                    console.log(`Doctor ${doctor.id} already added`);
                }
            }
            
            const updatedDocs = await db.doctors.toArray();
            setDoctors(updatedDocs);
        } else {
            setDoctors(docs);
        }
    } catch (error) {
        console.error("Error loading doctors:", error);
    }
};

    const loadAppointments = async () => {
        try {
            const apps = await db.getAppointmentsByDate(selectedDate);
            setAppointments(apps);
        } catch (error) {
            console.error("Error loading appointments:", error);
            setAppointments([]);
        }
    };

    const loadPatients = async () => {
        try {
            const pts = await db.getAllPatients();
            setPatients(pts);
        } catch (error) {
            console.error("Error loading patients:", error);
            setPatients([]);
        }
    };

    const loadAvailableTimeSlots = async () => {
        try {
            const slots = await db.getAvailableTimeSlots(formData.doctorId, selectedDate);
            setAvailableTimeSlots(slots);
            if (slots.length > 0 && !formData.time) {
                setFormData(prev => ({ ...prev, time: slots[0] }));
            }
        } catch (error) {
            console.error("Error loading time slots:", error);
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
                        📅 Manage Schedule
                    </button>
                    <button
                        onClick={() => setShowBookingForm(!showBookingForm)}
                        style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        + Book Appointment
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
                    <h3>Book New Appointment</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label>Select Patient *</label>
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
                            <label>Select Doctor *</label>
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
                            <label>Time *</label>
                            <select
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            >
                                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Purpose</label>
                            <input
                                type="text"
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label>Notes</label>
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
                            Book Appointment
                        </button>
                        <button type="button" onClick={() => setShowBookingForm(false)} style={{ background: '#e2e8f0', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f1f5f9' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Patient</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Doctor</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Purpose</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(slot => {
                            const appt = appointments.find(a => a.time === slot);
                            return (
                                <tr key={slot} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{slot}</td>
                                    <td style={{ padding: '12px' }}>{appt?.patientName || '—'}</td>
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
                                                <option value="scheduled">Scheduled</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="no-show">No-Show</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentCalendar;