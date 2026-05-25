import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../db/database';

const OfflineIndicator: React.FC = () => {
    const { t } = useTranslation();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [queueCount, setQueueCount] = useState(0);
    
    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        const updateQueueCount = async () => {
            const count = await db.getUnsyncedCount();
            setQueueCount(count);
        };
        
        updateQueueCount();
        const interval = setInterval(updateQueueCount, 5000);
        
        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
            clearInterval(interval);
        };
    }, []);
    
    const statusColor = isOnline ? '#10b981' : '#f59e0b';
    const statusText = isOnline ? t('offline.online') : t('offline.offline');
    
    return (
        <div style={{
            background: isOnline ? '#10b98120' : '#f59e0b20',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <span style={{
                width: '10px',
                height: '10px',
                background: statusColor,
                borderRadius: '50%',
                display: 'inline-block',
                animation: isOnline ? 'pulse 2s infinite' : 'none'
            }}></span>
            <span>{statusText}</span>
            {queueCount > 0 && (
                <span style={{ background: '#f59e0b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>
                    {t('offline.queued', { count: queueCount })}
                </span>
            )}
        </div>
    );
};

export default OfflineIndicator;