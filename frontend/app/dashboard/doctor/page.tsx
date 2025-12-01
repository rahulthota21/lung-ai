// frontend/app/dashboard/doctor/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Case, DoctorAssignment, ScanResult } from '@/types';

export default function DoctorDashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading, signOut } = useAuth();

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [loading, setLoading] = useState(true);

    // Data State
    const [pendingCases, setPendingCases] = useState<Case[]>([]);
    const [acceptedCases, setAcceptedCases] = useState<DoctorAssignment[]>([]);

    // UI State
    const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');
    const [acceptingId, setAcceptingId] = useState<string | null>(null); // Tracks which case is being accepted
    const [error, setError] = useState<string | null>(null);

    // Detect system theme
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(mediaQuery.matches ? 'dark' : 'light');
        const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Auth & Initial Load
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'doctor') {
                router.push(`/dashboard/${user.role}`);
            } else {
                loadDashboardData(user.id);
            }
        }
    }, [user, authLoading, router]);

    async function loadDashboardData(userId: string) {
        setLoading(true);
        setError(null);
        try {
            // Fetch both lists in parallel
            const [pending, accepted] = await Promise.all([
                api.getPendingCases(),
                api.getDoctorCases(userId)
            ]);
            setPendingCases(pending);
            setAcceptedCases(accepted);
        } catch (e) {
            console.error('Dashboard load error:', e);
            setError('Failed to load dashboard data. Please refresh.');
        } finally {
            setLoading(false);
        }
    }

    async function handleAcceptCase(scanId: string) {
        if (!user) return;

        setAcceptingId(scanId);
        setError(null);

        try {
            const { success, error: apiError } = await api.acceptCase(scanId, user.id);

            if (!success) {
                setError(apiError || 'Failed to accept case');
                // Reload to sync state (maybe someone else took it)
                loadDashboardData(user.id);
                return;
            }

            // Success! Refresh data and switch to "My Patients" view
            await loadDashboardData(user.id);
            setActiveTab('accepted');

        } catch (e) {
            console.error('Accept case error:', e);
            setError('An unexpected error occurred');
        } finally {
            setAcceptingId(null);
        }
    }

    // --- Helpers ---

    function formatDate(dateString?: string): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    function getHighRiskCount(result?: ScanResult): number {
        return result?.findings_json?.nodules?.filter(n => n.prob_malignant >= 0.7).length || 0;
    }

    function getNoduleCount(result?: ScanResult): number {
        return result?.findings_json?.nodules?.length || 0;
    }

    const isDark = theme === 'dark';

    // --- STYLES ---
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: isDark ? '#000000' : '#f9fafb',
            color: isDark ? '#ffffff' : '#111827',
            fontFamily: '"Google Sans", sans-serif',
        },
        wrapper: { display: 'flex', minHeight: '100vh' },

        // Sidebar
        sidebar: {
            width: '280px',
            backgroundColor: isDark ? '#121212' : '#ffffff',
            borderRight: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
            display: 'flex', flexDirection: 'column' as const,
            position: 'fixed' as const, height: '100vh', left: 0, top: 0, zIndex: 50
        },
        sidebarHeader: { padding: '24px 32px', borderBottom: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}` },
        logo: { display: 'flex', alignItems: 'center', gap: '12px' },
        logoIcon: {
            width: '36px', height: '36px', borderRadius: '8px',
            backgroundColor: '#2563eb', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '20px'
        },
        logoText: { fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' },
        nav: { flex: 1, padding: '24px 16px' },
        navItemActive: {
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', fontSize: '15px', fontWeight: 500,
            cursor: 'pointer', backgroundColor: isDark ? '#27272a' : '#eff6ff', color: isDark ? '#ffffff' : '#2563eb'
        },
        userSection: { padding: '20px', borderTop: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, backgroundColor: isDark ? '#18181b' : '#f9fafb' },
        userInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
        userAvatar: {
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: isDark ? '#3f3f46' : '#dbeafe', color: isDark ? '#fff' : '#1e40af',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 600
        },
        userName: { fontSize: '14px', fontWeight: 600 },
        userRole: { fontSize: '12px', color: isDark ? '#a1a1aa' : '#6b7280', textTransform: 'capitalize' as const },
        signOutBtn: { width: '100%', textAlign: 'left' as const, background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', padding: 0 },

        // Main Content
        main: { flex: 1, marginLeft: '280px', padding: '40px', maxWidth: '1600px' },
        header: { marginBottom: '40px' },
        headerTitle: { fontSize: '32px', fontWeight: 800, marginBottom: '8px' },
        headerSubtitle: { fontSize: '15px', color: isDark ? '#a1a1aa' : '#6b7280' },

        // Stats
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' },
        statCard: {
            padding: '24px', borderRadius: '16px',
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        },
        statLabel: { fontSize: '14px', color: isDark ? '#a1a1aa' : '#6b7280', marginBottom: '12px' },
        statValue: { fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' },
        highRisk: { color: '#ef4444' },

        // Tabs
        tabs: { display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`, paddingBottom: '16px' },
        tab: {
            padding: '10px 24px', borderRadius: '100px', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', border: 'none', transition: 'all 0.2s',
        },
        tabActive: { backgroundColor: isDark ? '#ffffff' : '#111827', color: isDark ? '#000000' : '#ffffff' },
        tabInactive: { backgroundColor: 'transparent', color: isDark ? '#a1a1aa' : '#6b7280' },

        // Case Cards
        casesList: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
        caseCard: {
            padding: '24px', borderRadius: '16px',
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        },
        caseInfo: { display: 'flex', alignItems: 'center', gap: '16px', flex: 2 },
        caseAvatar: {
            width: '48px', height: '48px', borderRadius: '50%',
            backgroundColor: isDark ? '#262626' : '#f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 600, color: isDark ? '#a3a3a3' : '#4b5563'
        },
        caseName: { fontSize: '16px', fontWeight: 600, color: isDark ? '#ffffff' : '#111827' },
        caseMeta: { fontSize: '13px', color: isDark ? '#a1a1aa' : '#6b7280', marginTop: '4px' },

        caseStats: { display: 'flex', gap: '32px', flex: 2, justifyContent: 'center' },
        caseStat: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' },
        caseStatValue: { fontSize: '20px', fontWeight: 700 },
        caseStatLabel: { fontSize: '12px', textTransform: 'uppercase' as const, color: isDark ? '#71717a' : '#9ca3af', marginTop: '4px', fontWeight: 600 },

        caseActions: { flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '12px' },
        btn: {
            padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none'
        },
        btnPrimary: { backgroundColor: '#2563eb', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' },
        btnSecondary: { backgroundColor: isDark ? '#27272a' : '#f3f4f6', color: isDark ? '#ffffff' : '#1f2937' },
        btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },

        badge: { padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, display: 'inline-block', marginLeft: '12px' },
        badgeCompleted: { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' },
        badgeAssigned: { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' },

        emptyState: { padding: '64px', textAlign: 'center' as const, borderRadius: '24px', backgroundColor: isDark ? '#18181b' : '#ffffff', border: `2px dashed ${isDark ? '#27272a' : '#e5e7eb'}` },
        emptyIcon: { width: '48px', height: '48px', color: isDark ? '#525252' : '#9ca3af', margin: '0 auto 16px' },
        emptyTitle: { fontSize: '18px', fontWeight: 600, marginBottom: '8px' },
        emptyText: { fontSize: '14px', color: isDark ? '#a1a1aa' : '#6b7280' },

        error: { padding: '16px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', marginBottom: '32px' },
        spinner: { width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
    };

    if (loading || authLoading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: styles.container.backgroundColor }}>Loading...</div>;

    return (
        <div style={styles.container}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={styles.wrapper}>
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <div style={styles.logo}>
                            <div style={styles.logoIcon}>+</div>
                            <span style={styles.logoText}>Lung ATM</span>
                        </div>
                    </div>
                    <nav style={styles.nav}>
                        <div style={styles.navItemActive}>Medical Console</div>
                    </nav>
                    <div style={styles.userSection}>
                        <div style={styles.userInfo}>
                            <div style={styles.userAvatar}>{user?.full_name?.charAt(0)}</div>
                            <div>
                                <div style={styles.userName}>Dr. {user?.full_name?.split(' ')[0]}</div>
                                <div style={styles.userRole}>Doctor</div>
                            </div>
                        </div>
                        <button style={styles.signOutBtn} onClick={signOut}>Sign Out</button>
                    </div>
                </aside>

                {/* Main */}
                <main style={styles.main}>
                    <div style={styles.header}>
                        <h1 style={styles.headerTitle}>Doctor Dashboard</h1>
                        <p style={styles.headerSubtitle}>Review incoming cases and manage patient reports</p>
                    </div>

                    {/* Stats */}
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Pending Acceptance</div>
                            <div style={styles.statValue}>{pendingCases.length}</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>My Active Patients</div>
                            <div style={styles.statValue}>{acceptedCases.length}</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>High Risk Cases</div>
                            <div style={{ ...styles.statValue, ...styles.highRisk }}>
                                {pendingCases.filter(c => getHighRiskCount(c.results) > 0).length +
                                    acceptedCases.filter(c => getHighRiskCount(c.scan?.results) > 0).length}
                            </div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Total Completed</div>
                            <div style={{ ...styles.statValue, color: '#22c55e' }}>{acceptedCases.filter(c => c.status === 'completed').length}</div>
                        </div>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    {/* Tabs */}
                    <div style={styles.tabs}>
                        <button style={{ ...styles.tab, ...(activeTab === 'pending' ? styles.tabActive : styles.tabInactive) }} onClick={() => setActiveTab('pending')}>
                            Unassigned Cases ({pendingCases.length})
                        </button>
                        <button style={{ ...styles.tab, ...(activeTab === 'accepted' ? styles.tabActive : styles.tabInactive) }} onClick={() => setActiveTab('accepted')}>
                            My Patients ({acceptedCases.length})
                        </button>
                    </div>

                    {/* Pending Cases */}
                    {activeTab === 'pending' && (
                        <div style={styles.casesList}>
                            {pendingCases.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <div style={styles.emptyIcon}>
                                        <svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div style={styles.emptyTitle}>All Caught Up</div>
                                    <div style={styles.emptyText}>There are no pending cases requiring assignment.</div>
                                </div>
                            ) : (
                                pendingCases.map(caseItem => (
                                    <div key={caseItem.id} style={styles.caseCard}>
                                        <div style={styles.caseInfo}>
                                            <div style={styles.caseAvatar}>{caseItem.patient?.full_name.charAt(0) || 'P'}</div>
                                            <div>
                                                <div style={styles.caseName}>{caseItem.patient?.full_name || 'Unknown Patient'}</div>
                                                <div style={styles.caseMeta}>Uploaded: {formatDate(caseItem.uploaded_at)}</div>
                                            </div>
                                        </div>

                                        <div style={styles.caseStats}>
                                            <div style={styles.caseStat}>
                                                <div style={styles.caseStatValue}>{getNoduleCount(caseItem.results)}</div>
                                                <div style={styles.caseStatLabel}>Nodules</div>
                                            </div>
                                            <div style={styles.caseStat}>
                                                <div style={{ ...styles.caseStatValue, ...(getHighRiskCount(caseItem.results) > 0 ? styles.highRisk : {}) }}>
                                                    {getHighRiskCount(caseItem.results)}
                                                </div>
                                                <div style={styles.caseStatLabel}>High Risk</div>
                                            </div>
                                        </div>

                                        <div style={styles.caseActions}>
                                            <button
                                                onClick={() => handleAcceptCase(caseItem.id)}
                                                disabled={acceptingId === caseItem.id}
                                                style={{ ...styles.btn, ...styles.btnPrimary, ...(acceptingId === caseItem.id ? styles.btnDisabled : {}) }}
                                            >
                                                {acceptingId === caseItem.id ? <><div style={styles.spinner}></div> Accepting...</> : 'Accept Case'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Accepted Cases */}
                    {activeTab === 'accepted' && (
                        <div style={styles.casesList}>
                            {acceptedCases.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <div style={styles.emptyTitle}>No Patients Yet</div>
                                    <div style={styles.emptyText}>Accept a pending case to start managing patients.</div>
                                </div>
                            ) : (
                                acceptedCases.map(assignment => (
                                    <div key={assignment.id} style={styles.caseCard}>
                                        <div style={styles.caseInfo}>
                                            <div style={styles.caseAvatar}>{assignment.scan?.patient?.full_name.charAt(0) || 'P'}</div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={styles.caseName}>{assignment.scan?.patient?.full_name}</span>
                                                    <span style={{ ...styles.badge, ...(assignment.status === 'completed' ? styles.badgeCompleted : styles.badgeAssigned) }}>
                                                        {assignment.status === 'completed' ? 'Completed' : 'Active'}
                                                    </span>
                                                </div>
                                                <div style={styles.caseMeta}>Accepted: {formatDate(assignment.accepted_at)}</div>
                                            </div>
                                        </div>

                                        <div style={styles.caseStats}>
                                            <div style={styles.caseStat}>
                                                <div style={styles.caseStatValue}>{getNoduleCount(assignment.scan?.results)}</div>
                                                <div style={styles.caseStatLabel}>Nodules</div>
                                            </div>
                                            <div style={styles.caseStat}>
                                                <div style={{ ...styles.caseStatValue, ...(getHighRiskCount(assignment.scan?.results) > 0 ? styles.highRisk : {}) }}>
                                                    {getHighRiskCount(assignment.scan?.results)}
                                                </div>
                                                <div style={styles.caseStatLabel}>High Risk</div>
                                            </div>
                                        </div>

                                        <div style={styles.caseActions}>
                                            <Link href={`/results/${assignment.scan?.id}`} style={{ ...styles.btn, ...styles.btnSecondary }}>
                                                View Report
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}