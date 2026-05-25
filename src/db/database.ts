import Dexie, { Table } from "dexie";

export interface Patient {
    uhid: string;
    fullName: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    phone: string;
    alternatePhone?: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
    registrationDate: string;
    synced: number;
}

export interface SyncQueue {
    id?: number;
    operation: "CREATE" | "UPDATE" | "DELETE";
    table: string;
    data: any;
    timestamp: number;
}

class LiberiaHMSDatabase extends Dexie {
    patients!: Table<Patient, string>;
    syncQueue!: Table<SyncQueue, number>;

    constructor() {
        super("LiberiaHMSDB");
        this.version(1).stores({
            // Define all indexes here
            patients: "uhid, fullName, phone, registrationDate, synced",
            syncQueue: "++id, operation, timestamp",
        });
    }

    generateUHID(): string {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
        return `LR-${year}-${random}`;
    }

    async checkDuplicate(patient: Partial<Patient>): Promise<Patient | null> {
        const { phone, fullName, dateOfBirth } = patient;
        
        // Check by phone number
        if (phone) {
            const existing = await this.patients.where("phone").equals(phone).first();
            if (existing) return existing;
        }
        
        // Check by name + date of birth (using manual filter since compound index is complex)
        if (fullName && dateOfBirth) {
            const existing = await this.patients
                .where("fullName")
                .equals(fullName)
                .filter((p) => p.dateOfBirth === dateOfBirth)
                .first();
            if (existing) return existing;
        }
        return null;
    }

    async addPatient(patient: Omit<Patient, "uhid" | "registrationDate" | "synced">): Promise<Patient> {
        const uhid = this.generateUHID();
        const newPatient: Patient = {
            ...patient,
            uhid,
            registrationDate: new Date().toISOString(),
            synced: 0,
        };
        
        // Add to patients table
        await this.patients.add(newPatient);

        // Add to sync queue for later cloud sync
        await this.syncQueue.add({
            operation: "CREATE",
            table: "patients",
            data: newPatient,
            timestamp: Date.now(),
        });

        return newPatient;
    }

    async getAllPatients(): Promise<Patient[]> {
        return await this.patients.orderBy("registrationDate").reverse().toArray();
    }

    async getUnsyncedCount(): Promise<number> {
        return await this.patients.where("synced").equals(0).count();
    }
}

// Delete old database to apply new schema
export async function resetDatabase() {
    try {
        await db.delete();
        window.location.reload();
    } catch (error) {
        console.error("Error resetting database:", error);
    }
}

export const db = new LiberiaHMSDatabase();
