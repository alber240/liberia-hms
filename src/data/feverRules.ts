// Clinical rules for fever assessment
// Based on Liberia National Malaria Guidelines + WHO IMCI protocols

export type Likelihood = 'very_likely' | 'likely' | 'possible' | 'unlikely';

export interface ClinicalRule {
    id: string;
    name: string;
    tier: 1 | 2 | 3;
    priority: number;
    requiredSymptoms?: string[];
    anyOfSymptoms?: string[];
    excludedSymptoms?: string[];
    ageMin?: number;
    ageMax?: number;
    temperatureMin?: number;

    title: string;
    titleFr: string;
    summary: string;
    summaryFr: string;

    possibleConditions: {
        name: string;
        nameFr: string;
        likelihood: Likelihood;
    }[];

    recommendedActions: string[];
    recommendedActionsFr: string[];

    returnImmediatelyIf: string[];
    returnImmediatelyIfFr: string[];

    return24hIf: string[];
    return24hIfFr: string[];

    return48hIf: string[];
    return48hIfFr: string[];

    source: string;
    updatedAt: string;
}

export const FEVER_RULES: ClinicalRule[] = [

    // ================================================
    // TIER 1: EMERGENCY
    // ================================================
    {
        id: 'FEVER_T1_DANGER',
        name: 'Fever with Any Danger Sign',
        tier: 1,
        priority: 1,
        requiredSymptoms: ['fever'],
        anyOfSymptoms: [
            'danger_convulsions', 'danger_unable_drink', 'danger_vomits_everything',
            'danger_lethargic', 'danger_chest_indrawing', 'danger_severe_dehydration', 'danger_bleeding'
        ],
        title: '🚨 EMERGENCY — DANGER SIGN DETECTED',
        titleFr: '🚨 URGENCE — SIGNES DE DANGER',
        summary: 'Patient has fever AND at least one danger sign. This requires immediate action.',
        summaryFr: 'Le patient a de la fièvre ET au moins un signe de danger.',
        possibleConditions: [
            { name: 'Severe malaria', nameFr: 'Paludisme grave', likelihood: 'very_likely' },
            { name: 'Severe bacterial infection', nameFr: 'Infection bactérienne grave', likelihood: 'likely' },
            { name: 'Meningitis', nameFr: 'Méningite', likelihood: 'possible' },
            { name: 'Other serious illness', nameFr: 'Autre maladie grave', likelihood: 'possible' }
        ],
        recommendedActions: [
            'START emergency treatment immediately',
            'Check airway, breathing, circulation',
            'Give oxygen if available',
            'Give first-dose antibiotic (if protocol allows)',
            'REFER TO HOSPITAL IMMEDIATELY',
            'Do NOT delay for lab tests'
        ],
        recommendedActionsFr: [
            'COMMENCER le traitement d\'urgence',
            'Vérifier les voies respiratoires',
            'Donner de l\'oxygène',
            'RÉFÉRER IMMÉDIATEMENT',
            'Ne pas retarder'
        ],
        returnImmediatelyIf: ['Patient deteriorates at any point'],
        returnImmediatelyIfFr: ['Détérioration du patient'],
        return24hIf: ['Not applicable — patient should be transferred NOW'],
        return24hIfFr: ['Non applicable — transférer maintenant'],
        return48hIf: ['Follow up with receiving facility'],
        return48hIfFr: ['Suivi avec l\'établissement de destination'],
        source: 'WHO IMCI + Liberia National Malaria Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 2: LASSA SUSPECT
    // ================================================
    {
        id: 'FEVER_T3_LASSA_SUSPECT',
        name: 'Possible Lassa Fever',
        tier: 2,
        priority: 2,
        requiredSymptoms: ['fever'],
        anyOfSymptoms: ['sore_throat', 'no_malaria_response', 'facial_swelling', 'bleeding'],
        title: '⚠️ Possible Lassa Fever — Investigate',
        titleFr: '⚠️ Suspicion de Fièvre de Lassa',
        summary: 'Symptoms match Lassa fever case definition. Take precautionary actions.',
        summaryFr: 'Les symptômes correspondent à la définition de cas de Lassa.',
        possibleConditions: [
            { name: 'Lassa Fever (SUSPECTED)', nameFr: 'Fièvre de Lassa (SUSPECTÉE)', likelihood: 'possible' },
            { name: 'Severe malaria', nameFr: 'Paludisme grave', likelihood: 'likely' },
            { name: 'Typhoid with complications', nameFr: 'Typhoïde avec complications', likelihood: 'possible' },
            { name: 'Other viral hemorrhagic fever', nameFr: 'Autre FHV', likelihood: 'unlikely' }
        ],
        recommendedActions: [
            '🚨 ISOLATE the patient (avoid contact)',
            'Use PPE if available',
            'Collect blood sample for Lassa testing',
            'NOTIFY District Surveillance Officer WITHIN 24 HOURS',
            'Complete IDSR Case-Based Reporting Form',
            'Do NOT perform invasive procedures unless necessary',
            'Contact NPHIL hotline: +231 777 700 000'
        ],
        recommendedActionsFr: [
            '🚨 ISOLER le patient',
            'Utiliser EPI si disponible',
            'Prélever un échantillon',
            'NOTIFIER dans les 24H',
            'Remplir le formulaire IDSR',
            'Éviter les procédures invasives',
            'Contacter NPHIL'
        ],
        returnImmediatelyIf: [
            'Bleeding from gums, nose, or other sites',
            'Hearing loss',
            'Confusion or altered consciousness',
            'Difficulty breathing'
        ],
        returnImmediatelyIfFr: [
            'Saignement des gencives, nez',
            'Perte auditive',
            'Confusion',
            'Difficulté à respirer'
        ],
        return24hIf: [
            'Sore throat worsens',
            'Facial swelling develops',
            'Fever does not respond to any treatment'
        ],
        return24hIfFr: [
            'Aggravation du mal de gorge',
            'Gonflement du visage',
            'Fièvre ne répond pas'
        ],
        return48hIf: ['Results from Lassa test should be back'],
        return48hIfFr: ['Résultats du test de Lassa'],
        source: 'Liberia IDSR Technical Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 3: MENINGITIS SUSPECT
    // ================================================
    {
        id: 'FEVER_T3_MENINGITIS_SUSPECT',
        name: 'Possible Meningitis',
        tier: 2,
        priority: 3,
        requiredSymptoms: ['fever', 'neck_stiffness'],
        anyOfSymptoms: ['headache', 'confusion', 'vomiting'],
        title: '🚨 Possible Meningitis — Emergency',
        titleFr: '🚨 Suspicion de Méningite',
        summary: 'Fever with neck stiffness suggests meningitis. Emergency referral.',
        summaryFr: 'Fièvre avec raideur de la nuque suggère méningite.',
        possibleConditions: [
            { name: 'Bacterial meningitis', nameFr: 'Méningite bactérienne', likelihood: 'very_likely' },
            { name: 'Viral meningitis', nameFr: 'Méningite virale', likelihood: 'possible' },
            { name: 'Severe malaria with CNS', nameFr: 'Paludisme grave SNC', likelihood: 'possible' },
            { name: 'Other CNS infection', nameFr: 'Autre infection', likelihood: 'unlikely' }
        ],
        recommendedActions: [
            'START antibiotics IMMEDIATELY (before transfer)',
            'REFER TO HOSPITAL URGENTLY',
            'NOTIFY District Surveillance Officer',
            'Collect blood/CSF sample if possible',
            'Isolate patient if meningococcal suspected',
            'Close contacts need prophylaxis'
        ],
        recommendedActionsFr: [
            'COMMENCER les antibiotiques',
            'RÉFÉRER À L\'HÔPITAL',
            'NOTIFIER le Bureau',
            'Prélever sang/LCR'
        ],
        returnImmediatelyIf: [
            'Petechial rash appears',
            'Seizures develop',
            'Loss of consciousness',
            'Shock signs'
        ],
        returnImmediatelyIfFr: ['Éruption pétéchiale', 'Convulsions', 'Perte de conscience', 'Choc'],
        return24hIf: ['Not applicable — patient should be transferred NOW'],
        return24hIfFr: ['Non applicable — transférer maintenant'],
        return48hIf: ['Follow up with hospital'],
        return48hIfFr: ['Suivi avec hôpital'],
        source: 'WHO Meningitis Guidelines + Liberia IDSR',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 4: MEASLES SUSPECT
    // ================================================
    {
        id: 'FEVER_T3_MEASLES_SUSPECT',
        name: 'Possible Measles',
        tier: 2,
        priority: 4,
        requiredSymptoms: ['fever', 'rash'],
        anyOfSymptoms: ['cough', 'runny_nose', 'sore_throat'],
        title: '⚠️ Possible Measles — Investigate',
        titleFr: '⚠️ Suspicion de Rougeole',
        summary: 'Fever with rash suggests measles. Report to IDSR.',
        summaryFr: 'Fièvre avec éruption suggère la rougeole.',
        possibleConditions: [
            { name: 'Measles (SUSPECTED)', nameFr: 'Rougeole (SUSPECTÉE)', likelihood: 'very_likely' },
            { name: 'Rubella', nameFr: 'Rubéole', likelihood: 'possible' },
            { name: 'Other viral exanthem', nameFr: 'Autre exanthème', likelihood: 'possible' }
        ],
        recommendedActions: [
            '🚨 ISOLATE the patient',
            'NOTIFY District Surveillance Officer WITHIN 24 HOURS',
            'Complete IDSR Case-Based Reporting Form',
            'Give Vitamin A (if under 5)',
            'Treat secondary infections',
            'Check vaccination status of contacts'
        ],
        recommendedActionsFr: [
            '🚨 ISOLER le patient',
            'NOTIFIER dans les 24H',
            'Remplir le formulaire IDSR',
            'Donner Vitamine A'
        ],
        returnImmediatelyIf: ['Difficulty breathing', 'Severe eye complications', 'Seizures'],
        returnImmediatelyIfFr: ['Difficulté à respirer', 'Complications oculaires', 'Convulsions'],
        return24hIf: ['Fever persists', 'Rash worsens'],
        return24hIfFr: ['Fièvre persiste', 'Éruption s\'aggrave'],
        return48hIf: ['Follow up on vitamin A response'],
        return48hIfFr: ['Suivi vitamine A'],
        source: 'Liberia IDSR Technical Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 5: MALARIA CLASSIC
    // ================================================
    {
        id: 'FEVER_T2_MALARIA_CLASSIC',
        name: 'Classic Malaria Presentation',
        tier: 2,
        priority: 5,
        requiredSymptoms: ['fever', 'headache'],
        anyOfSymptoms: ['chills', 'sweating', 'body_aches', 'joint_pain'],
        excludedSymptoms: ['danger_convulsions', 'danger_lethargic', 'danger_bleeding'],
        title: 'Fever + Headache + Body Aches — Classic Malaria',
        titleFr: 'Fièvre + Maux de tête — Paludisme classique',
        summary: 'Symptoms strongly suggest malaria. Test and treat per protocol.',
        summaryFr: 'Symptômes suggèrent le paludisme.',
        possibleConditions: [
            { name: 'Malaria', nameFr: 'Paludisme', likelihood: 'very_likely' },
            { name: 'Typhoid fever', nameFr: 'Fièvre typhoïde', likelihood: 'possible' },
            { name: 'Viral illness', nameFr: 'Maladie virale', likelihood: 'possible' },
            { name: 'Dengue', nameFr: 'Dengue', likelihood: 'unlikely' }
        ],
        recommendedActions: [
            'TEST FOR MALARIA FIRST (RDT or microscopy)',
            'If positive → Artemether-Lumefantrine (AL) per weight',
            'If negative → investigate other causes',
            'Give paracetamol for fever',
            'Encourage fluids',
            'Return in 48 hours if fever persists'
        ],
        recommendedActionsFr: [
            'TESTER LE PALUDISME',
            'Si positif → AL selon poids',
            'Si négatif → autres causes',
            'Paracétamol',
            'Liquides',
            'Retour dans 48h'
        ],
        returnImmediatelyIf: [
            '🚨 Sore throat develops → possible Lassa',
            '🚨 Bleeding develops → possible VHF',
            '🚨 Convulsions or unconsciousness',
            '🚨 Unable to drink'
        ],
        returnImmediatelyIfFr: [
            '🚨 Mal de gorge → possible Lassa',
            '🚨 Saignement → possible FHV',
            '🚨 Convulsions',
            '🚨 Incapable de boire'
        ],
        return24hIf: [
            'High fever not responding to paracetamol',
            'Vomiting everything'
        ],
        return24hIfFr: ['Fièvre ne répond pas', 'Vomit tout'],
        return48hIf: [
            '⏰ Fever still present after 2 days of treatment',
            '⏰ Not eating or drinking well',
            '⏰ Not improving'
        ],
        return48hIfFr: [
            '⏰ Fièvre toujours présente',
            '⏰ Ne mange pas bien',
            '⏰ Pas d\'amélioration'
        ],
        source: 'Liberia National Malaria Control Program',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 6: CHILD UNDER 5
    // ================================================
    {
        id: 'FEVER_T2_CHILD_UNDER5',
        name: 'Fever in Child Under 5',
        tier: 2,
        priority: 6,
        requiredSymptoms: ['fever'],
        ageMax: 5,
        excludedSymptoms: ['danger_convulsions', 'danger_lethargic'],
        title: 'Fever in Child Under 5 — IMCI Protocol',
        titleFr: 'Fièvre chez l\'enfant de moins de 5 ans',
        summary: 'Follow IMCI protocol for fever in child under 5 years.',
        summaryFr: 'Suivre le protocole PCIME.',
        possibleConditions: [
            { name: 'Malaria', nameFr: 'Paludisme', likelihood: 'very_likely' },
            { name: 'Pneumonia', nameFr: 'Pneumonie', likelihood: 'possible' },
            { name: 'Ear infection', nameFr: 'Infection de l\'oreille', likelihood: 'possible' },
            { name: 'Urinary tract infection', nameFr: 'Infection urinaire', likelihood: 'possible' },
            { name: 'Measles (if rash)', nameFr: 'Rougeole (si éruption)', likelihood: 'unlikely' }
        ],
        recommendedActions: [
            'Check for ALL IMCI danger signs',
            'Check for pneumonia (count breaths)',
            'Check for ear infection',
            'Test for malaria (RDT for children)',
            'Give weight-based paracetamol',
            'Check vaccination status (measles)',
            'If any danger sign → refer immediately'
        ],
        recommendedActionsFr: [
            'Vérifier les signes de danger',
            'Vérifier la pneumonie',
            'Vérifier l\'oreille',
            'Tester le paludisme',
            'Paracétamol selon poids',
            'Vérifier la vaccination'
        ],
        returnImmediatelyIf: [
            '🚨 Any danger sign',
            '🚨 Breathing becomes difficult',
            '🚨 Child stops feeding',
            '🚨 Convulsions'
        ],
        returnImmediatelyIfFr: ['🚨 Signe de danger', '🚨 Difficulté respiratoire', '🚨 Ne mange plus', '🚨 Convulsions'],
        return24hIf: ['Fever persists', 'Rash develops'],
        return24hIfFr: ['Fièvre persiste', 'Éruption'],
        return48hIf: ['⏰ Fever has not resolved', '⏰ Not feeding normally'],
        return48hIfFr: ['⏰ Fièvre non résolue', '⏰ Ne mange pas normalement'],
        source: 'WHO IMCI Chart Booklet',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 7: PREGNANT WOMAN
    // ================================================
    {
        id: 'FEVER_T2_PREGNANT',
        name: 'Fever in Pregnant Woman',
        tier: 2,
        priority: 7,
        requiredSymptoms: ['fever', 'pregnancy'],
        excludedSymptoms: ['danger_bleeding'],
        title: 'Fever in Pregnancy — High Priority',
        titleFr: 'Fièvre pendant la Grossesse',
        summary: 'Malaria in pregnancy is dangerous. Test and treat urgently.',
        summaryFr: 'Le paludisme pendant la grossesse est dangereux.',
        possibleConditions: [
            { name: 'Malaria in pregnancy', nameFr: 'Paludisme gravidique', likelihood: 'very_likely' },
            { name: 'Urinary tract infection', nameFr: 'Infection urinaire', likelihood: 'possible' },
            { name: 'Other infection', nameFr: 'Autre infection', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Test for malaria IMMEDIATELY',
            'If positive → treat per pregnancy protocol',
            'Check for danger signs (bleeding, contractions)',
            'Give paracetamol (safe in pregnancy)',
            'Check blood pressure',
            'Refer to ANC if not already enrolled'
        ],
        recommendedActionsFr: [
            'Tester le paludisme',
            'Traiter selon protocole grossesse',
            'Vérifier signes de danger',
            'Paracétamol',
            'Vérifier tension',
            'Référer au CPN'
        ],
        returnImmediatelyIf: [
            '🚨 Vaginal bleeding',
            '🚨 Contractions before term',
            '🚨 Severe headache with vision changes (pre-eclampsia)',
            '🚨 Baby stops moving'
        ],
        returnImmediatelyIfFr: ['🚨 Saignement', '🚨 Contractions', '🚨 Maux de tête sévères', '🚨 Bébé ne bouge plus'],
        return24hIf: ['Fever persists', 'Reduced fetal movement'],
        return24hIfFr: ['Fièvre persiste', 'Mouvement réduit'],
        return48hIf: ['Follow up at ANC'],
        return48hIfFr: ['Suivi au CPN'],
        source: 'Liberia National Malaria in Pregnancy Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 8: RESPIRATORY (URI)
    // ================================================
    {
        id: 'FEVER_T2_URI',
        name: 'Fever with Upper Respiratory Symptoms',
        tier: 2,
        priority: 8,
        requiredSymptoms: ['fever'],
        anyOfSymptoms: ['cough', 'runny_nose', 'sore_throat'],
        excludedSymptoms: ['danger_chest_indrawing', 'difficulty_breathing', 'no_malaria_response', 'facial_swelling', 'bleeding', 'neck_stiffness', 'loss_smell'],
        title: 'Fever + Respiratory Symptoms',
        titleFr: 'Fièvre + Symptômes respiratoires',
        summary: 'Fever with upper respiratory symptoms. Check for pneumonia.',
        summaryFr: 'Fièvre avec symptômes respiratoires.',
        possibleConditions: [
            { name: 'Upper respiratory infection', nameFr: 'Infection respiratoire', likelihood: 'likely' },
            { name: 'Malaria', nameFr: 'Paludisme', likelihood: 'possible' },
            { name: 'Pneumonia (rule out)', nameFr: 'Pneumonie', likelihood: 'possible' },
            { name: 'COVID-19 / Influenza', nameFr: 'COVID-19 / Grippe', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Count respiratory rate (check for pneumonia)',
            'Check for chest indrawing',
            'Test for malaria (rule out)',
            'Give paracetamol for fever',
            'Encourage fluids and rest',
            'If breathing worsens → escalate urgently'
        ],
        recommendedActionsFr: [
            'Compter la fréquence respiratoire',
            'Vérifier le tirage',
            'Tester le paludisme',
            'Paracétamol',
            'Liquides et repos'
        ],
        returnImmediatelyIf: [
            '🚨 Difficulty breathing worsens',
            '🚨 Chest indrawing appears',
            '🚨 Unable to drink',
            '🚨 Bluish lips or face'
        ],
        returnImmediatelyIfFr: ['🚨 Difficulté à respirer', '🚨 Tirage', '🚨 Incapable de boire', '🚨 Lèvres bleues'],
        return24hIf: ['Fever persists', 'Cough worsens'],
        return24hIfFr: ['Fièvre persiste', 'Toux s\'aggrave'],
        return48hIf: ['⏰ No improvement after 48 hours', '⏰ Cough still present'],
        return48hIfFr: ['⏰ Pas d\'amélioration', '⏰ Toux présente'],
        source: 'WHO IMCI Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 9: FEVER + DIARRHEA
    // ================================================
    {
        id: 'FEVER_T2_DIARRHEA',
        name: 'Fever with Diarrhea',
        tier: 2,
        priority: 9,
        requiredSymptoms: ['fever', 'diarrhea'],
        excludedSymptoms: ['danger_severe_dehydration', 'danger_lethargic'],
        title: 'Fever + Diarrhea',
        titleFr: 'Fièvre + Diarrhée',
        summary: 'Fever with diarrhea. Assess hydration and check for cholera/dysentery.',
        summaryFr: 'Fièvre avec diarrhée. Évaluer l\'hydratation.',
        possibleConditions: [
            { name: 'Gastroenteritis', nameFr: 'Gastro-entérite', likelihood: 'likely' },
            { name: 'Malaria with GI symptoms', nameFr: 'Paludisme avec symptômes GI', likelihood: 'possible' },
            { name: 'Typhoid fever', nameFr: 'Fièvre typhoïde', likelihood: 'possible' },
            { name: 'Cholera (if watery)', nameFr: 'Choléra (si aqueuse)', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Assess hydration status (skin turgor, eyes, mouth)',
            'Start ORS immediately',
            'Check stool: watery or bloody?',
            'If bloody → suspect dysentery → treat with antibiotics',
            'If profuse watery → suspect cholera → isolate + notify',
            'Test for malaria (rule out)'
        ],
        recommendedActionsFr: [
            'Évaluer le statut d\'hydratation',
            'Commencer SRO',
            'Vérifier les selles',
            'Si sanglantes → dysenterie',
            'Si aqueuses profuses → choléra',
            'Tester le paludisme'
        ],
        returnImmediatelyIf: [
            '🚨 Blood in stool',
            '🚨 Signs of severe dehydration (sunken eyes, skin pinch)',
            '🚨 Unable to drink',
            '🚨 Very weak or lethargic'
        ],
        returnImmediatelyIfFr: ['🚨 Sang dans les selles', '🚨 Déshydratation sévère', '🚨 Incapable de boire', '🚨 Très faible'],
        return24hIf: ['Diarrhea persists', 'Signs of dehydration'],
        return24hIfFr: ['Diarrhée persiste', 'Signes de déshydratation'],
        return48hIf: ['⏰ Diarrhea > 3 days', '⏰ Not improving'],
        return48hIfFr: ['⏰ Diarrhée > 3 jours', '⏰ Pas d\'amélioration'],
        source: 'WHO Diarrhea Guidelines + Liberia IDSR',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 10: TYPHOID SUSPECT
    // ================================================
    {
        id: 'FEVER_T3_TYPHOID_SUSPECT',
        name: 'Possible Typhoid Fever',
        tier: 2,
        priority: 10,
        requiredSymptoms: ['fever'],
        anyOfSymptoms: ['headache', 'abdominal_pain', 'constipation', 'diarrhea'],
        excludedSymptoms: ['sore_throat', 'rash'],
        title: 'Possible Typhoid Fever',
        titleFr: 'Suspicion de Fièvre Typhoïde',
        summary: 'Prolonged fever with abdominal symptoms. Consider typhoid.',
        summaryFr: 'Fièvre prolongée avec symptômes abdominaux.',
        possibleConditions: [
            { name: 'Typhoid fever', nameFr: 'Fièvre typhoïde', likelihood: 'likely' },
            { name: 'Malaria', nameFr: 'Paludisme', likelihood: 'possible' },
            { name: 'Other bacterial infection', nameFr: 'Autre infection', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Test for malaria FIRST (rule out)',
            'If malaria negative → consider typhoid',
            'Consider empiric antibiotics if symptoms >5 days',
            'Encourage fluids',
            'Follow up in 3-5 days'
        ],
        recommendedActionsFr: [
            'Tester le paludisme',
            'Si négatif → typhoïde',
            'Antibiotiques empiriques si >5 jours',
            'Liquides',
            'Suivi 3-5 jours'
        ],
        returnImmediatelyIf: [
            '🚨 Severe abdominal pain',
            '🚨 Bloody stool',
            '🚨 Confusion',
            '🚨 Signs of shock'
        ],
        returnImmediatelyIfFr: ['🚨 Douleur sévère', '🚨 Sang dans les selles', '🚨 Confusion', '🚨 Choc'],
        return24hIf: ['Fever worsening', 'Increasing weakness'],
        return24hIfFr: ['Fièvre s\'aggrave', 'Faiblesse croissante'],
        return48hIf: ['⏰ Fever not improving after 3 days', '⏰ Abdominal pain persists'],
        return48hIfFr: ['⏰ Fièvre non améliorée', '⏰ Douleur persiste'],
        source: 'WHO Typhoid Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 11: NEONATAL FEVER
    // ================================================
    {
        id: 'FEVER_T3_NEONATAL',
        name: 'Fever in Newborn',
        tier: 1,
        priority: 2,
        requiredSymptoms: ['fever'],
        ageMax: 0.08,
        title: '🚨 FEVER IN NEWBORN — Emergency',
        titleFr: '🚨 FIÈVRE CHEZ LE NOUVEAU-NÉ',
        summary: 'Any fever in a newborn under 28 days is a medical emergency.',
        summaryFr: 'Toute fièvre chez un nouveau-né est une urgence.',
        possibleConditions: [
            { name: 'Neonatal sepsis', nameFr: 'Sepsis néonatal', likelihood: 'very_likely' },
            { name: 'Meningitis', nameFr: 'Méningite', likelihood: 'likely' },
            { name: 'Pneumonia', nameFr: 'Pneumonie', likelihood: 'possible' },
            { name: 'Other serious infection', nameFr: 'Autre infection grave', likelihood: 'possible' }
        ],
        recommendedActions: [
            '🚨 REFER TO HOSPITAL IMMEDIATELY',
            'Keep baby warm (kangaroo care)',
            'Support breastfeeding if possible',
            'Give first-dose antibiotic if protocol allows',
            'Do NOT delay for tests'
        ],
        recommendedActionsFr: [
            '🚨 RÉFÉRER À L\'HÔPITAL IMMÉDIATEMENT',
            'Garder le bébé au chaud',
            'Soutenir l\'allaitement',
            'Première dose antibiotique',
            'Ne pas retarder'
        ],
        returnImmediatelyIf: ['Not applicable — transfer NOW'],
        returnImmediatelyIfFr: ['Non applicable — transférer'],
        return24hIf: ['Not applicable'],
        return24hIfFr: ['Non applicable'],
        return48hIf: ['Follow up with receiving hospital'],
        return48hIfFr: ['Suivi avec hôpital'],
        source: 'WHO Neonatal Care Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 12: HIV + FEVER
    // ================================================
    {
        id: 'FEVER_T3_HIV',
        name: 'Fever in Known HIV+ Patient',
        tier: 2,
        priority: 11,
        requiredSymptoms: ['fever', 'hiv_positive'],
        title: 'Fever in HIV+ Patient — Broad Differential',
        titleFr: 'Fièvre chez Patient VIH+',
        summary: 'HIV+ patients with fever need broader investigation.',
        summaryFr: 'Patients VIH+ avec fièvre nécessitent une investigation large.',
        possibleConditions: [
            { name: 'Malaria', nameFr: 'Paludisme', likelihood: 'likely' },
            { name: 'Tuberculosis', nameFr: 'Tuberculose', likelihood: 'possible' },
            { name: 'Opportunistic infection', nameFr: 'Infection opportuniste', likelihood: 'possible' },
            { name: 'Pneumonia (PCP)', nameFr: 'Pneumonie (PCP)', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Test for malaria',
            'Screen for TB (cough >2 weeks?)',
            'Check for other opportunistic infections',
            'Refer to HIV clinic',
            'Do NOT stop antiretroviral therapy',
            'Test for other STIs if indicated'
        ],
        recommendedActionsFr: [
            'Tester le paludisme',
            'Dépister la tuberculose',
            'Vérifier autres infections',
            'Référer à la clinique VIH',
            'Ne pas arrêter les ARV'
        ],
        returnImmediatelyIf: ['Difficulty breathing', 'Severe weight loss', 'Chronic diarrhea'],
        returnImmediatelyIfFr: ['Difficulté à respirer', 'Perte de poids', 'Diarrhée chronique'],
        return24hIf: ['Fever persists'],
        return24hIfFr: ['Fièvre persiste'],
        return48hIf: ['Follow up at HIV clinic'],
        return48hIfFr: ['Suivi clinique VIH'],
        source: 'WHO HIV Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // PRIORITY 99: CATCH-ALL
    // ================================================
    {
        id: 'FEVER_T2_GENERAL',
        name: 'Fever Without Danger Signs',
        tier: 2,
        priority: 99,
        requiredSymptoms: ['fever'],
        excludedSymptoms: [
            'danger_convulsions', 'danger_unable_drink', 'danger_vomits_everything',
            'danger_lethargic', 'danger_chest_indrawing', 'danger_severe_dehydration', 'danger_bleeding'
        ],
        title: 'Fever — General Assessment',
        titleFr: 'Fièvre — Évaluation générale',
        summary: 'Patient has fever but no danger signs. Follow the fever management protocol.',
        summaryFr: 'Le patient a de la fièvre mais sans signes de danger.',
        possibleConditions: [
            { name: 'Malaria', nameFr: 'Paludisme', likelihood: 'likely' },
            { name: 'Typhoid fever', nameFr: 'Fièvre typhoïde', likelihood: 'possible' },
            { name: 'Viral illness', nameFr: 'Maladie virale', likelihood: 'possible' },
            { name: 'Other bacterial infection', nameFr: 'Autre infection', likelihood: 'unlikely' }
        ],
        recommendedActions: [
            'Test for malaria with RDT (if available)',
            'If RDT positive → treat malaria per protocol',
            'If RDT negative → look for other causes',
            'Prescribe antipyretics (paracetamol)',
            'Encourage oral fluids',
            'Return in 48 hours if no improvement'
        ],
        recommendedActionsFr: [
            'Tester le paludisme',
            'Si positif → traiter',
            'Si négatif → autres causes',
            'Paracétamol',
            'Liquides',
            'Retour dans 48h'
        ],
        returnImmediatelyIf: [
            '🚨 Any danger sign develops',
            '🚨 Sore throat (possible Lassa)',
            '🚨 Bleeding',
            '🚨 Facial swelling',
            '🚨 Difficulty breathing'
        ],
        returnImmediatelyIfFr: [
            '🚨 Signe de danger',
            '🚨 Mal de gorge (Lassa)',
            '🚨 Saignement',
            '🚨 Gonflement du visage',
            '🚨 Difficulté à respirer'
        ],
        return24hIf: ['Fever high and unresponsive to paracetamol', 'Vomiting everything'],
        return24hIfFr: ['Fièvre élevée non responsive', 'Vomit tout'],
        return48hIf: ['⏰ Fever still present after 48 hours', '⏰ Not improving'],
        return48hIfFr: ['⏰ Fièvre après 48h', '⏰ Pas d\'amélioration'],
        source: 'Liberia National Malaria Control Program',
        updatedAt: '2026-01'
    }
];