import React from 'react';
import { useTranslation } from 'react-i18next';
import AppointmentCalendar from '../components/AppointmentCalendar';

const Appointments: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>{t('appointment.title')}</h1>
            <AppointmentCalendar />
        </div>
    );
};

export default Appointments;
