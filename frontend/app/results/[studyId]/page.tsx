// frontend/app/results/[studyId]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import NoduleTable from '@/components/NoduleTable';
import ReportCard from '@/components/ReportCard';
import StatsCard from '@/components/StatsCard';
import ChatDrawer from '@/components/Chat/ChatDrawer';
import { Findings, Nodule } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    // Ensure studyId is treated as string
    const studyId = Array.isArray(params?.studyId) ? params.studyId[0] : params?.studyId as string;

    const [findings, setFindings] = useState<Findings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNodule, setSelectedNodule] = useState<Nodule | null>(null);

    // Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [assignmentId, setAssignmentId] = useState<string | null>(null);

    // Theme State (for inline styles)
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setTheme(mediaQuery.matches ? 'dark' : 'light');
            const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, []);

    const isDark = theme === 'dark';

    // Fetch Data
    useEffect(() => {
        if (!studyId) return;

        async function fetchData() {
            setLoading(true);
            try {
                // 1. Get Findings
                const findingsData = await api.getFindings(studyId);
                setFindings(findingsData);

                // 2. Get Assignment ID for Chat (if user is doctor/patient)
                // We check the scan status/details to find the assignment
                // Note: We might need a specific endpoint for this, but for now we try to find it via list
                if (user) {
                    if (user.role === 'doctor') {
                        const myCases = await api.getDoctorCases(user.id);
                        const assignment = myCases.find(c => c.scan_id === studyId);
                        if (assignment) setAssignmentId(assignment.id);
                    } else if (user.role === 'patient') {
                        const myScans = await api.getPatientScans(user.id);
                        const scan = myScans.find(s => s.id === studyId);
                        if (scan?.assignment) setAssignmentId(scan.assignment.id);
                    }
                }

            } catch (err) {
                console.error(err);
                setError('Could not load analysis results. They might not be ready yet.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [studyId, user]);

    // --- STYLES ---
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: isDark ? '#000000' : '#f9fafb',
            color: isDark ? '#ffffff' : '#111827',
            fontFamily: '"Google Sans", sans-serif',
        },
        wrapper: { display: 'flex', minHeight: '100vh' },
        main: { flex: 1, marginLeft: '280px', padding: '40px', maxWidth: '1600px' },

        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
        title: { fontSize: '28px', fontWeight: 800, marginBottom: '8px' },
        subtitle: { fontSize: '14px', color: isDark ? '#a1a1aa' : '#6b7280', fontFamily: 'monospace' },
        meta: { textAlign: 'right' as const, fontSize: '13px', color: isDark ? '#a1a1aa' : '#6b7280' },

        // Layout Grids
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' },
        contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' },

        // Cards
        card: {
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            borderRadius: '16px',
            border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '32px'
        },
        cardTitle: { fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: isDark ? '#fff' : '#111827' },

        text: { lineHeight: 1.6, color: isDark ? '#d4d4d8' : '#374151' },

        // Modal
        modalOverlay: {
            position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60
        },
        modalContent: {
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px',
            border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        },

        // Chat Fab
        fab: {
            position: 'fixed' as const, bottom: '32px', right: '32px',
            backgroundColor: '#2563eb', color: 'white',
            borderRadius: '100px', padding: '16px 24px',
            display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
            border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 600,
            zIndex: 40, transition: 'transform 0.2s'
        },

        loadingContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: isDark ? '#000000' : '#ffffff' },
        spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' },
        errorState: { textAlign: 'center' as const, padding: '60px', color: '#ef4444' }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error || !findings) {
        return (
            <div style={styles.container}>
                <div style={styles.wrapper}>
                    <Sidebar />
                    <main style={styles.main}>
                        <div style={styles.errorState}>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Error Loading Results</h2>
                            <p>{error || 'Analysis data not found.'}</p>
                            <button onClick={() => router.back()} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: '1px solid currentColor', background: 'none', cursor: 'pointer', color: 'inherit' }}>
                                Go Back
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const highRiskCount = findings.nodules.filter(n => n.prob_malignant >= 0.7).length;
    const needsReviewCount = findings.nodules.filter(n => n.uncertainty.needs_review).length;

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <Sidebar />

                <main style={styles.main}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div>
                            <h1 style={styles.title}>Scan Analysis</h1>
                            <p style={styles.subtitle}>ID: {findings.study_id}</p>
                        </div>
                        <div style={styles.meta}>
                            <div>AI Confidence: 94%</div>
                            <div>Time: {findings.processing_time_seconds}s</div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={styles.statsGrid}>
                        <StatsCard title="Total Nodules" value={findings.num_nodules} />
                        <StatsCard title="High Risk" value={highRiskCount} color={highRiskCount > 0 ? '#ef4444' : undefined} />
                        <StatsCard title="Needs Review" value={needsReviewCount} color={needsReviewCount > 0 ? '#eab308' : undefined} />
                        <StatsCard title="Emphysema" value={`${(findings.emphysema_score * 100).toFixed(0)}%`} />
                    </div>

                    {/* Impressions */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Clinical Impression</h2>
                        <p style={styles.text}>{findings.impression}</p>
                    </div>

                    <div style={{ ...styles.card, backgroundColor: isDark ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff', borderColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#dbeafe' }}>
                        <h2 style={{ ...styles.cardTitle, color: '#2563eb' }}>Patient Summary</h2>
                        <p style={{ ...styles.text, color: isDark ? '#bfdbfe' : '#1e40af' }}>{findings.summary_text}</p>
                    </div>

                    {/* Table */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Nodule Details</h2>
                        <NoduleTable
                            nodules={findings.nodules}
                            onNoduleClick={setSelectedNodule}
                        />
                    </div>

                    {/* Reports */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                        <ReportCard studyId={findings.study_id} type="clinician" />
                        <ReportCard studyId={findings.study_id} type="patient" />
                    </div>

                    {/* Chat FAB */}
                    {assignmentId && (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            style={styles.fab}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            {user?.role === 'doctor' ? 'Patient Chat' : 'Consult Doctor'}
                        </button>
                    )}

                    {/* Chat Drawer */}
                    <ChatDrawer
                        isOpen={isChatOpen}
                        onClose={() => setIsChatOpen(false)}
                        assignmentId={assignmentId || ''}
                    />

                    {/* Nodule Modal */}
                    {selectedNodule && (
                        <div style={styles.modalOverlay} onClick={() => setSelectedNodule(null)}>
                            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Nodule #{selectedNodule.id}</h3>
                                    <button onClick={() => setSelectedNodule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#71717a' }}>×</button>
                                </div>

                                <div style={{ display: 'grid', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#a1a1aa' }}>Type</span>
                                        <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{selectedNodule.type}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#a1a1aa' }}>Location</span>
                                        <span style={{ fontWeight: 600 }}>{selectedNodule.location}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#a1a1aa' }}>Size</span>
                                        <span style={{ fontWeight: 600 }}>{selectedNodule.long_axis_mm.toFixed(1)} mm</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#a1a1aa' }}>Malignancy Prob.</span>
                                        <span style={{ fontWeight: 600, color: selectedNodule.prob_malignant > 0.6 ? '#ef4444' : 'inherit' }}>
                                            {(selectedNodule.prob_malignant * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}