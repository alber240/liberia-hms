import { db } from '../db/database';

export async function initializeTestPatients() {
    try {
        const patientCount = await db.patients.count();
        
        if (patientCount === 0) {
            console.log('No patients found. Creating test patients...');
            
            // Test Patient 1
            await db.addPatient({
                fullName: 'John Doe',
                dateOfBirth: '1980-05-15',
                gender: 'male',
                phone: '0888000001',
                alternatePhone: '',
                email: 'john.doe@example.com',
                address: 'Monrovia, Liberia',
                emergencyContact: 'Jane Doe',
                emergencyPhone: '0888000002'
            });
            
            // Test Patient 2
            await db.addPatient({
                fullName: 'Jane Smith',
                dateOfBirth: '1990-08-22',
                gender: 'female',
                phone: '0888000003',
                alternatePhone: '',
                email: 'jane.smith@example.com',
                address: 'Monrovia, Liberia',
                emergencyContact: 'John Smith',
                emergencyPhone: '0888000004'
            });
            
            // Test Patient 3
            await db.addPatient({
                fullName: 'Robert Brown',
                dateOfBirth: '1975-03-10',
                gender: 'male',
                phone: '0888000005',
                alternatePhone: '',
                email: 'robert.brown@example.com',
                address: 'Monrovia, Liberia',
                emergencyContact: 'Mary Brown',
                emergencyPhone: '0888000006'
            });
            
            console.log('✅ 3 test patients created successfully!');
        } else {
            console.log(`✅ ${patientCount} patients already exist.`);
        }
    } catch (error) {
        console.error('Error creating test patients:', error);
    }
}
