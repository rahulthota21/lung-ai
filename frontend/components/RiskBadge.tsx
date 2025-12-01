// frontend/components/RiskBadge.tsx

'use client';

import { RiskLevel } from '@/types';

interface RiskBadgeProps {
    probability: number;
    needsReview?: boolean;
}

function getRiskLevel(prob: number): RiskLevel {
    if (prob >= 0.7) return 'high';
    if (prob >= 0.4) return 'medium';
    return 'low';
}

export default function RiskBadge({ probability, needsReview }: RiskBadgeProps) {
    const risk = getRiskLevel(probability);

    const styles = {
        high: 'bg-red-100 text-red-700 border-red-200',
        medium: 'bg-amber-100 text-amber-700 border-amber-200',
        low: 'bg-green-100 text-green-700 border-green-200',
    };

    const labels = {
        high: 'High Risk',
        medium: 'Medium',
        low: 'Low Risk',
    };

    return (
        <div className="flex items-center gap-2">
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[risk]}`}
            >
                {labels[risk]}
            </span>
            {needsReview && (
                <span className="px-2 py-1 text-xs font-medium rounded-full border bg-purple-100 text-purple-700 border-purple-200">
                    ⚠️ Review
                </span>
            )}
        </div>
    );
}

export { getRiskLevel };