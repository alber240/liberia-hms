import { db, Staff } from '../db/database';

export interface AuthUser {
    id: number;
    staffId: string;
    name: string;
    role: string;
    department: string;
}

class AuthService {
    private currentUser: AuthUser | null = null;

    async login(username: string, password: string): Promise<{ success: boolean; message: string; user?: AuthUser }> {
        const staff = await db.staff.where('username').equals(username).first();
        
        if (!staff) {
            return { success: false, message: 'User not found' };
        }
        
        if (staff.status !== 'active') {
            return { success: false, message: 'Account is inactive' };
        }
        
        if (staff.password !== password) {
            return { success: false, message: 'Invalid password' };
        }
        
        const user: AuthUser = {
            id: staff.id!,
            staffId: staff.staffId,
            name: staff.name,
            role: staff.role,
            department: staff.department
        };
        
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return { success: true, message: 'Login successful', user };
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
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    }
    
    isAdmin(): boolean {
        return this.hasRole('admin');
    }
    
    getUserRole(): string | null {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    }
    
    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }
}

export const authService = new AuthService();
