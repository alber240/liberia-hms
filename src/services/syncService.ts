import { db } from '../db/database';
import { supabase } from '../lib/supabase';

export class SyncService {
    private isSyncing = false;
    private intervalId: number | null = null;

    constructor() {
        window.addEventListener('online', () => this.syncAll());
    }

    async syncAll(): Promise<void> {
        if (this.isSyncing || !navigator.onLine) return;

        this.isSyncing = true;
        console.log('🔄 Starting sync...');

        try {
            const unsyncedPatients = await db.patients.where('synced').equals(0).toArray();

            if (unsyncedPatients.length === 0) {
                console.log('✅ No pending patients to sync');
                return;
            }

            console.log(`📤 Syncing ${unsyncedPatients.length} patients...`);

            for (const patient of unsyncedPatients) {
                try {
                    const { error } = await supabase
                        .from('patients')
                        .upsert({
                            uhid: patient.uhid,
                            full_name: patient.fullName,
                            date_of_birth: patient.dateOfBirth,
                            gender: patient.gender,
                            phone: patient.phone,
                            alternate_phone: patient.alternatePhone,
                            address: patient.address,
                            emergency_contact: patient.emergencyContact,
                            emergency_phone: patient.emergencyPhone,
                            registration_date: patient.registrationDate,
                            synced: true
                        }, { onConflict: 'uhid' });

                    if (error) throw error;

                    await db.patients.update(patient.uhid, { synced: 1 });
                    console.log(`✅ Synced: ${patient.fullName} (${patient.uhid})`);

                } catch (err) {
                    console.error(`❌ Failed to sync ${patient.uhid}:`, err);
                }
            }

            console.log('🎉 Sync completed!');

        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    startAutoSync(): void {
        if (this.intervalId) return;

        if (navigator.onLine) {
            setTimeout(() => this.syncAll(), 1000);
        }

        this.intervalId = window.setInterval(() => {
            if (navigator.onLine) {
                this.syncAll();
            }
        }, 30000);

        console.log('⏰ Auto-sync started (every 30 seconds)');
    }

    stopAutoSync(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('⏹️ Auto-sync stopped');
        }
    }
}

export const syncService = new SyncService();
