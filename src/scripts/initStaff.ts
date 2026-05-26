import { db } from '../db/database';

export async function initializeStaff() {
    const staffCount = await db.staff.count();
    
    if (staffCount === 0) {
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
            startDate: new Date().toISOString().split('T')[0],
            status: 'active',
            qualifications: 'System Administrator',
            createdAt: new Date().toISOString(),
            synced: 0
        });
        
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
            startDate: new Date().toISOString().split('T')[0],
            status: 'active',
            qualifications: 'MD, General Medicine',
            createdAt: new Date().toISOString(),
            synced: 0
        });
        
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
            startDate: new Date().toISOString().split('T')[0],
            status: 'active',
            qualifications: 'RN, BSN',
            createdAt: new Date().toISOString(),
            synced: 0
        });
        
        console.log('Default staff created');
    }
}
