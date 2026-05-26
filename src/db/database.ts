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
    schedule: any;
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

// Laboratory Interfaces
export interface LabTest {
    id?: number;
    name: string;
    category: string;
    price: number;
    preparationInstructions: string;
    normalRange: string;
    unit: string;
    turnaroundHours: number;
    requiresFasting: boolean;
    active: boolean;
    synced: number;
}

export interface LabOrder {
    id?: number;
    orderNumber: string;
    patientUhid: string;
    patientName: string;
    doctorName: string;
    orderDate: string;
    collectionDate?: string;
    collectionBy?: string;
    status: "ordered" | "collected" | "processing" | "completed" | "cancelled";
    priority: "routine" | "urgent" | "stat";
    notes: string;
    synced: number;
}

export interface LabOrderItem {
    id?: number;
    orderId: number;
    testId: number;
    testName: string;
    result?: string;
    normalRange: string;
    unit: string;
    isAbnormal: boolean;
    resultDate?: string;
    resultEnteredBy?: string;
    status: "pending" | "in-progress" | "completed";
    notes: string;
    synced: number;
}

export interface LabSample {
    id?: number;
    orderId: number;
    sampleType: string;
    sampleNumber: string;
    collectionDate: string;
    collectionBy: string;
    status: "collected" | "received" | "processing" | "rejected";
    rejectionReason?: string;
    synced: number;
}

// Billing Interfaces
export interface ExchangeRate {
    id?: number;
    rate: number;
    effectiveDate: string;
    setBy: string;
    notes: string;
    synced: number;
}

export interface Invoice {
    id?: number;
    invoiceNumber: string;
    patientUhid: string;
    patientName: string;
    date: string;
    dueDate: string;
    currency: "LRD" | "USD";
    exchangeRate: number;
    subtotal: number;
    discount: number;
    discountType: "percentage" | "fixed";
    tax: number;
    total: number;
    amountPaid: number;
    balance: number;
    status: "draft" | "issued" | "partial" | "paid" | "cancelled";
    notes: string;
    createdBy: string;
    synced: number;
}

export interface InvoiceItem {
    id?: number;
    invoiceId: number;
    itemType: "consultation" | "lab" | "pharmacy" | "procedure" | "admission" | "other";
    itemId?: number;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    synced: number;
}

export interface Payment {
    id?: number;
    invoiceId: number;
    paymentNumber: string;
    patientUhid: string;
    patientName: string;
    amount: number;
    currency: "LRD" | "USD";
    exchangeRate: number;
    paymentMethod: "cash" | "mobile_money" | "bank_transfer" | "check" | "insurance";
    referenceNumber?: string;
    paymentDate: string;
    receivedBy: string;
    notes: string;
    synced: number;
}

// Staff and Authentication Interfaces
export interface Staff {
    id?: number;
    staffId: string;
    username: string;
    password: string;
    name: string;
    role: "admin" | "doctor" | "nurse" | "pharmacist" | "lab_tech" | "cashier" | "accountant" | "hr" | "receptionist";
    department: string;
    licenseNumber?: string;
    phone: string;
    email: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
    salary: number;
    salaryCurrency: "USD" | "LRD";
    paySchedule: "monthly" | "biweekly" | "weekly";
    bankName?: string;
    accountNumber?: string;
    startDate: string;
    status: "active" | "on_leave" | "terminated";
    qualifications: string;
    createdAt: string;
    synced: number;
}

export interface Attendance {
    id?: number;
    staffId: number;
    staffName: string;
    date: string;
    clockIn: string;
    clockOut?: string;
    hoursWorked?: number;
    overtime?: number;
    status: "present" | "absent" | "late" | "half_day";
    notes: string;
    synced: number;
}

export interface Payroll {
    id?: number;
    staffId: number;
    staffName: string;
    period: string;
    baseSalary: number;
    currency: "USD" | "LRD";
    overtimeHours: number;
    overtimePay: number;
    allowances: number;
    bonuses: number;
    grossPay: number;
    deductions: number;
    tax: number;
    pension: number;
    netPay: number;
    paymentMethod: "bank" | "cash" | "mobile_money";
    paymentDate: string;
    status: "pending" | "paid" | "cancelled";
    payslipGenerated: boolean;
    notes: string;
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
    labTests!: Table<LabTest, number>;
    labOrders!: Table<LabOrder, number>;
    labOrderItems!: Table<LabOrderItem, number>;
    labSamples!: Table<LabSample, number>;
    exchangeRates!: Table<ExchangeRate, number>;
    invoices!: Table<Invoice, number>;
    invoiceItems!: Table<InvoiceItem, number>;
    payments!: Table<Payment, number>;
    staff!: Table<Staff, number>;
    attendance!: Table<Attendance, number>;
    payroll!: Table<Payroll, number>;
    syncQueue!: Table<SyncQueue, number>;
    soapNotes!: Table<SOAPNote, number>;
    allergies!: Table<Allergy, number>;
    medicalHistory!: Table<MedicalHistory, number>;
    medications!: Table<Medication, number>;
    vitalSigns!: Table<VitalSign, number>;

