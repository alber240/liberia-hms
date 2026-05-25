import { db } from '../db/database';

export class ReminderService {
    private intervalId: number | null = null;

    startReminderChecker(): void {
        if (this.intervalId) return;
        
        // Check for reminders every hour
        this.intervalId = window.setInterval(() => {
            this.checkAndSendReminders();
        }, 3600000); // Every hour
        
        // Also check on app start
        setTimeout(() => this.checkAndSendReminders(), 5000);
        
        console.log('🔔 Reminder service started - checking every hour');
    }

    stopReminderChecker(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('🔔 Reminder service stopped');
        }
    }

    async checkAndSendReminders(): Promise<void> {
        console.log('🔍 Checking for appointments needing reminders...');
        
        try {
            // Get appointments for tomorrow that haven't had reminders sent
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            const appointments = await db.appointments
                .where('date')
                .equals(tomorrowStr)
                .and(a => !a.reminderSent && a.status === 'scheduled')
                .toArray();
            
            if (appointments.length === 0) {
                console.log('✅ No pending reminders');
                return;
            }
            
            console.log(`📨 Sending ${appointments.length} reminders...`);
            
            for (const appointment of appointments) {
                await this.sendReminder(appointment);
                // Mark reminder as sent
                await db.appointments.update(appointment.id!, { 
                    reminderSent: true, 
                    reminderSentAt: new Date().toISOString(),
                    synced: 0 
                });
            }
            
            console.log('✅ Reminders sent!');
        } catch (error) {
            console.error('Error checking reminders:', error);
        }
    }

    private async sendReminder(appointment: any): Promise<void> {
        // SMS Reminder (would integrate with Twilio in production)
        if (appointment.patientPhone) {
            console.log(`📱 SMS reminder would be sent to ${appointment.patientPhone}`);
            console.log(`   Message: "Reminder: Your appointment with Dr. ${appointment.doctorName} is tomorrow at ${appointment.time}. Reply CONFIRM to confirm."`);
        }
        
        // Email Reminder
        if (appointment.patientEmail) {
            console.log(`📧 Email reminder would be sent to ${appointment.patientEmail}`);
            console.log(`   Subject: Appointment Reminder - Tomorrow at ${appointment.time}`);
            console.log(`   Body: Dear ${appointment.patientName},\n\nThis is a reminder of your appointment with Dr. ${appointment.doctorName} tomorrow at ${appointment.time}.\n\nPlease arrive 15 minutes early.\n\nLiberiaHMS`);
        }
        
        // Store reminder log locally for demo
        const reminderLog = {
            appointmentId: appointment.id,
            patientPhone: appointment.patientPhone,
            patientEmail: appointment.patientEmail,
            sentAt: new Date().toISOString(),
            method: appointment.patientPhone && appointment.patientEmail ? 'both' : (appointment.patientPhone ? 'sms' : (appointment.patientEmail ? 'email' : 'none'))
        };
        
        console.log('📝 Reminder log:', reminderLog);
    }

    // Manual trigger for testing
    async sendManualReminder(appointmentId: number): Promise<void> {
        try {
            const appointment = await db.appointments.get(appointmentId);
            if (appointment) {
                await this.sendReminder(appointment);
            } else {
                console.log('Appointment not found');
            }
        } catch (error) {
            console.error('Error sending manual reminder:', error);
        }
    }
}

export const reminderService = new ReminderService();
