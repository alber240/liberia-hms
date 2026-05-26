// Staff and Authentication Interfaces
export interface Staff {
    id?: number;
    staffId: string;
    username: string;
    password: string; // Hashed in production
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
    period: string; // e.g., "2026-05"
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

export interface Session {
    id?: number;
    staffId: number;
    staffName: string;
    role: string;
    token: string;
    loginTime: string;
    logoutTime?: string;
    isActive: boolean;
}
