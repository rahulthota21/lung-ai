// frontend/lib/api.ts

import {
    Findings,
    UploadResponse,
    Case,
    DoctorAssignment,
    Message
} from '@/types';
import supabase from './supabaseClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        overrideHeaders: Record<string, string> = {}
    ): Promise<T> {
        const { data: { session } } = await supabase.auth.getSession();

        let userId = session?.user?.id || '';

        // --- ROLE DETECTION FIX ---
        // 1. Try to get role from metadata
        let role = session?.user?.user_metadata?.role;

        // 2. If missing, fetch from DB once (Fixes 403 Forbidden for Operators)
        if (!role && userId) {
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();
            role = data?.role;
        }

        // 3. Fallback
        role = role || 'patient';

        const headers: any = {
            'x-user-id': userId,
            'x-user-role': role,
            ...options.headers,
            ...overrideHeaders,
        };

        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || `Request failed: ${response.status}`);
        }

        return response.json();
    }

    // --- ENDPOINTS ---

    async healthCheck(): Promise<{ status: string; message: string }> {
        return this.request('/');
    }

    // NEW: Fetch Patient Profile via Backend (Avoids RLS 406 Error)
    async getPatientProfile(userId: string): Promise<any> {
        return this.request(`/auth/profile/${userId}`);
    }

    async uploadScan(file: File, onBehalfOfPatientId?: string): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const overrides: Record<string, string> = {};
        if (onBehalfOfPatientId) {
            overrides['x-user-id'] = onBehalfOfPatientId;
            overrides['x-user-role'] = 'patient';
        }

        const data = await this.request<any>('/upload/scan', {
            method: 'POST',
            body: formData,
        }, overrides);

        return {
            scan_id: data.case_id,
            filename: file.name,
            size_bytes: file.size,
            status: 'uploaded'
        };
    }

    async processCase(caseId: string): Promise<{ status: string }> {
        return this.request<{ status: string }>(`/process/case/${caseId}`, {
            method: 'POST'
        });
    }

    async getScanStatus(scanId: string): Promise<{ scan_id: string; status: string }> {
        const { data } = await supabase
            .from('patient_ct_scans')
            .select('status')
            .eq('id', scanId)
            .single();

        return {
            scan_id: scanId,
            status: data?.status || 'unknown',
        };
    }

    async getFindings(scanId: string): Promise<Findings> {
        const { data: result } = await supabase
            .from('scan_results')
            .select('findings_json')
            .eq('scan_id', scanId)
            .single();

        if (result?.findings_json) {
            return result.findings_json as Findings;
        }
        throw new Error("Findings not ready");
    }

    async getPendingCases(): Promise<Case[]> {
        return this.request<Case[]>('/cases/unassigned');
    }

    async getPatientScans(patientId: string): Promise<Case[]> {
        return this.request<Case[]>(`/cases/patient/${patientId}`);
    }

    async getDoctorCases(doctorId: string): Promise<DoctorAssignment[]> {
        const { data, error } = await supabase
            .from('doctor_assignments')
            .select(`*, scan:patient_ct_scans(*, patient:profiles!patient_id(*), results:scan_results(*))`)
            .eq('doctor_id', doctorId)
            .order('accepted_at', { ascending: false });

        if (error) return [];
        return (data || []) as DoctorAssignment[];
    }

    async getOperatorCases(): Promise<Case[]> {
        const { data, error } = await supabase
            .from('patient_ct_scans')
            .select(`
                *,
                patient:profiles!patient_id(full_name, phone, gender),
                results:scan_results(*),
                assignment:doctor_assignments(
                    *,
                    doctor:profiles!doctor_id(full_name)
                )
            `)
            .order('uploaded_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('API Error (getOperatorCases):', error);
            return [];
        }
        return (data || []) as Case[];
    }

    async acceptCase(scanId: string, doctorId: string): Promise<{ success: boolean; error?: string }> {
        try {
            await this.request(`/doctor/accept/${scanId}`, { method: 'POST' });
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    async getChatMessages(assignmentId: string): Promise<Message[]> {
        try {
            return await this.request<Message[]>(`/chat/history/${assignmentId}`);
        } catch (e) {
            return [];
        }
    }

    async sendMessage(assignmentId: string, content: string, senderId: string): Promise<{ success: boolean }> {
        try {
            await this.request(`/chat/send/${assignmentId}`, {
                method: 'POST',
                body: JSON.stringify({ message: content, attachment_url: null })
            });
            return { success: true };
        } catch (e) {
            return { success: false };
        }
    }

    async createWalkInPatient(patientData: any): Promise<{ success: boolean; patientId?: string; error?: string }> {
        try {
            const email = patientData.email || `patient.${patientData.phone}@lungatm.com`;
            const password = patientData.password || `LungATM@${new Date().getFullYear()}`;

            const response = await this.request<{ status: string, user_id: string }>('/auth/create-patient', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    full_name: patientData.full_name,
                    phone: patientData.phone,
                    dob: patientData.dob,
                    gender: patientData.gender
                })
            });

            return { success: true, patientId: response.user_id };

        } catch (e: any) {
            console.error("Create patient failed:", e);
            return { success: false, error: e.message || 'Backend creation failed' };
        }
    }

    async getPatients(searchQuery?: string): Promise<any[]> {
        let query = supabase
            .from('profiles')
            .select('*')
            .eq('role', 'patient')
            .order('created_at', { ascending: false });

        if (searchQuery) {
            query = query.or(`full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
        }

        const { data } = await query.limit(20);
        return data || [];
    }
}

export const api = new ApiClient(API_BASE_URL);
export default api;