// Master list of all symptoms used across the prediction engine

export interface Symptom {
    code: string;
    label: string;
    labelFr: string;
    category: 'general' | 'fever' | 'respiratory' | 'gastro' | 'neuro' | 'skin' | 'danger' | 'vital';
    isDangerSign?: boolean;
}

export const SYMPTOM_CATALOG: Symptom[] = [
    // ===== GENERAL =====
    { code: 'fever', label: 'Fever (≥38°C)', labelFr: 'Fièvre (≥38°C)', category: 'fever' },
    { code: 'chills', label: 'Chills / Shivering', labelFr: 'Frissons', category: 'fever' },
    { code: 'sweating', label: 'Excessive sweating', labelFr: 'Transpiration excessive', category: 'fever' },
    { code: 'headache', label: 'Headache', labelFr: 'Maux de tête', category: 'general' },
    { code: 'body_aches', label: 'Body aches / Muscle pain', labelFr: 'Courbatures', category: 'general' },
    { code: 'fatigue', label: 'Fatigue / Weakness', labelFr: 'Fatigue / Faiblesse', category: 'general' },
    { code: 'loss_appetite', label: 'Loss of appetite', labelFr: "Perte d'appétit", category: 'general' },
    { code: 'joint_pain', label: 'Joint pain', labelFr: 'Douleurs articulaires', category: 'general' },
    { code: 'weight_loss', label: 'Weight loss', labelFr: 'Perte de poids', category: 'general' },
    { code: 'night_sweats', label: 'Night sweats', labelFr: 'Sueurs nocturnes', category: 'general' },

    // ===== GASTROINTESTINAL =====
    { code: 'nausea', label: 'Nausea', labelFr: 'Nausées', category: 'gastro' },
    { code: 'vomiting', label: 'Vomiting', labelFr: 'Vomissements', category: 'gastro' },
    { code: 'diarrhea', label: 'Diarrhea', labelFr: 'Diarrhée', category: 'gastro' },
    { code: 'bloody_diarrhea', label: 'Bloody diarrhea', labelFr: 'Diarrhée sanglante', category: 'gastro' },
    { code: 'watery_diarrhea', label: 'Watery diarrhea (profuse)', labelFr: 'Diarrhée aqueuse', category: 'gastro' },
    { code: 'abdominal_pain', label: 'Abdominal pain', labelFr: 'Douleur abdominale', category: 'gastro' },
    { code: 'constipation', label: 'Constipation', labelFr: 'Constipation', category: 'gastro' },

    // ===== RESPIRATORY =====
    { code: 'cough', label: 'Cough', labelFr: 'Toux', category: 'respiratory' },
    { code: 'cough_over_2_weeks', label: 'Cough for more than 2 weeks', labelFr: 'Toux depuis plus de 2 semaines', category: 'respiratory' },
    { code: 'productive_cough', label: 'Productive cough (with sputum)', labelFr: 'Toux productive', category: 'respiratory' },
    { code: 'blood_in_sputum', label: 'Blood in sputum', labelFr: 'Sang dans les crachats', category: 'respiratory' },
    { code: 'sore_throat', label: 'Sore throat', labelFr: 'Mal de gorge', category: 'respiratory' },
    { code: 'runny_nose', label: 'Runny nose', labelFr: 'Écoulement nasal', category: 'respiratory' },
    { code: 'difficulty_breathing', label: 'Difficulty breathing', labelFr: 'Difficulté à respirer', category: 'respiratory' },
    { code: 'fast_breathing', label: 'Fast breathing', labelFr: 'Respiration rapide', category: 'respiratory' },
    { code: 'chest_pain', label: 'Chest pain', labelFr: 'Douleur thoracique', category: 'respiratory' },
    { code: 'wheezing', label: 'Wheezing', labelFr: 'Respiration sifflante', category: 'respiratory' },
    { code: 'loss_smell', label: 'Loss of smell or taste', labelFr: 'Perte d\'odorat ou de goût', category: 'respiratory' },

    // ===== NEUROLOGICAL =====
    { code: 'neck_stiffness', label: 'Neck stiffness', labelFr: 'Raideur de la nuque', category: 'neuro' },
    { code: 'confusion', label: 'Confusion / Altered consciousness', labelFr: 'Confusion', category: 'neuro' },
    { code: 'seizures', label: 'Seizures / Convulsions', labelFr: 'Convulsions', category: 'neuro' },

    // ===== SKIN =====
    { code: 'rash', label: 'Rash', labelFr: 'Éruption cutanée', category: 'skin' },
    { code: 'jaundice', label: 'Yellow eyes / Jaundice', labelFr: 'Yeux jaunes / Jaunisse', category: 'skin' },
    { code: 'bleeding', label: 'Bleeding (nose, gums, etc.)', labelFr: 'Saignement', category: 'skin' },
    { code: 'pale_palms', label: 'Pale palms / Severe anemia', labelFr: 'Paumes pâles', category: 'skin' },

    // ===== DANGER SIGNS (TIER 1) =====
    { code: 'danger_convulsions', label: 'Convulsions (current)', labelFr: 'Convulsions', category: 'danger', isDangerSign: true },
    { code: 'danger_unable_drink', label: 'Unable to drink or breastfeed', labelFr: 'Incapable de boire', category: 'danger', isDangerSign: true },
    { code: 'danger_vomits_everything', label: 'Vomits everything', labelFr: 'Vomit tout', category: 'danger', isDangerSign: true },
    { code: 'danger_lethargic', label: 'Lethargic / Unconscious', labelFr: 'Léthargique', category: 'danger', isDangerSign: true },
    { code: 'danger_chest_indrawing', label: 'Chest indrawing', labelFr: 'Tirage thoracique', category: 'danger', isDangerSign: true },
    { code: 'danger_severe_dehydration', label: 'Severe dehydration', labelFr: 'Déshydratation sévère', category: 'danger', isDangerSign: true },
    { code: 'danger_bleeding', label: 'Severe bleeding', labelFr: 'Saignement sévère', category: 'danger', isDangerSign: true },
    { code: 'danger_stridor', label: 'Stridor (noisy breathing at rest)', labelFr: 'Stridor', category: 'danger', isDangerSign: true },

    // ===== WARNING FLAGS =====
    { code: 'no_malaria_response', label: 'No response to malaria treatment', labelFr: 'Pas de réponse au traitement antipaludique', category: 'fever' },
    { code: 'facial_swelling', label: 'Facial swelling', labelFr: 'Gonflement du visage', category: 'fever' },
    { code: 'pregnancy', label: 'Patient is pregnant', labelFr: 'Patiente enceinte', category: 'general' },
    { code: 'recent_travel', label: 'Recent travel to outbreak area', labelFr: 'Voyage récent en zone d\'épidémie', category: 'general' },
    { code: 'contact_sick', label: 'Contact with sick person', labelFr: 'Contact avec personne malade', category: 'general' },
    { code: 'hiv_positive', label: 'Known HIV positive', labelFr: 'VIH positif connu', category: 'general' },
    { code: 'snakebite', label: 'Recent snakebite', labelFr: 'Morsure de serpent', category: 'general' },
    { code: 'malnutrition', label: 'Severe malnutrition (MUAC < 11.5cm)', labelFr: 'Malnutrition sévère', category: 'general' },
];

export const getDangerSigns = () => SYMPTOM_CATALOG.filter(s => s.isDangerSign);
export const getSymptomsByCategory = (cat: string) => SYMPTOM_CATALOG.filter(s => s.category === cat);
export const getSymptomByCode = (code: string) => SYMPTOM_CATALOG.find(s => s.code === code);