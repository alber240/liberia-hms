import React from "react";
import { useTranslation } from "react-i18next";
import PatientForm from "../components/PatientForm";
import { Patient } from "../db/database";

const PatientRegistration: React.FC = () => {
    const { t } = useTranslation();

    const handleSuccess = (patient: Patient) => {
        console.log("Patient registered:", patient);
    };

    return (
        <div>
            <h1 style={{ marginBottom: "24px", fontSize: "1.8rem" }}>{t("registration.title")}</h1>
            <PatientForm onSuccess={handleSuccess} />
        </div>
    );
};

export default PatientRegistration;
