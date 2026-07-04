import { db, Staff } from '../db/database';

export interface AuthUser {
    id: number;
    staffId: string;
    username: string;
    name: string;
    role: string;
    department: string;
    mustChangePassword: boolean;
}

class SecureAuthService {
    private currentUser: AuthUser | null = null;

    async login(username: string, password: string, ipAddress: string = 'unknown'): Promise<{ success: boolean; message: string; mustChangePassword?: boolean; user?: AuthUser }> {
        const staff = await db.staff.where('username').equals(username).first();
        
        if (!staff) {
            return { success: false, message: 'User not found' };
        }
        
        if (staff.status !== 'active') {
            return { success: false, message: `Account is ${staff.status}. Contact administrator.` };
        }
        
        if (staff.lockedUntil && new Date(staff.lockedUntil) > new Date()) {
            return { success: false, message: `Account locked until ${new Date(staff.lockedUntil).toLocaleString()}` };
        }
        
        if (staff.password !== password) {
            const newAttempts = (staff.failedLoginAttempts || 0) + 1;
            let lockedUntil = '';
            
            if (newAttempts >= 5) {
                lockedUntil = new Date(Date.now() + 30 * 60000).toISOString();
                await db.staff.update(staff.id!, { 
                    failedLoginAttempts: newAttempts, 
                    lockedUntil,
                    synced: 0 
                });
                return { success: false, message: 'Too many failed attempts. Account locked for 30 minutes.' };
            }
            
            await db.staff.update(staff.id!, { failedLoginAttempts: newAttempts, synced: 0 });
            return { success: false, message: `Invalid password. ${5 - newAttempts} attempts remaining.` };
        }
        
        await db.staff.update(staff.id!, { 
            failedLoginAttempts: 0, 
            lockedUntil: '',
            lastLoginAt: new Date().toISOString(),
            lastLoginIP: ipAddress,
            synced: 0 
        });
        
        const user: AuthUser = {
            id: staff.id!,
            staffId: staff.staffId,
            username: staff.username,
            name: staff.name,
            role: staff.role,
            department: staff.department,
            mustChangePassword: staff.mustChangePassword || false
        };
        
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return { 
            success: true, 
            message: 'Login successful', 
            mustChangePassword: user.mustChangePassword,
            user 
        };
    }
    
    async changePassword(staffId: number, oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        const staff = await db.staff.get(staffId);
        if (!staff) {
            return { success: false, message: 'User not found' };
        }
        
        if (staff.password !== oldPassword && oldPassword !== '') {
            return { success: false, message: 'Current password is incorrect' };
        }
        
        if (newPassword.length < 8) {
            return { success: false, message: 'Password must be at least 8 characters' };
        }
        if (!/[A-Z]/.test(newPassword)) {
            return { success: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/[0-9]/.test(newPassword)) {
            return { success: false, message: 'Password must contain at least one number' };
        }
        
        const history = staff.passwordHistory ? JSON.parse(staff.passwordHistory) : [];
        if (history.includes(newPassword)) {
            return { success: false, message: 'Cannot reuse recent passwords' };
        }
        
        history.unshift(newPassword);
        if (history.length > 3) history.pop();
        
        await db.staff.update(staffId, {
            password: newPassword,
            mustChangePassword: false,
            lastPasswordChange: new Date().toISOString(),
            passwordHistory: JSON.stringify(history),
            synced: 0
        });
        
        return { success: true, message: 'Password changed successfully' };
    }
    
    async resetPassword(staffId: number): Promise<{ success: boolean; tempPassword: string; message: string }> {
        const staff = await db.staff.get(staffId);
        if (!staff) {
            return { success: false, tempPassword: '', message: 'User not found' };
        }
        
        const tempPassword = this.generateTempPassword();
        
        await db.staff.update(staffId, {
            password: tempPassword,
            mustChangePassword: true,
            synced: 0
        });
        
        return { success: true, tempPassword, message: 'Password reset successfully' };
    }
    
    async deactivateStaff(staffId: number, reason: string, deactivatedBy: string): Promise<void> {
        await db.staff.update(staffId, {
            status: 'terminated',
            isActive: false,
            deactivatedAt: new Date().toISOString(),
            deactivatedBy: deactivatedBy,
            deactivationReason: reason,
            synced: 0
        });
    }
    
    async getStaffById(id: number): Promise<Staff | undefined> {
        return await db.staff.get(id);
    }
    
    private generateTempPassword(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password + '@2024';
    }
    
    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }
    
    getCurrentUser(): AuthUser | null {
        if (this.currentUser) return this.currentUser;
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            return this.currentUser;
        }
        return null;
    }
    
    hasRole(roles: string | string[]): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;
        if (Array.isArray(roles)) return roles.includes(user.role);
        return user.role === roles;
    }
    
    isAdmin(): boolean {
        return this.hasRole('admin');
    }
    
    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }
}

export const secureAuthService = new SecureAuthService();
