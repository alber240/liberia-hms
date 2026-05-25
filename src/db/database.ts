import Dexie, { Table } from "dexie";

// Patient Interface
export interface Patient {
    uhid: string;
    fullName: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    phone: string;
    alternatePhone?: string;
    email?: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
    registrationDate: string;
    synced: number;
}

// Doctor Interface
export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    phone: string;
    email: string;
    schedule: {
        monday: { start: string; end: string; breakStart?: string; breakEnd?: string } | null;
        tuesday: { start: string; end: string; breakStart?: string; breakEnd?: string } | null;
        wednesday: { start: string; end: string; breakStart?: string; breakEnd?: string } | null;
        thursday: { start: string; end: string; breakStart?: string; breakEnd?: string } | null;
        friday: { start: string; end: string; breakStart?: string; breakEnd?: string } | null;
        saturday: { start: string; end: string; breakStart?: string; breakEnd?: string } | null;
        sunday: { start: string; end: string; breakStart?: string; breakEnd?: string } | null;
    };
    appointmentDuration: number;
    maxAppointmentsPerDay: number;
    synced: number;
}

// Appointment Interface
export interface Appointment {
    id?: number;
    patientUhid: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    doctorId: string;
    doctorName: string;
    date: string;
    time: string;
    duration: number;
    purpose: string;
    status: "scheduled" | "completed" | "cancelled" | "no-show";
    notes: string;
    reminderSent: boolean;
    reminderSentAt?: string;
    isRecurring: boolean;
    recurringPattern?: "daily" | "weekly" | "monthly";
    recurringEndDate?: string;
    parentAppointmentId?: number;
    createdAt: string;
    synced: number;
}

// Drug Interface
export interface Drug {
    id?: number;
    name: string;
    genericName: string;
    category: string;
    manufacturer: string;
    batchNumber: string;
    quantityInStock: number;
    unit: string;
    unitPrice: number;
    sellingPrice: number;
    expiryDate: string;
    reorderLevel: number;
    location: string;
    requiresPrescription: boolean;
    createdAt: string;
    updatedAt: string;
    synced: number;
}

// Prescription Interfaces
export interface Prescription {
    id?: number;
    patientUhid: string;
    patientName: string;
    doctorName: string;
    doctorId: string;
    date: string;
    status: "pending" | "dispensed" | "partially" | "cancelled";
    notes: string;
    synced: number;
}

export interface PrescriptionItem {
    id?: number;
    prescriptionId: number;
    drugId: number;
    drugName: string;
    quantity: number;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    dispensedQuantity: number;
    status: "pending" | "dispensed" | "partial";
    synced: number;
}

export interface DispensingRecord {
    id?: number;
    prescriptionId: number;
    patientUhid: string;
    patientName: string;
    drugId: number;
    drugName: string;
    quantity: number;
    dispensedBy: string;
    dispensedAt: string;
    batchNumber: string;
    expiryDate: string;
    notes: string;
    synced: number;
}

export interface Supplier {
    id?: number;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    leadTime: number;
    rating: number;
    synced: number;
}

export interface PurchaseOrder {
    id?: number;
    orderNumber: string;
    supplierId: number;
    supplierName: string;
    orderDate: string;
    expectedDelivery: string;
    status: "pending" | "approved" | "shipped" | "received" | "cancelled";
    totalAmount: number;
    notes: string;
    synced: number;
}

export interface PurchaseOrderItem {
    id?: number;
    orderId: number;
    drugId: number;
    drugName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    receivedQuantity: number;
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
    doctors!: Table<Doctor, string>;
    appointments!: Table<Appointment, number>;
    drugs!: Table<Drug, number>;
    prescriptions!: Table<Prescription, number>;
    prescriptionItems!: Table<PrescriptionItem, number>;
    dispensingRecords!: Table<DispensingRecord, number>;
    suppliers!: Table<Supplier, number>;
    purchaseOrders!: Table<PurchaseOrder, number>;
    purchaseOrderItems!: Table<PurchaseOrderItem, number>;
    syncQueue!: Table<SyncQueue, number>;

    constructor() {
        super("LiberiaHMSDB");
        this.version(5).stores({
            patients: "uhid, fullName, phone, registrationDate, synced",
            doctors: "id, name, specialty, synced",
            appointments: "++id, patientUhid, doctorId, date, time, status, reminderSent, isRecurring, parentAppointmentId, synced",
            drugs: "++id, name, genericName, category, batchNumber, expiryDate, quantityInStock, reorderLevel, synced",
            prescriptions: "++id, patientUhid, date, status, synced",
            prescriptionItems: "++id, prescriptionId, drugId, status, synced",
            dispensingRecords: "++id, prescriptionId, patientUhid, drugId, dispensedAt, synced",
            suppliers: "++id, name, phone, synced",
            purchaseOrders: "++id, orderNumber, supplierId, status, synced",
            purchaseOrderItems: "++id, orderId, drugId, synced",
            syncQueue: "++id, operation, timestamp",
        });
    }

