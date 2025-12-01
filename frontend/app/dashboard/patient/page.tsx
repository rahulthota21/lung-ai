// frontend/app/dashboard/patient/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Case, ScanResult } from '@/types';

export default function PatientDashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading, signOut } = useAuth();

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [cases, setCases] = useState<Case[]>([]);
    const [error, setError] = useState<string | null>(null);

    // --- Theme Detection ---
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(mediaQuery.matches ? 'dark' : 'light');
        const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // --- Auth & Initial Load ---
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'patient') {
                router.push(`/dashboard/${user.role}`);
            } else {
                loadDashboardData(user.id);
            }
        }
    }, [user, authLoading, router]);

    // --- Data Fetching ---
    async function loadDashboardData(patientId: string) {
        setError(null);
        try {
            const data = await api.getPatientScans(patientId);
            setCases(data);
        } catch (e) {
            console.error('Dashboard load error:', e);
            setError('Unable to load your scans. Please check your connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    const handleRefresh = () => {
        if (user) {
            setRefreshing(true);
            loadDashboardData(user.id);
        }
    };

    // --- Helpers ---
    function formatDate(dateString?: string): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    function getStatusInfo(status: string) {
        const isDark = theme === 'dark';
        switch (status) {
            case 'completed':
                return {
                    label: 'Report Ready',
                    bg: isDark ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7',
                    text: isDark ? '#4ade80' : '#15803d',
                    border: isDark ? '#14532d' : '#bbf7d0'
                };
            case 'processing':
                return {
                    label: 'Analyzing',
                    bg: isDark ? 'rgba(234, 179, 8, 0.15)' : '#fef9c3',
                    text: isDark ? '#facc15' : '#a16207',
                    border: isDark ? '#713f12' : '#fde047'
                };
            case 'failed':
                return {
                    label: 'Failed',
                    bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                    text: isDark ? '#f87171' : '#b91c1c',
                    border: isDark ? '#7f1d1d' : '#fecaca'
                };
            default:
                return {
                    label: 'Uploaded',
                    bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe',
                    text: isDark ? '#60a5fa' : '#1d4ed8',
                    border: isDark ? '#1e3a8a' : '#bfdbfe'
                };
        }
    }

    function getHighRiskCount(result?: ScanResult): number {
        return result?.findings_json?.nodules?.filter(n => n.prob_malignant >= 0.7).length || 0;
    }

    function getNoduleCount(result?: ScanResult): number {
        return result?.findings_json?.nodules?.length || 0;
    }

    const isDark = theme === 'dark';

    // --- Styles (Inline for Constraint) ---
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: isDark ? '#0a0a0a' : '#f9fafb',
            color: isDark ? '#ffffff' : '#111827',
            fontFamily: '"Google Sans", sans-serif',
        },
        wrapper: { display: 'flex', minHeight: '100vh' },

        // Sidebar
        sidebar: {
            width: '280px',
            backgroundColor: isDark ? '#121212' : '#ffffff',
            borderRight: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
            display: 'flex',
            flexDirection: 'column' as const,
            position: 'fixed' as const,
            height: '100vh',
            left: 0, top: 0,
            zIndex: 50,
        },
        sidebarHeader: {
            padding: '24px 32px',
            borderBottom: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
        },
        logo: { display: 'flex', alignItems: 'center', gap: '12px' },
        logoIcon: {
            width: '36px', height: '36px',
            borderRadius: '8px',
            backgroundColor: isDark ? '#2563eb' : '#2563eb',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '20px'
        },
        logoText: { fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' },

        nav: { flex: 1, padding: '24px 16px' },
        navItem: {
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '15px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s ease',
            textDecoration: 'none', marginBottom: '8px',
        },
        navItemActive: {
            backgroundColor: isDark ? '#27272a' : '#eff6ff',
            color: isDark ? '#ffffff' : '#2563eb',
        },
        navItemInactive: {
            color: isDark ? '#a1a1aa' : '#6b7280',
        },

        userSection: {
            padding: '20px',
            borderTop: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
            backgroundColor: isDark ? '#18181b' : '#f9fafb',
        },
        userInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
        userAvatar: {
            width: '40px', height: '40px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#3f3f46' : '#dbeafe',
            color: isDark ? '#fff' : '#1e40af',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 600,
        },

        // Main Content
        main: {
            flex: 1,
            marginLeft: '280px',
            padding: '40px',
            maxWidth: '1600px',
        },

        header: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: '40px',
        },
        headerTitle: { fontSize: '32px', fontWeight: 800, marginBottom: '8px' },
        headerSubtitle: { fontSize: '15px', color: isDark ? '#a1a1aa' : '#6b7280' },

        uploadBtn: {
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 28px',
            borderRadius: '12px',
            backgroundColor: isDark ? '#ffffff' : '#111827',
            color: isDark ? '#000000' : '#ffffff',
            fontWeight: 600, fontSize: '15px',
            textDecoration: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
        },

        // Stats
        statsGrid: {
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px', marginBottom: '40px',
        },
        statCard: {
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
        statLabel: { fontSize: '14px', color: isDark ? '#a1a1aa' : '#6b7280', marginBottom: '12px' },
        statValue: { fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' },

        // List
        sectionTitle: { fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        refreshBtn: {
            background: 'none', border: 'none', cursor: 'pointer',
            color: isDark ? '#a1a1aa' : '#6b7280',
            fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px',
        },

        casesList: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
        caseCard: {
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'border-color 0.2s',
        },

        // Status Badge
        badge: {
            padding: '6px 12px', borderRadius: '100px',
            fontSize: '13px', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: '6px',
        },

        // Grid in Card
        gridStats: {
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px',
            marginTop: '24px', paddingTop: '24px',
            borderTop: `1px solid ${isDark ? '#27272a' : '#f3f4f6'}`,
        },
        gridItem: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
        gridLabel: { fontSize: '12px', textTransform: 'uppercase' as const, color: isDark ? '#71717a' : '#9ca3af', fontWeight: 600 },
        gridValue: { fontSize: '16px', fontWeight: 600 },

        actionArea: {
            marginTop: '24px', paddingTop: '24px',
            borderTop: `1px solid ${isDark ? '#27272a' : '#f3f4f6'}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        },

        btn: {
            padding: '10px 20px', borderRadius: '10px',
            fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', border: 'none',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
            transition: 'opacity 0.2s',
        },
        btnPrimary: {
            backgroundColor: isDark ? '#ffffff' : '#111827',
            color: isDark ? '#000000' : '#ffffff',
        },

        // Empty State
        emptyState: {
            padding: '80px', borderRadius: '24px',
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            border: `2px dashed ${isDark ? '#27272a' : '#e5e7eb'}`,
            textAlign: 'center' as const,
        },

        loadingContainer: {
            height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
            backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
        },
    };

    if (loading || authLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={{
                    width: '40px', height: '40px',
                    border: '3px solid #e5e7eb', borderTopColor: '#2563eb',
                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const completedCases = cases.filter(c => c.status === 'completed');
    const pendingCases = cases.filter(c => c.status === 'processing' || c.status === 'uploaded');
    const assignedCases = cases.filter(c => c.assignment);

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <div style={styles.logo}>
                            <div style={styles.logoIcon}>L</div>
                            <span style={styles.logoText}>Lung ATM</span>
                        </div>
                    </div>
                    <nav style={styles.nav}>
                        <div style={styles.navItemActive}>My Dashboard</div>
                        <Link href="/upload" style={{ ...styles.navItem, ...styles.navItemInactive }}>
                            Upload Scan
                        </Link>
                    </nav>
                    <div style={styles.userSection}>
                        <div style={styles.userInfo}>
                            <div style={styles.userAvatar}>{user?.full_name?.charAt(0) || 'P'}</div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 600 }}>{user?.full_name}</div>
                                <div style={{ fontSize: '12px', color: isDark ? '#a1a1aa' : '#6b7280' }}>Patient</div>
                            </div>
                        </div>
                        <button
                            onClick={signOut}
                            style={{
                                background: 'none', border: 'none', color: '#ef4444',
                                fontSize: '13px', cursor: 'pointer', padding: 0
                            }}
                        >
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main style={styles.main}>
                    <div style={styles.header}>
                        <div>
                            <h1 style={styles.headerTitle}>Welcome Back</h1>
                            <p style={styles.headerSubtitle}>Here is an overview of your lung health scans.</p>
                        </div>
                        <Link href="/upload" style={styles.uploadBtn}>
                            <span>+</span> Upload New Scan
                        </Link>
                    </div>

                    {error && (
                        <div style={{
                            padding: '16px', borderRadius: '12px', marginBottom: '32px',
                            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                            color: isDark ? '#f87171' : '#b91c1c', border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Stats */}
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Total Scans</div>
                            <div style={styles.statValue}>{cases.length}</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Reports Ready</div>
                            <div style={styles.statValue}>{completedCases.length}</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Processing</div>
                            <div style={styles.statValue}>{pendingCases.length}</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Doctor Assigned</div>
                            <div style={styles.statValue}>{assignedCases.length}</div>
                        </div>
                    </div>

                    {/* List */}
                    <div>
                        <div style={styles.sectionTitle}>
                            <span>Recent Scans</span>
                            <button onClick={handleRefresh} style={styles.refreshBtn}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        {cases.length === 0 ? (
                            <div style={styles.emptyState}>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No scans yet</h3>
                                <p style={{ color: isDark ? '#a1a1aa' : '#6b7280', marginBottom: '24px' }}>
                                    Upload your first CT scan to get an AI-powered analysis.
                                </p>
                                <Link href="/upload" style={{ ...styles.btn, ...styles.btnPrimary, display: 'inline-block' }}>
                                    Start Upload
                                </Link>
                            </div>
                        ) : (
                            <div style={styles.casesList}>
                                {cases.map(item => {
                                    const status = getStatusInfo(item.status);
                                    const noduleCount = getNoduleCount(item.results);
                                    const highRisk = getHighRiskCount(item.results);

                                    return (
                                        <div key={item.id} style={styles.caseCard}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                                                        {item.patient?.full_name || 'Patient Scan'}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: isDark ? '#a1a1aa' : '#6b7280' }}>
                                                        {formatDate(item.uploaded_at)} • ID: {item.id.substring(0, 8)}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    ...styles.badge,
                                                    backgroundColor: status.bg, color: status.text, border: `1px solid ${status.border}`
                                                }}>
                                                    {status.label}
                                                </span>
                                            </div>

                                            {item.status === 'completed' && (
                                                <div style={styles.gridStats}>
                                                    <div style={styles.gridItem}>
                                                        <span style={styles.gridLabel}>Nodules</span>
                                                        <span style={styles.gridValue}>{noduleCount}</span>
                                                    </div>
                                                    <div style={styles.gridItem}>
                                                        <span style={styles.gridLabel}>High Risk</span>
                                                        <span style={{ ...styles.gridValue, color: highRisk > 0 ? '#ef4444' : 'inherit' }}>
                                                            {highRisk}
                                                        </span>
                                                    </div>
                                                    <div style={styles.gridItem}>
                                                        <span style={styles.gridLabel}>Assigned To</span>
                                                        <span style={styles.gridValue}>
                                                            {item.assignment?.doctor ? `Dr. ${item.assignment.doctor.full_name}` : 'Pending...'}
                                                        </span>
                                                    </div>
                                                    <div style={{ ...styles.gridItem, alignItems: 'flex-end' }}>
                                                        <Link href={`/results/${item.id}`} style={{ ...styles.btn, ...styles.btnPrimary }}>
                                                            View Report & Chat
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}

                                            {(item.status === 'processing' || item.status === 'uploaded') && (
                                                <div style={{ marginTop: '20px', padding: '16px', backgroundColor: isDark ? '#27272a' : '#f3f4f6', borderRadius: '12px', fontSize: '14px', color: isDark ? '#a1a1aa' : '#4b5563' }}>
                                                    ℹ️ Your scan is currently being processed by our AI engine. Please refresh in a few moments.
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}