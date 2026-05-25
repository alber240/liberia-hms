import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'fr' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('hms_language', newLang);
    };
    
    return (
        <button onClick={toggleLanguage} style={{
            background: '#1e4a6e',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 14px',
            cursor: 'pointer',
            fontWeight: 'bold'
        }}>
            {i18n.language === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}
        </button>
    );
};

export default LanguageSwitcher;