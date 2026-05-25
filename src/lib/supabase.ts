import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtbrlgndhekogvgsedtw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YnJsZ25kaGVrb2d2Z3NlZHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzQ4NjQsImV4cCI6MjA5NDQ1MDg2NH0.txb0zpJm1nwat5z4oa5Xei9creU2r335hxaDtPBbtl8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CloudPatient {
    uhid: string;
    full_name: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    alternate_phone?: string;
    address?: string;
    emergency_contact?: string;
    emergency_phone?: string;
    registration_date: string;
    synced: boolean;
}
