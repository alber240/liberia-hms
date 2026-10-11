import React, { useState } from 'react';
import SymptomChecker from '../components/SymptomChecker';
import PredictionResult from '../components/PredictionResult';

const PredictionEngine: React.FC = () => {
    const [prediction, setPrediction] = useState<any>(null);

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>
                🧠 Clinical Prediction Engine
            </h1>

            {!prediction ? (
                <SymptomChecker onPredictionComplete={setPrediction} />
            ) : (
                <PredictionResult
                    prediction={prediction}
                    onNewAssessment={() => setPrediction(null)}
                />
            )}
        </div>
    );
};

export default PredictionEngine;