// frontend/app/dashboard/operator/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Case, Profile } from '@/types';

export default function OperatorDashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading, signOut } = useAuth();

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [loading, setLoading] = useState(true);

    // Data State
    const [uploadedCases, setUploadedCases] = useState<Case[]>([]);
    const [patients, setPatients] = useState<Profile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upload' | 'cases'>('upload');

    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

    // Upload mode state
    const [uploadMode, setUploadMode] = useState<'new' | 'existing'>('new');
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    const [patientSearch, setPatientSearch] = useState('');
    const [isCreatingPatient, setIsCreatingPatient] = useState(false);

    // New patient form state
    const [newPatient, setNewPatient] = useState({
        full_name: '',
        phone: '',
        dob: '',
        gender: 'male' as 'male' | 'female' | 'other',
        email: '',
        password: '', // Added Password
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(mediaQuery.matches ? 'dark' : 'light');
        const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'operator') {
                router.push(`/dashboard/${user.role}`);
            } else {
                loadDashboardData();
            }
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (uploadMode === 'existing') {
            const timer = setTimeout(() => {
                loadPatients(patientSearch);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [patientSearch, uploadMode]);

    async function loadDashboardData() {
        setLoading(true);
        setError(null);
        try {
            const cases = await api.getOperatorCases();
            setUploadedCases(cases);
        } catch (e) {
            console.error('Dashboard load error:', e);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }

    async function loadPatients(search: string = '') {
        try {
            const data = await api.getPatients(search);
            setPatients(data);
        } catch (e) {
            console.error('Error loading patients', e);
        }
    }

    async function handleProcess(caseId: string) {
        setProcessingIds(prev => new Set(prev).add(caseId));
        try {
            await api.processCase(caseId);
            setUploadedCases(prev => prev.map(c =>
                c.id === caseId ? { ...c, status: 'processing' } : c
            ));
        } catch (e) {
            alert('Failed to start processing. Please try again.');
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(caseId);
                return next;
            });
        }
    }

    async function handleContinue() {
        setError(null);

        // FLOW 1: Existing Patient
        if (uploadMode === 'existing') {
            if (!selectedPatientId) {
                setError('Please select a patient from the list');
                return;
            }
            router.push(`/upload?patient=${selectedPatientId}`);
            return;
        }

        // FLOW 2: New Walk-in Patient
        if (uploadMode === 'new') {
            // Require basic fields
            if (!newPatient.full_name || !newPatient.phone || !newPatient.dob) {
                setError('Please fill in Name, Phone, and Date of Birth.');
                return;
            }

            // Optional: Check if email/password provided (recommended)
            if (!newPatient.email || !newPatient.password) {
                // You can either force them or just warn. Let's force them for better data.
                setError('Please provide an Email and Password for the patient account.');
                return;
            }

            setIsCreatingPatient(true);
            try {
                const { success, patientId, error: createError } = await api.createWalkInPatient(newPatient);

                if (!success || !patientId) {
                    throw new Error(createError || 'Failed to create patient account');
                }
                router.push(`/upload?patient=${patientId}`);
            } catch (e: any) {
                console.error('Creation error:', e);
                setError(e.message || 'Failed to register patient');
                setIsCreatingPatient(false);
            }
        }
    }

    function formatDate(dateString?: string): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    const isDark = theme === 'dark';

    // --- STYLES ---
    const styles = {
        container: { minHeight: '100vh', backgroundColor: isDark ? '#000000' : '#f9fafb', color: isDark ? '#ffffff' : '#111827', fontFamily: '"Google Sans", sans-serif' },
        wrapper: { display: 'flex', minHeight: '100vh' },
        sidebar: { width: '280px', backgroundColor: isDark ? '#121212' : '#ffffff', borderRight: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, display: 'flex', flexDirection: 'column' as const, position: 'fixed' as const, height: '100vh', left: 0, top: 0, zIndex: 50 },
        sidebarHeader: { padding: '24px 32px', borderBottom: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}` },
        logo: { display: 'flex', alignItems: 'center', gap: '12px' },
        logoIcon: { width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '20px' },
        logoText: { fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' },
        nav: { flex: 1, padding: '24px 16px' },
        navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease', textDecoration: 'none', marginBottom: '8px' },
        navItemActive: { backgroundColor: isDark ? '#27272a' : '#eff6ff', color: isDark ? '#ffffff' : '#2563eb' },
        navItemInactive: { color: isDark ? '#a1a1aa' : '#6b7280' },
        userSection: { padding: '20px', borderTop: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, backgroundColor: isDark ? '#18181b' : '#f9fafb' },
        userInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
        userAvatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: isDark ? '#3f3f46' : '#dbeafe', color: isDark ? '#fff' : '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 600 },
        userName: { fontSize: '14px', fontWeight: 600 },
        userRole: { fontSize: '12px', color: isDark ? '#a1a1aa' : '#6b7280', textTransform: 'capitalize' as const },
        signOutBtn: { width: '100%', textAlign: 'left' as const, background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', padding: 0 },
        main: { flex: 1, marginLeft: '280px', padding: '40px', maxWidth: '1600px' },
        header: { marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        headerTitle: { fontSize: '32px', fontWeight: 800, marginBottom: '8px' },
        headerSubtitle: { fontSize: '15px', color: isDark ? '#a1a1aa' : '#6b7280' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' },
        statCard: { padding: '24px', borderRadius: '16px', backgroundColor: isDark ? '#18181b' : '#ffffff', border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
        statLabel: { fontSize: '14px', color: isDark ? '#a1a1aa' : '#6b7280', marginBottom: '12px' },
        statValue: { fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' },
        tabs: { display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, paddingBottom: '16px' },
        tab: { padding: '10px 24px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s' },
        tabActive: { backgroundColor: isDark ? '#ffffff' : '#111827', color: isDark ? '#000000' : '#ffffff' },
        tabInactive: { backgroundColor: 'transparent', color: isDark ? '#a1a1aa' : '#6b7280' },
        card: { padding: '32px', borderRadius: '24px', backgroundColor: isDark ? '#18181b' : '#ffffff', border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
        cardTitle: { fontSize: '20px', fontWeight: 700, marginBottom: '24px' },
        modeToggle: { display: 'flex', gap: '4px', marginBottom: '32px', backgroundColor: isDark ? '#27272a' : '#f3f4f6', padding: '4px', borderRadius: '12px' },
        modeBtn: { flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.15s' },
        modeBtnActive: { backgroundColor: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' },
        modeBtnInactive: { backgroundColor: 'transparent', color: isDark ? '#a1a1aa' : '#6b7280' },
        formGroup: { marginBottom: '20px' },
        formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
        label: { display: 'block', fontSize: '13px', fontWeight: 600, color: isDark ? '#d4d4d8' : '#374151', marginBottom: '8px' },
        input: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${isDark ? '#3f3f46' : '#d1d5db'}`, backgroundColor: isDark ? '#27272a' : '#ffffff', color: isDark ? '#ffffff' : '#111827', fontSize: '15px', outline: 'none' },
        select: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${isDark ? '#3f3f46' : '#d1d5db'}`, backgroundColor: isDark ? '#27272a' : '#ffffff', color: isDark ? '#ffffff' : '#111827', fontSize: '15px', outline: 'none', cursor: 'pointer' },
        patientList: { maxHeight: '240px', overflowY: 'auto' as const, border: `1px solid ${isDark ? '#3f3f46' : '#d1d5db'}`, borderRadius: '12px', marginTop: '16px' },
        patientItem: { padding: '16px', borderBottom: `1px solid ${isDark ? '#27272a' : '#f3f4f6'}`, cursor: 'pointer', transition: 'background 0.15s' },
        patientItemSelected: { backgroundColor: isDark ? '#2563eb' : '#eff6ff', borderLeft: '4px solid #2563eb' },
        patientName: { fontSize: '15px', fontWeight: 600, color: isDark ? '#fff' : '#111827' },
        patientPhone: { fontSize: '13px', color: isDark ? '#a1a1aa' : '#6b7280', marginTop: '2px' },
        btn: { width: '100%', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.1s' },
        btnPrimary: { backgroundColor: '#2563eb', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' },
        btnProcess: { padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: isDark ? '#ffffff' : '#111827', color: isDark ? '#000000' : '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px' },
        btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
        tableContainer: { backgroundColor: isDark ? '#18181b' : '#ffffff', borderRadius: '16px', border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, overflow: 'hidden' },
        table: { width: '100%', borderCollapse: 'collapse' as const },
        th: { padding: '16px 24px', textAlign: 'left' as const, fontSize: '12px', textTransform: 'uppercase' as const, fontWeight: 700, color: isDark ? '#a1a1aa' : '#6b7280', borderBottom: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, backgroundColor: isDark ? '#27272a' : '#f9fafb' },
        td: { padding: '20px 24px', borderBottom: `1px solid ${isDark ? '#27272a' : '#f3f4f6'}`, fontSize: '14px', verticalAlign: 'middle' },
        statusBadge: { padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, display: 'inline-block' },
        error: { padding: '16px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', marginBottom: '24px' },
        spinner: { width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
    };

    if (loading || authLoading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: styles.container.backgroundColor }}>Loading...</div>;

    return (
        <div style={styles.container}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={styles.wrapper}>
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <div style={styles.logo}>
                            <div style={styles.logoIcon}>⚡</div>
                            <span style={styles.logoText}>Lung ATM</span>
                        </div>
                    </div>
                    <nav style={styles.nav}>
                        <div style={{ ...styles.navItem, ...styles.navItemActive }}>Operator Console</div>
                    </nav>
                    <div style={styles.userSection}>
                        <div style={styles.userInfo}>
                            <div style={styles.userAvatar}>{user?.full_name?.charAt(0)}</div>
                            <div>
                                <div style={styles.userName}>{user?.full_name}</div>
                                <div style={styles.userRole}>Operator</div>
                            </div>
                        </div>
                        <button style={styles.signOutBtn} onClick={signOut}>Sign Out</button>
                    </div>
                </aside>

                {/* Main */}
                <main style={styles.main}>
                    <div style={styles.header}>
                        <div>
                            <h1 style={styles.headerTitle}>Operator Dashboard</h1>
                            <p style={styles.headerSubtitle}>Manage patient intake and CT processing</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Total Uploads</div>
                            <div style={styles.statValue}>{uploadedCases.length}</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Pending Process</div>
                            <div style={styles.statValue}>{uploadedCases.filter(c => c.status === 'uploaded').length}</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Completed</div>
                            <div style={{ ...styles.statValue, color: '#22c55e' }}>{uploadedCases.filter(c => c.status === 'completed').length}</div>
                        </div>
                    </div>

                    <div style={styles.tabs}>
                        <button style={{ ...styles.tab, ...(activeTab === 'upload' ? styles.tabActive : styles.tabInactive) }} onClick={() => setActiveTab('upload')}>
                            + New Upload
                        </button>
                        <button style={{ ...styles.tab, ...(activeTab === 'cases' ? styles.tabActive : styles.tabInactive) }} onClick={() => setActiveTab('cases')}>
                            Manage Cases
                        </button>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    {/* Content: Upload */}
                    {activeTab === 'upload' && (
                        <div style={styles.card}>
                            <div style={styles.cardTitle}>Identify Patient</div>

                            <div style={styles.modeToggle}>
                                <button style={{ ...styles.modeBtn, ...(uploadMode === 'new' ? styles.modeBtnActive : styles.modeBtnInactive) }} onClick={() => setUploadMode('new')}>
                                    New Walk-in
                                </button>
                                <button style={{ ...styles.modeBtn, ...(uploadMode === 'existing' ? styles.modeBtnActive : styles.modeBtnInactive) }} onClick={() => setUploadMode('existing')}>
                                    Existing Patient
                                </button>
                            </div>

                            {uploadMode === 'new' ? (
                                <div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Full Name *</label>
                                        <input type="text" placeholder="e.g. Rahul Kumar" value={newPatient.full_name} onChange={e => setNewPatient({ ...newPatient, full_name: e.target.value })} style={styles.input} />
                                    </div>
                                    <div style={styles.formRow}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Phone *</label>
                                            <input type="tel" placeholder="9876543210" value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Gender *</label>
                                            <select value={newPatient.gender} onChange={e => setNewPatient({ ...newPatient, gender: e.target.value as any })} style={styles.select}>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Date of Birth *</label>
                                        <input type="date" value={newPatient.dob} onChange={e => setNewPatient({ ...newPatient, dob: e.target.value })} style={styles.input} />
                                    </div>

                                    {/* NEW: Credentials */}
                                    <div style={{ ...styles.formGroup, paddingTop: '16px', borderTop: `1px solid ${isDark ? '#27272a' : '#f3f4f6'}` }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: isDark ? '#fff' : '#000' }}>Patient Login Credentials</h4>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Email Address *</label>
                                            <input type="email" placeholder="patient@example.com" value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Create Password *</label>
                                            <input type="text" placeholder="e.g. lung1234" value={newPatient.password} onChange={e => setNewPatient({ ...newPatient, password: e.target.value })} style={styles.input} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <input type="text" placeholder="Search by name or phone..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} style={styles.input} />
                                    <div style={styles.patientList}>
                                        {patients.length === 0 ? (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#a1a1aa', fontSize: '13px' }}>{patientSearch ? 'No patients found' : 'Type to search...'}</div>
                                        ) : patients.map(p => (
                                            <div key={p.id} style={{ ...styles.patientItem, ...(selectedPatientId === p.id ? styles.patientItemSelected : {}) }} onClick={() => setSelectedPatientId(p.id)}>
                                                <div style={styles.patientName}>{p.full_name}</div>
                                                <div style={styles.patientPhone}>{p.phone}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '24px', ...(isCreatingPatient ? styles.btnDisabled : {}) }} onClick={handleContinue} disabled={isCreatingPatient}>
                                {isCreatingPatient ? <><div style={styles.spinner}></div> Creating Account...</> : 'Create & Continue'}
                            </button>
                        </div>
                    )}

                    {/* Content: Cases Table */}
                    {activeTab === 'cases' && (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Patient</th>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedCases.map(c => {
                                        const isProcessing = processingIds.has(c.id);
                                        return (
                                            <tr key={c.id}>
                                                <td style={styles.td}>
                                                    <div style={{ fontWeight: 600, color: isDark ? '#fff' : '#111827' }}>{c.patient?.full_name || 'Unknown'}</div>
                                                    <div style={{ fontSize: '12px', color: isDark ? '#a1a1aa' : '#6b7280' }}>{c.patient?.phone}</div>
                                                </td>
                                                <td style={styles.td}>{formatDate(c.uploaded_at)}</td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        backgroundColor: c.status === 'completed' ? 'rgba(34, 197, 94, 0.1)' : c.status === 'processing' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                        color: c.status === 'completed' ? '#22c55e' : c.status === 'processing' ? '#eab308' : '#3b82f6'
                                                    }}>
                                                        {c.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    {c.status === 'uploaded' && (
                                                        <button
                                                            onClick={() => handleProcess(c.id)}
                                                            disabled={isProcessing}
                                                            style={{ ...styles.btnProcess, ...(isProcessing ? styles.btnDisabled : {}) }}
                                                        >
                                                            {isProcessing ? 'Starting...' : '⚡ Process Scan'}
                                                        </button>
                                                    )}
                                                    {c.status === 'completed' && <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Review Ready</span>}
                                                    {c.status === 'processing' && <span style={{ fontSize: '13px', color: '#eab308' }}>AI Analyzing...</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {uploadedCases.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>No cases found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}