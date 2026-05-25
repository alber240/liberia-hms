import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db, Patient } from "../db/database";

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
    const [totalPatients, setTotalPatients] = useState(0);
    const [unsyncedCount, setUnsyncedCount] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            const patients = await db.getAllPatients();
            setRecentPatients(patients.slice(0, 10));
            setTotalPatients(patients.length);
            setUnsyncedCount(await db.getUnsyncedCount());
        };
        loadData();
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: "24px" }}>{t("nav.dashboard")}</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: "0.75rem", color: "#5b7c99" }}>{t("dashboard.totalPatients")}</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{totalPatients}</div>
                </div>
                <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: "0.75rem", color: "#5b7c99" }}>{t("dashboard.offlineQueue")}</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{unsyncedCount}</div>
                </div>
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ marginBottom: "16px" }}>{t("dashboard.recentPatients")}</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ textAlign: "left", padding: "12px" }}>UHID</th>
                            <th style={{ textAlign: "left", padding: "12px" }}>{t("registration.fullName")}</th>
                            <th style={{ textAlign: "left", padding: "12px" }}>{t("registration.phone")}</th>
                            <th style={{ textAlign: "left", padding: "12px" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentPatients.map((patient) => (
                            <tr key={patient.uhid} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "12px" }}>{patient.uhid}</td>
                                <td style={{ padding: "12px" }}>{patient.fullName}</td>
                                <td style={{ padding: "12px" }}>{patient.phone}</td>
                                <td style={{ padding: "12px" }}>
                                    {patient.synced === 1 ? (
                                        <span style={{ color: "#10b981" }}>✓ Synced</span>
                                    ) : (
                                        <span style={{ color: "#f59e0b" }}>⏳ Pending sync</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
