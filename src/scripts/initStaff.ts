import { db } from '../db/database';

export async function initializeStaff() {
    try {
        const staffCount = await db.staff.count();
        
        if (staffCount === 0) {
            console.log('No staff found. Creating default staff...');
            
            const now = new Date().toISOString();
            const startDate = new Date().toISOString().split('T')[0];
            
            // Create default admin user
            await db.staff.add({
                staffId: 'ADMIN-001',
                username: 'admin',
                password: 'admin123',
                name: 'System Administrator',
                role: 'admin',
                department: 'Administration',
                licenseNumber: '',
                phone: '0888000001',
                email: 'admin@liberiahms.com',
                address: 'Monrovia, Liberia',
                emergencyContact: 'IT Department',
                emergencyPhone: '0888000000',
                salary: 1000,
                salaryCurrency: 'USD',
                paySchedule: 'monthly',
                bankName: 'Central Bank',
                accountNumber: 'ADMIN-ACC-001',
                startDate: startDate,
                status: 'active',
                qualifications: 'System Administrator',
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
            
            // Create demo doctor
            await db.staff.add({
                staffId: 'DOC-001',
                username: 'doctor',
                password: 'doctor123',
                name: 'Dr. John Smith',
                role: 'doctor',
                department: 'Medical',
                licenseNumber: 'LIC-DOC-001',
                phone: '0888000002',
                email: 'doctor@liberiahms.com',
                address: 'Monrovia, Liberia',
                emergencyContact: 'Admin',
                emergencyPhone: '0888000001',
                salary: 1500,
                salaryCurrency: 'USD',
                paySchedule: 'monthly',
                bankName: 'Liberty Bank',
                accountNumber: 'DOC-ACC-001',
                startDate: startDate,
                status: 'active',
                qualifications: 'MD, General Medicine',
                createdAt: now,
                synced: 0,
                mustChangePassword: true,
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
            
            // Create demo nurse
            await db.staff.add({
                staffId: 'NURSE-001',
                username: 'nurse',
                password: 'nurse123',
                name: 'Sarah Johnson',
                role: 'nurse',
                department: 'Nursing',
                licenseNumber: 'LIC-NURSE-001',
                phone: '0888000003',
                email: 'nurse@liberiahms.com',
                address: 'Monrovia, Liberia',
                emergencyContact: 'Admin',
                emergencyPhone: '0888000001',
                salary: 800,
                salaryCurrency: 'USD',
                paySchedule: 'monthly',
                bankName: 'Liberty Bank',
                accountNumber: 'NURSE-ACC-001',
                startDate: startDate,
                status: 'active',
                qualifications: 'RN, BSN',
                createdAt: now,
                synced: 0,
                mustChangePassword: true,
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
            
            // Create demo receptionist
            await db.staff.add({
                staffId: 'REC-001',
                username: 'receptionist',
                password: 'reception123',
                name: 'Mary Johnson',
                role: 'receptionist',
                department: 'Reception',
                licenseNumber: '',
                phone: '0888000004',
                email: 'reception@liberiahms.com',
                address: 'Monrovia, Liberia',
                emergencyContact: 'Admin',
                emergencyPhone: '0888000001',
                salary: 500,
                salaryCurrency: 'USD',
                paySchedule: 'monthly',
                bankName: 'Liberty Bank',
                accountNumber: 'REC-ACC-001',
                startDate: startDate,
                status: 'active',
                qualifications: 'Customer Service',
                createdAt: now,
                synced: 0,
                mustChangePassword: true,
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
            
            console.log('✅ Default staff created: Admin, Doctor, Nurse, Receptionist');
        } else {
            console.log(`✅ ${staffCount} staff members already exist.`);
        }
    } catch (error) {
        console.error('Error initializing staff:', error);
    }
}
