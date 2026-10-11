import React from 'react';
import { Prediction } from '../db/database';

interface PredictionResultProps {
    prediction: Prediction;
    onNewAssessment: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, onNewAssessment }) => {
    const tierColors = {
        1: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', emoji: '🚨' },
        2: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', emoji: '⚠️' },
        3: { bg: '#fed7aa', border: '#f97316', text: '#7c2d12', emoji: '⚡' }
    };

    const colors = tierColors[prediction.tier];

    const getLikelihoodLabel = (likelihood: string) => {
        switch (likelihood) {
            case 'very_likely': return '🔴 Most Likely';
            case 'likely': return '🟠 Likely';
            case 'possible': return '🟡 Possible';
            case 'unlikely': return '⚪ Unlikely';
            default: return likelihood;
        }
    };

    const getLikelihoodColor = (likelihood: string) => {
        switch (likelihood) {
            case 'very_likely': return '#dc2626';
            case 'likely': return '#ea580c';
            case 'possible': return '#f59e0b';
            case 'unlikely': return '#6b7280';
            default: return '#6b7280';
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ background: colors.bg, border: `3px solid ${colors.border}`, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h2 style={{ color: colors.text, marginBottom: '8px' }}>{prediction.title}</h2>
                <p style={{ color: colors.text, margin: 0 }}>{prediction.summary}</p>
                <p style={{ color: colors.text, marginTop: '12px', fontSize: '0.85rem' }}>
                    <strong>Rule:</strong> {prediction.matchedRuleId} | <strong>Confidence:</strong> {prediction.confidence}%
                </p>
            </div>

            {/* Possible Conditions */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '16px' }}>🔬 Possible Conditions</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                    {prediction.possibleConditions.map((condition, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${getLikelihoodColor(condition.likelihood)}`
                        }}>
                            <strong>{condition.name}</strong>
                            <span style={{ color: getLikelihoodColor(condition.likelihood), fontSize: '0.9rem', fontWeight: 'bold' }}>
                                {getLikelihoodLabel(condition.likelihood)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended Actions */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '16px' }}>✅ Recommended Actions</h3>
                <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                    {prediction.recommendedActions.map((action, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>{action}</li>
                    ))}
                </ol>
            </div>

            {/* Return Immediately If */}
            {prediction.returnImmediatelyIf && prediction.returnImmediatelyIf.length > 0 && (
                <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #dc2626' }}>
                    <h3 style={{ marginBottom: '12px', color: '#991b1b' }}>🚨 RETURN IMMEDIATELY IF:</h3>
                    <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#991b1b' }}>
                        {prediction.returnImmediatelyIf.map((item, i) => (
                            <li key={i} style={{ fontWeight: 'bold' }}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Return 24h If */}
            {prediction.return24hIf && prediction.return24hIf.length > 0 && (
                <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #f59e0b' }}>
                    <h3 style={{ marginBottom: '12px', color: '#92400e' }}>⏰ RETURN IN 24 HOURS IF:</h3>
                    <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#92400e' }}>
                        {prediction.return24hIf.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Return 48h If */}
            {prediction.return48hIf && prediction.return48hIf.length > 0 && (
                <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #3b82f6' }}>
                    <h3 style={{ marginBottom: '12px', color: '#1e40af' }}>⏰ RETURN IN 48 HOURS IF:</h3>
                    <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#1e40af' }}>
                        {prediction.return48hIf.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={onNewAssessment} style={{ background: '#0f2b3d', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🔄 New Assessment
                </button>
                <button onClick={() => window.print()} style={{ background: '#6b7280', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    🖨️ Print Result
                </button>
            </div>
        </div>
    );
};

export default PredictionResult;