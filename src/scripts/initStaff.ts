import { db } from '../db/database';

let isInitializing = false;
let hasInitialized = false;

export async function initializeStaff() {
    // Prevent double-initialization
    if (isInitializing || hasInitialized) {
        console.log('⏭️  Staff initialization already in progress or done');
        return;
    }
    
    isInitializing = true;
    
    try {
        const staffCount = await db.staff.count();
        
        if (staffCount > 0) {
            console.log(`✅ ${staffCount} staff members already exist. Skipping.`);
            hasInitialized = true;
            isInitializing = false;
            return;
        }
        
        console.log('Creating default staff...');
        
        const now = new Date().toISOString();
        const startDate = new Date().toISOString().split('T')[0];
        
        const defaultStaff = [
            { staffId: 'ADMIN-001', username: 'admin', password: 'admin123', name: 'System Administrator', role: 'admin' as const, department: 'Administration', phone: '0888000001', email: 'admin@liberiahms.com', salary: 1000, salaryCurrency: 'USD' as const },
            { staffId: 'DOC-001', username: 'doctor', password: 'doctor123', name: 'Dr. John Smith', role: 'doctor' as const, department: 'Medical', phone: '0888000002', email: 'doctor@liberiahms.com', salary: 1500, salaryCurrency: 'USD' as const },
            { staffId: 'NURSE-001', username: 'nurse', password: 'nurse123', name: 'Sarah Johnson', role: 'nurse' as const, department: 'Nursing', phone: '0888000003', email: 'nurse@liberiahms.com', salary: 800, salaryCurrency: 'USD' as const },
            { staffId: 'REC-001', username: 'receptionist', password: 'reception123', name: 'Mary Johnson', role: 'receptionist' as const, department: 'Reception', phone: '0888000004', email: 'reception@liberiahms.com', salary: 500, salaryCurrency: 'USD' as const }
        ];
        
        for (const staff of defaultStaff) {
            const existing = await db.staff.where('username').equals(staff.username).first();
            if (existing) {
                console.log(`⏭️  ${staff.username} exists, skipping`);
                continue;
            }
            
            try {
                await db.staff.add({
                    ...staff,
                    licenseNumber: '',
                    address: 'Monrovia, Liberia',
                    emergencyContact: 'Admin',
                    emergencyPhone: '0888000001',
                    paySchedule: 'monthly',
                    bankName: 'Liberty Bank',
                    accountNumber: `${staff.staffId}-ACC`,
                    startDate: startDate,
                    status: 'active',
                    qualifications: 'Staff',
                    createdAt: now,
                    synced: 0,
                    mustChangePassword: false,
                    lastPasswordChange: now,
                    passwordHistory: '[]',
                    failedLoginAttempts: 0,
                    lockedUntil: '',
                    lastLoginAt: '',
                    lastLoginIP: '',
                    isActive: true,
                    deactivatedAt: '',
                    deactivatedBy: '',
                    deactivationReason: ''
                });
                console.log(`✅ Created: ${staff.username}`);
            } catch (err) {
                console.log(`⏭️  ${staff.username} race condition - skipping`);
            }
        }
        
        hasInitialized = true;
        console.log('✅ Default staff initialization complete!');
    } catch (error) {
        console.error('Error initializing staff:', error);
    } finally {
        isInitializing = false;
    }
}