    constructor() {
        super("LiberiaHMSDB");
        this.version(10).stores({
            patients: "uhid, fullName, phone, registrationDate, synced",
            doctors: "id, name, specialty, synced",
            appointments: "++id, patientUhid, doctorId, date, time, status, reminderSent, isRecurring, parentAppointmentId, synced",
            drugs: "++id, name, genericName, category, batchNumber, expiryDate, quantityInStock, reorderLevel, synced",
            prescriptions: "++id, patientUhid, date, status, synced",
            prescriptionItems: "++id, prescriptionId, drugId, status, synced",
            dispensingRecords: "++id, prescriptionId, patientUhid, drugId, dispensedAt, synced",
            labTests: "++id, name, category, active, synced",
            labOrders: "++id, orderNumber, patientUhid, status, orderDate, synced",
            labOrderItems: "++id, orderId, testId, status, synced",
            labSamples: "++id, orderId, sampleNumber, status, synced",
            exchangeRates: "++id, effectiveDate, synced",
            invoices: "++id, invoiceNumber, patientUhid, status, date, synced",
            invoiceItems: "++id, invoiceId, synced",
            payments: "++id, invoiceId, patientUhid, paymentMethod, paymentDate, synced",
            staff: "++id, staffId, username, role, status, synced",
            attendance: "++id, staffId, date, status, synced",
            payroll: "++id, staffId, period, status, synced",
            syncQueue: "++id, operation, timestamp",
            soapNotes: "++id, patientUhid, doctorId, date, status, synced",
            allergies: "++id, patientUhid, severity, synced",
            medicalHistory: "++id, patientUhid, condition, status, synced",
            medications: "++id, patientUhid, status, synced",
            vitalSigns: "++id, patientUhid, recordedAt, synced"
        });
    }

    // ========== PATIENT METHODS ==========
    generateUHID(): string {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
        return `LR-${year}-${random}`;
    }

    async getAllPatients(): Promise<Patient[]> {
        return await this.patients.toArray();
    }

    async addPatient(patientData: any): Promise<string> {
        const uhid = this.generateUHID();
        const newPatient = { ...patientData, uhid, registrationDate: new Date().toISOString(), synced: 0 };
        await this.patients.add(newPatient);
        return uhid;
    }

    async checkDuplicate(patientData: any): Promise<Patient | null> {
        const { phone, fullName, dateOfBirth } = patientData;
        if (phone) {
            const existing = await this.patients.where("phone").equals(phone).first();
            if (existing) return existing;
        }
        if (fullName && dateOfBirth) {
            const existing = await this.patients.where("fullName").equals(fullName).first();
            if (existing && existing.dateOfBirth === dateOfBirth) return existing;
        }
        return null;
    }

    async getUnsyncedCount(): Promise<number> {
        return await this.patients.where("synced").equals(0).count();
    }

    // ========== APPOINTMENT METHODS ==========
    async getAppointmentsByDate(date: string): Promise<Appointment[]> {
        return await this.appointments.where("date").equals(date).toArray();
    }

    async getAllDoctors(): Promise<Doctor[]> {
        let doctors = await this.doctors.toArray();
        if (doctors.length === 0) {
            const defaultDoctors = [
                { id: "doc1", name: "Dr. John Williams", specialty: "General Medicine", phone: "0888123456", email: "john@hospital.com", schedule: {}, appointmentDuration: 30, maxAppointmentsPerDay: 20, synced: 1 },
                { id: "doc2", name: "Dr. Sarah Johnson", specialty: "Pediatrics", phone: "0888123457", email: "sarah@hospital.com", schedule: {}, appointmentDuration: 30, maxAppointmentsPerDay: 18, synced: 1 },
                { id: "doc3", name: "Dr. Michael Brown", specialty: "Cardiology", phone: "0888123458", email: "michael@hospital.com", schedule: {}, appointmentDuration: 45, maxAppointmentsPerDay: 12, synced: 1 },
                { id: "doc4", name: "Dr. Patricia Davis", specialty: "Obstetrics and Gynecology", phone: "0888123459", email: "patricia@hospital.com", schedule: {}, appointmentDuration: 30, maxAppointmentsPerDay: 16, synced: 1 }
            ];
            for (const doctor of defaultDoctors) {
                const existing = await this.doctors.get(doctor.id);
                if (!existing) await this.doctors.add(doctor);
            }
            doctors = await this.doctors.toArray();
        }
        return doctors;
    }

