import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/LanguageSwitcher";
import OfflineIndicator from "./components/OfflineIndicator";
import SyncButton from "./components/SyncButton";
import Dashboard from "./pages/Dashboard";
import PatientRegistration from "./pages/PatientRegistration";
import { syncService } from "./services/syncService";

function App() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<"dashboard" | "registration">("dashboard");

    useEffect(() => {
        // Start auto-sync when app loads
        syncService.startAutoSync();

        // Cleanup on app unmount
        return () => {
            syncService.stopAutoSync();
        };
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#e8f0fe" }}>
            <div style={{ background: "#0f2b3d", color: "white", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem" }}>🏥 {t("app.title")}</h1>
                    <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>{t("app.subtitle")}</p>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <SyncButton />
                    <OfflineIndicator />
                    <LanguageSwitcher />
                </div>
            </div>

            <div style={{ background: "white", borderBottom: "1px solid #cbd5e1", padding: "0 24px", display: "flex", gap: "24px" }}>
                <button
                    onClick={() => setActiveTab("dashboard")}
                    style={{
                        padding: "14px 0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: activeTab === "dashboard" ? "bold" : "normal",
                        borderBottom: activeTab === "dashboard" ? "3px solid #0f2b3d" : "none",
                    }}
                >
                    📊 {t("nav.dashboard")}
                </button>
                <button
                    onClick={() => setActiveTab("registration")}
                    style={{
                        padding: "14px 0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: activeTab === "registration" ? "bold" : "normal",
                        borderBottom: activeTab === "registration" ? "3px solid #0f2b3d" : "none",
                    }}
                >
                    📝 {t("nav.registration")}
                </button>
            </div>

            <div style={{ padding: "24px" }}>
                {activeTab === "dashboard" && <Dashboard />}
                {activeTab === "registration" && <PatientRegistration />}
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.4; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1.2); }
                }
                button:hover { opacity: 0.8; }
                input, select, textarea { transition: all 0.2s; }
                input:focus, select:focus, textarea:focus { outline: none; border-color: #0f2b3d; box-shadow: 0 0 0 2px #0f2b3d20; }
            `}</style>
        </div>
    );
}

export default App;
