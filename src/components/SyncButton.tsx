import React, { useState, useEffect } from 'react';
import { syncService } from '../services/syncService';
import { db } from '../db/database';

const SyncButton: React.FC = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const loadPendingCount = async () => {
            const count = await db.getUnsyncedCount();
            setPendingCount(count);
        };
        
        loadPendingCount();
        const interval = setInterval(loadPendingCount, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        await syncService.syncAll();
        setIsSyncing(false);
        const count = await db.getUnsyncedCount();
        setPendingCount(count);
    };

    if (pendingCount === 0) {
        return null;
    }

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}
        >
            <span>☁️</span>
            {isSyncing ? 'Syncing...' : `Sync ${pendingCount} pending`}
        </button>
    );
};

export default SyncButton;