    async updateDoctorSchedule(doctorId: string, schedule: any): Promise<void> {
        await this.doctors.update(doctorId, { schedule, synced: 0 });
    }

    async getAvailableTimeSlots(doctorId: string, date: string): Promise<string[]> {
        const slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
        const existingAppointments = await this.appointments.where("doctorId").equals(doctorId).and(a => a.date === date && a.status === "scheduled").toArray();
        const bookedTimes = new Set(existingAppointments.map(a => a.time));
        return slots.filter(slot => !bookedTimes.has(slot));
    }

    async addAppointment(appointmentData: any): Promise<number> {
        const newAppointment = { ...appointmentData, reminderSent: false, createdAt: new Date().toISOString(), synced: 0 };
        return await this.appointments.add(newAppointment);
    }

    async updateAppointmentStatus(id: number, status: any): Promise<void> {
        await this.appointments.update(id, { status, synced: 0 });
    }

    async createRecurringAppointments(parentAppointment: any, endDate: string): Promise<void> {
        console.log("Recurring appointments feature placeholder");
    }

    // ========== DRUG METHODS ==========
    async getAllDrugs(): Promise<Drug[]> {
        return await this.drugs.toArray();
    }

    async addDrug(drugData: any): Promise<number> {
        const newDrug = { ...drugData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), synced: 0 };
        return await this.drugs.add(newDrug);
    }

    async getLowStockDrugs(): Promise<Drug[]> {
        return await this.drugs.filter(d => d.quantityInStock <= d.reorderLevel).toArray();
    }

    async getExpiringDrugs(daysThreshold: number = 90): Promise<Drug[]> {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + daysThreshold);
        const thresholdStr = threshold.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        return await this.drugs.filter(d => d.expiryDate <= thresholdStr && d.expiryDate >= today).toArray();
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

    async dispenseMedication(dispensingData: any): Promise<void> {
        await this.dispensingRecords.add({ ...dispensingData, synced: 0 });
        await this.updateStock(dispensingData.drugId, dispensingData.quantity, false);
    }

    async getDispensingHistory(patientUhid: string): Promise<DispensingRecord[]> {
        return await this.dispensingRecords.where("patientUhid").equals(patientUhid).toArray();
    }

    // ========== STAFF METHODS ==========
    async getStaffByUsername(username: string): Promise<Staff | undefined> {
        return await this.staff.where("username").equals(username).first();
    }

    async getAllStaff(): Promise<Staff[]> {
        return await this.staff.toArray();
    }
}

export const db = new LiberiaHMSDatabase();

// EMR Interfaces
export interface SOAPNote {
    id?: number;
    patientUhid: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    date: string;
    subjective: string;  // What patient says
    objective: string;   // What doctor observes/examines
    assessment: string;  // Diagnosis
    plan: string;        // Treatment plan
    followUpDate?: string;
    status: "draft" | "final" | "amended";
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    synced: number;
}

export interface Allergy {
    id?: number;
    patientUhid: string;
    allergen: string;
    reaction: string;
    severity: "mild" | "moderate" | "severe";
    diagnosedDate: string;
    notes: string;
    synced: number;
}

export interface MedicalHistory {
    id?: number;
    patientUhid: string;
    condition: string;
    diagnosedDate: string;
    status: "active" | "resolved" | "managed";
    notes: string;
    synced: number;
}

export interface Medication {
    id?: number;
    patientUhid: string;
    drugName: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    prescribedBy: string;
    status: "active" | "completed" | "discontinued";
    notes: string;
    synced: number;
}

export interface VitalSign {
    id?: number;
    patientUhid: string;
    patientName: string;
    recordedBy: string;
    recordedAt: string;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    pulse?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    notes: string;
    synced: number;
}

