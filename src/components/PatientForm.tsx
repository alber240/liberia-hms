import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { db, Patient } from "../db/database";

interface PatientFormProps {
    onSuccess?: (patient: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSuccess }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "male" as "male" | "female" | "other",
        phone: "",
        alternatePhone: "",
        email: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [duplicateWarning, setDuplicateWarning] = useState(false);
    const [lastUhid, setLastUhid] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setDuplicateWarning(false);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setDuplicateWarning(false);

        if (!formData.fullName || !formData.dateOfBirth || !formData.phone) {
            setError(t("registration.required"));
            setLoading(false);
            return;
        }

        try {
            const duplicate = await db.checkDuplicate(formData);
            if (duplicate) {
                setDuplicateWarning(true);
                setLoading(false);
                return;
            }

            const uhid = await db.addPatient(formData);
            setLastUhid(uhid);
            setSuccess(t("registration.success", { uhid: uhid }));
            setFormData({
                fullName: "",
                dateOfBirth: "",
                gender: "male",
                phone: "",
                alternatePhone: "",
                email: "",
                address: "",
                emergencyContact: "",
                emergencyPhone: "",
            });
            
            if (onSuccess) {
                // Create a mock patient object for the callback
                onSuccess({ ...formData, uhid, registrationDate: new Date().toISOString(), synced: 0 } as Patient);
            }
            
            setTimeout(() => setSuccess(""), 5000);
        } catch (err) {
            setError("Error saving patient. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            fullName: "",
            dateOfBirth: "",
            gender: "male",
            phone: "",
            alternatePhone: "",
            email: "",
            address: "",
            emergencyContact: "",
            emergencyPhone: "",
        });
        setError("");
        setSuccess("");
        setDuplicateWarning(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
            {success && <div style={{ background: "#d1fae5", color: "#065f46", padding: "12px", borderRadius: "12px", marginBottom: "16px" }}>{success}</div>}
            {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "12px", marginBottom: "16px" }}>{error}</div>}
            {duplicateWarning && <div style={{ background: "#fed7aa", color: "#92400e", padding: "12px", borderRadius: "12px", marginBottom: "16px" }}>{t("registration.duplicateWarning")}</div>}

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{t("registration.fullName")} *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{t("registration.dateOfBirth")} *</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{t("registration.gender")}</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                    <option value="male">{t("registration.male")}</option>
                    <option value="female">{t("registration.female")}</option>
                    <option value="other">{t("registration.other")}</option>
                </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{t("registration.phone")} *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{t("registration.alternatePhone")}</label>
                <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{t("registration.email")} (Optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} placeholder="patient@example.com" />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{t("registration.address")}</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={3} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{t("registration.emergencyContact")}</label>
                <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>{t("registration.emergencyPhone")}</label>
                <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" disabled={loading} style={{ flex: 1, background: "#0f2b3d", color: "white", padding: "12px", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>
                    {loading ? t("common.loading") : t("registration.submit")}
                </button>
                <button type="button" onClick={handleReset} style={{ flex: 1, background: "#e2e8f0", color: "#1e293b", padding: "12px", border: "none", borderRadius: "12px", cursor: "pointer" }}>
                    {t("registration.reset")}
                </button>
            </div>
        </form>
    );
};

export default PatientForm;
