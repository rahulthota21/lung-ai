// frontend/components/CaseStatusBadge.tsx

'use client';

type CaseStatus = 'uploaded' | 'processing' | 'completed' | 'failed' | 'assigned';

interface CaseStatusBadgeProps {
    status: CaseStatus;
}

export default function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
    const getStatusConfig = (status: CaseStatus) => {
        switch (status) {
            case 'uploaded':
                return {
                    label: 'Uploaded',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderColor: '#fcd34d',
                };
            case 'processing':
                return {
                    label: 'Processing',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderColor: '#93c5fd',
                };
            case 'completed':
                return {
                    label: 'Completed',
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    borderColor: '#86efac',
                };
            case 'assigned':
                return {
                    label: 'Assigned',
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    borderColor: '#c4b5fd',
                };
            case 'failed':
                return {
                    label: 'Failed',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    borderColor: '#fecaca',
                };
            default:
                return {
                    label: status,
                    backgroundColor: '#f5f5f5',
                    color: '#525252',
                    borderColor: '#d4d4d4',
                };
        }
    };

    const config = getStatusConfig(status);

    const style: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: config.backgroundColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
    };

    return <span style={style}>{config.label}</span>;
}