    // Patient methods
    generateUHID(): string {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
        return `LR-${year}-${random}`;
    }

    async checkDuplicate(patient: Partial<Patient>): Promise<Patient | null> {
        const { phone, fullName, dateOfBirth } = patient;
        if (phone) {
            const existing = await this.patients.where("phone").equals(phone).first();
            if (existing) return existing;
        }
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
            email: patient.email || "",
            uhid,
            registrationDate: new Date().toISOString(),
            synced: 0,
        };
        await this.patients.add(newPatient);
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

    // Doctor methods
    async getAllDoctors(): Promise<Doctor[]> {
        let doctors = await this.doctors.toArray();
        if (doctors.length === 0) {
            const defaultDoctors: Doctor[] = [
                { 
                    id: "doc1", name: "Dr. John Williams", specialty: "General Medicine", phone: "0888123456", email: "john@hospital.com",
                    schedule: {
                        monday: { start: "08:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                        tuesday: { start: "08:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                        wednesday: { start: "08:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                        thursday: { start: "08:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                        friday: { start: "08:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
                        saturday: { start: "09:00", end: "13:00", breakStart: undefined, breakEnd: undefined },
                        sunday: null,
                    },
                    appointmentDuration: 30, maxAppointmentsPerDay: 20, synced: 1,
                },
                { 
                    id: "doc2", name: "Dr. Sarah Johnson", specialty: "Pediatrics", phone: "0888123457", email: "sarah@hospital.com",
                    schedule: {
                        monday: { start: "09:00", end: "18:00", breakStart: "13:00", breakEnd: "14:00" },
                        tuesday: { start: "09:00", end: "18:00", breakStart: "13:00", breakEnd: "14:00" },
                        wednesday: { start: "09:00", end: "18:00", breakStart: "13:00", breakEnd: "14:00" },
                        thursday: { start: "09:00", end: "18:00", breakStart: "13:00", breakEnd: "14:00" },
                        friday: { start: "09:00", end: "18:00", breakStart: "13:00", breakEnd: "14:00" },
                        saturday: { start: "09:00", end: "14:00", breakStart: undefined, breakEnd: undefined },
                        sunday: null,
                    },
                    appointmentDuration: 30, maxAppointmentsPerDay: 18, synced: 1,
                },
                { 
                    id: "doc3", name: "Dr. Michael Brown", specialty: "Cardiology", phone: "0888123458", email: "michael@hospital.com",
                    schedule: {
                        monday: { start: "08:00", end: "16:00", breakStart: "12:00", breakEnd: "13:00" },
                        tuesday: { start: "08:00", end: "16:00", breakStart: "12:00", breakEnd: "13:00" },
                        wednesday: { start: "08:00", end: "16:00", breakStart: "12:00", breakEnd: "13:00" },
                        thursday: { start: "08:00", end: "16:00", breakStart: "12:00", breakEnd: "13:00" },
                        friday: { start: "08:00", end: "16:00", breakStart: "12:00", breakEnd: "13:00" },
                        saturday: null, sunday: null,
                    },
                    appointmentDuration: 45, maxAppointmentsPerDay: 12, synced: 1,
                },
                { 
                    id: "doc4", name: "Dr. Patricia Davis", specialty: "Obstetrics & Gynecology", phone: "0888123459", email: "patricia@hospital.com",
                    schedule: {
                        monday: { start: "10:00", end: "19:00", breakStart: "14:00", breakEnd: "15:00" },
                        tuesday: { start: "10:00", end: "19:00", breakStart: "14:00", breakEnd: "15:00" },
                        wednesday: { start: "10:00", end: "19:00", breakStart: "14:00", breakEnd: "15:00" },
                        thursday: { start: "10:00", end: "19:00", breakStart: "14:00", breakEnd: "15:00" },
                        friday: { start: "10:00", end: "19:00", breakStart: "14:00", breakEnd: "15:00" },
                        saturday: { start: "09:00", end: "14:00", breakStart: undefined, breakEnd: undefined },
                        sunday: null,
                    },
                    appointmentDuration: 30, maxAppointmentsPerDay: 16, synced: 1,
                },
            ];
            await this.doctors.bulkAdd(defaultDoctors);
            doctors = defaultDoctors;
        }
        return doctors;
    }

    async updateDoctorSchedule(doctorId: string, schedule: Doctor["schedule"]): Promise<void> {
        await this.doctors.update(doctorId, { schedule, synced: 0 });
    }

    // Appointment methods
    async getAppointmentsByDate(date: string): Promise<Appointment[]> {
        return await this.appointments.where("date").equals(date).toArray();
    }

    async addAppointment(appointment: Omit<Appointment, "id" | "createdAt" | "synced" | "reminderSent">): Promise<number> {
        const newAppointment: Appointment = {
            ...appointment,
            reminderSent: false,
            createdAt: new Date().toISOString(),
            synced: 0,
        };
        const id = await this.appointments.add(newAppointment);
        await this.syncQueue.add({
            operation: "CREATE",
            table: "appointments",
            data: newAppointment,
            timestamp: Date.now(),
        });
        return id;
    }

    async updateAppointmentStatus(id: number, status: Appointment["status"]): Promise<void> {
        await this.appointments.update(id, { status, synced: 0 });
    }

    async getAvailableTimeSlots(doctorId: string, date: string): Promise<string[]> {
        const doctor = await this.doctors.get(doctorId);
        if (!doctor) return [];
        
        const dateObj = new Date(date);
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayOfWeek = dayNames[dateObj.getDay()] as keyof Doctor["schedule"];
        const daySchedule = doctor.schedule[dayOfWeek];
        
        if (!daySchedule) return [];
        
        const appointments = await this.appointments
            .where("doctorId")
            .equals(doctorId)
            .and(a => a.date === date && a.status === "scheduled")
            .toArray();
        
        const bookedTimes = new Set(appointments.map(a => a.time));
        const slots: string[] = [];
        
        let current = this.timeToMinutes(daySchedule.start);
        const end = this.timeToMinutes(daySchedule.end);
        const breakStart = daySchedule.breakStart ? this.timeToMinutes(daySchedule.breakStart) : null;
        const breakEnd = daySchedule.breakEnd ? this.timeToMinutes(daySchedule.breakEnd) : null;
        
        while (current + doctor.appointmentDuration <= end) {
            const timeSlot = this.minutesToTime(current);
            if ((!breakStart || !breakEnd || current < breakStart || current >= breakEnd) && !bookedTimes.has(timeSlot)) {
                slots.push(timeSlot);
            }
            current += doctor.appointmentDuration;
        }
        return slots;
    }

    async createRecurringAppointments(parentAppointment: Appointment, endDate: string): Promise<void> {
        const appointments: Appointment[] = [];
        let currentDate = new Date(parentAppointment.date);
        const end = new Date(endDate);
        
        while (currentDate <= end) {
            if (currentDate.toISOString().split('T')[0] !== parentAppointment.date) {
                const newAppointment: Appointment = {
                    ...parentAppointment,
                    id: undefined,
                    date: currentDate.toISOString().split('T')[0],
                    parentAppointmentId: parentAppointment.id,
                    reminderSent: false,
                    createdAt: new Date().toISOString(),
                    synced: 0,
                };
                appointments.push(newAppointment);
            }
            switch (parentAppointment.recurringPattern) {
                case "daily": currentDate.setDate(currentDate.getDate() + 1); break;
                case "weekly": currentDate.setDate(currentDate.getDate() + 7); break;
                case "monthly": currentDate.setMonth(currentDate.getMonth() + 1); break;
            }
        }
        if (appointments.length > 0) await this.appointments.bulkAdd(appointments);
    }

    // Drug methods
    async addDrug(drug: Omit<Drug, "id" | "createdAt" | "updatedAt" | "synced">): Promise<number> {
        const newDrug: Drug = {
            ...drug,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            synced: 0,
        };
        return await this.drugs.add(newDrug);
    }

    async getAllDrugs(): Promise<Drug[]> {
        return await this.drugs.toArray();
    }

    async getLowStockDrugs(): Promise<Drug[]> {
        return await this.drugs.filter(d => d.quantityInStock <= d.reorderLevel).toArray();
    }

    async getExpiringDrugs(daysThreshold: number = 90): Promise<Drug[]> {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + daysThreshold);
        return await this.drugs.filter(d => new Date(d.expiryDate) <= threshold && new Date(d.expiryDate) >= new Date()).toArray();
    }

    async getExpiredDrugs(): Promise<Drug[]> {
        const today = new Date().toISOString().split('T')[0];
        return await this.drugs.filter(d => d.expiryDate < today).toArray();
    }

    async updateStock(drugId: number, quantityChange: number, isAddition: boolean): Promise<void> {
        const drug = await this.drugs.get(drugId);
        if (drug) {
            const newQuantity = isAddition ? drug.quantityInStock + quantityChange : drug.quantityInStock - quantityChange;
            await this.drugs.update(drugId, { quantityInStock: newQuantity, updatedAt: new Date().toISOString(), synced: 0 });
        }
    }

    async dispenseMedication(dispensing: Omit<DispensingRecord, "id" | "synced">): Promise<void> {
        await this.dispensingRecords.add({ ...dispensing, synced: 0 });
        await this.updateStock(dispensing.drugId, dispensing.quantity, false);
    }

    async getDispensingHistory(patientUhid: string): Promise<DispensingRecord[]> {
        return await this.dispensingRecords.where("patientUhid").equals(patientUhid).toArray();
    }

    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    private minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
}

export const db = new LiberiaHMSDatabase();
