// Clinical rules for respiratory syndrome
// Based on WHO IMCI + Liberia IDSR

import { ClinicalRule } from './feverRules';

export const RESPIRATORY_RULES: ClinicalRule[] = [

    // ================================================
    // TIER 1: SEVERE PNEUMONIA (EMERGENCY)
    // ================================================
    {
        id: 'RESP_T1_SEVERE_PNEUMONIA_CHILD',
        name: 'Severe Pneumonia in Child',
        tier: 1,
        priority: 1,
        requiredSymptoms: ['cough'],
        anyOfSymptoms: ['danger_chest_indrawing', 'danger_stridor', 'difficulty_breathing'],
        ageMax: 5,
        title: '🚨 SEVERE PNEUMONIA — Emergency',
        titleFr: '🚨 PNEUMONIE SÉVÈRE — Urgence',
        summary: 'Child with cough and danger signs of severe pneumonia. Immediate referral.',
        summaryFr: 'Enfant avec toux et signes de pneumonie sévère.',
        possibleConditions: [
            { name: 'Severe pneumonia', nameFr: 'Pneumonie sévère', likelihood: 'very_likely' },
            { name: 'Severe malaria', nameFr: 'Paludisme grave', likelihood: 'possible' },
            { name: 'Other severe infection', nameFr: 'Autre infection grave', likelihood: 'possible' }
        ],
        recommendedActions: [
            'REFER TO HOSPITAL IMMEDIATELY',
            'Give first dose of antibiotic (Amoxicillin or Cotrimoxazole)',
            'Give oxygen if available',
            'Keep child warm',
            'Do NOT delay for tests'
        ],
        recommendedActionsFr: [
            'RÉFÉRER À L\'HÔPITAL IMMÉDIATEMENT',
            'Première dose antibiotique',
            'Oxygène si disponible',
            'Garder au chaud'
        ],
        returnImmediatelyIf: ['Not applicable — transfer NOW'],
        returnImmediatelyIfFr: ['Non applicable — transférer'],
        return24hIf: ['Not applicable'],
        return24hIfFr: ['Non applicable'],
        return48hIf: ['Follow up with receiving facility'],
        return48hIfFr: ['Suivi avec hôpital'],
        source: 'WHO IMCI Chart Booklet',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 2: PNEUMONIA (CHILD)
    // ================================================
    {
        id: 'RESP_T2_PNEUMONIA_CHILD',
        name: 'Pneumonia in Child',
        tier: 2,
        priority: 2,
        requiredSymptoms: ['cough', 'fast_breathing'],
        ageMax: 5,
        excludedSymptoms: ['danger_chest_indrawing', 'danger_stridor'],
        title: 'Pneumonia in Child — IMCI Protocol',
        titleFr: 'Pneumonie chez l\'enfant — Protocole PCIME',
        summary: 'Child with cough and fast breathing suggests pneumonia.',
        summaryFr: 'Enfant avec toux et respiration rapide suggère pneumonie.',
        possibleConditions: [
            { name: 'Pneumonia', nameFr: 'Pneumonie', likelihood: 'very_likely' },
            { name: 'Malaria', nameFr: 'Paludisme', likelihood: 'possible' },
            { name: 'Bronchiolitis', nameFr: 'Bronchiolite', likelihood: 'possible' },
            { name: 'Upper respiratory infection', nameFr: 'Infection respiratoire', likelihood: 'unlikely' }
        ],
        recommendedActions: [
            'Give Amoxicillin (or Cotrimoxazole) for 5 days',
            'Give paracetamol for fever',
            'Encourage fluids',
            'Return in 3 days if not improving',
            'Return immediately if breathing worsens'
        ],
        recommendedActionsFr: [
            'Amoxicilline 5 jours',
            'Paracétamol pour fièvre',
            'Encourager les liquides',
            'Retour dans 3 jours si pas d\'amélioration'
        ],
        returnImmediatelyIf: [
            '🚨 Difficulty breathing worsens',
            '🚨 Chest indrawing appears',
            '🚨 Unable to drink or feed',
            '🚨 Blue lips or face'
        ],
        returnImmediatelyIfFr: [
            '🚨 Difficulté à respirer',
            '🚨 Tirage',
            '🚨 Incapable de boire',
            '🚨 Lèvres bleues'
        ],
        return24hIf: ['Fever persists', 'Breathing still fast'],
        return24hIfFr: ['Fièvre persiste', 'Respiration rapide'],
        return48hIf: ['⏰ No improvement in 48 hours', '⏰ Still coughing'],
        return48hIfFr: ['⏰ Pas d\'amélioration', '⏰ Toujours en train de tousser'],
        source: 'WHO IMCI Chart Booklet',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 2: PNEUMONIA (ADULT)
    // ================================================
    {
        id: 'RESP_T2_PNEUMONIA_ADULT',
        name: 'Pneumonia in Adult',
        tier: 2,
        priority: 3,
        requiredSymptoms: ['fever', 'cough', 'chest_pain'],
        anyOfSymptoms: ['difficulty_breathing', 'fast_breathing'],
        ageMin: 15,
        title: 'Pneumonia in Adult',
        titleFr: 'Pneumonie chez l\'adulte',
        summary: 'Fever, cough, and chest pain suggest pneumonia in adult.',
        summaryFr: 'Fièvre, toux et douleur thoracique suggèrent pneumonie.',
        possibleConditions: [
            { name: 'Bacterial pneumonia', nameFr: 'Pneumonie bactérienne', likelihood: 'very_likely' },
            { name: 'Viral pneumonia', nameFr: 'Pneumonie virale', likelihood: 'possible' },
            { name: 'Tuberculosis (rule out)', nameFr: 'Tuberculose', likelihood: 'possible' },
            { name: 'COVID-19', nameFr: 'COVID-19', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Start antibiotics (Amoxicillin or per national protocol)',
            'Give paracetamol for fever',
            'Encourage fluids and rest',
            'Chest X-ray if available',
            'Return in 3 days if not improving'
        ],
        recommendedActionsFr: [
            'Commencer les antibiotiques',
            'Paracétamol',
            'Liquides et repos',
            'Radiographie si disponible',
            'Retour dans 3 jours'
        ],
        returnImmediatelyIf: [
            '🚨 Difficulty breathing worsens',
            '🚨 Chest pain increases',
            '🚨 Coughing up blood',
            '🚨 Confusion or altered consciousness'
        ],
        returnImmediatelyIfFr: [
            '🚨 Difficulté à respirer',
            '🚨 Douleur thoracique',
            '🚨 Toux avec sang',
            '🚨 Confusion'
        ],
        return24hIf: ['Fever persists', 'Chest pain worsens'],
        return24hIfFr: ['Fièvre persiste', 'Douleur s\'aggrave'],
        return48hIf: ['⏰ No improvement after 3 days', '⏰ Symptoms worsening'],
        return48hIfFr: ['⏰ Pas d\'amélioration', '⏰ Aggravation'],
        source: 'WHO Pneumonia Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 3: TB SUSPICION
    // ================================================
    {
        id: 'RESP_T3_TB_SUSPECT',
        name: 'Possible Tuberculosis',
        tier: 3,
        priority: 4,
        requiredSymptoms: ['cough_over_2_weeks'],
        anyOfSymptoms: ['night_sweats', 'weight_loss', 'fever', 'blood_in_sputum'],
        title: '⚠️ Possible Tuberculosis — Investigate',
        titleFr: '⚠️ Suspicion de Tuberculose',
        summary: 'Cough for more than 2 weeks with other symptoms suggests TB.',
        summaryFr: 'Toux depuis plus de 2 semaines suggère TB.',
        possibleConditions: [
            { name: 'Pulmonary tuberculosis', nameFr: 'Tuberculose pulmonaire', likelihood: 'very_likely' },
            { name: 'Chronic bronchitis', nameFr: 'Bronchite chronique', likelihood: 'possible' },
            { name: 'Lung cancer', nameFr: 'Cancer du poumon', likelihood: 'unlikely' },
            { name: 'Bronchiectasis', nameFr: 'Bronchectasie', likelihood: 'unlikely' }
        ],
        recommendedActions: [
            '🚨 REFER for TB testing (sputum AFB or GeneXpert)',
            'Collect 2-3 sputum samples',
            'Isolate patient if possible',
            'NOTIFY TB Program',
            'Screen household contacts',
            'Refer to TB clinic for DOTS enrollment'
        ],
        recommendedActionsFr: [
            '🚨 RÉFÉRER pour test TB',
            'Prélever 2-3 échantillons de crachats',
            'Isoler le patient si possible',
            'NOTIFIER le Programme TB',
            'Dépister les contacts',
            'Référer au programme DOTS'
        ],
        returnImmediatelyIf: [
            '🚨 Coughing up large amounts of blood',
            '🚨 Severe difficulty breathing',
            '🚨 High fever unresponsive',
            '🚨 Severe weight loss'
        ],
        returnImmediatelyIfFr: [
            '🚨 Toux avec beaucoup de sang',
            '🚨 Difficulté respiratoire sévère',
            '🚨 Fièvre élevée',
            '🚨 Perte de poids sévère'
        ],
        return24hIf: ['Fever high and unresponsive', 'Chest pain worsens'],
        return24hIfFr: ['Fièvre élevée', 'Douleur thoracique'],
        return48hIf: ['⏰ Results from TB test', '⏰ Follow up at TB clinic'],
        return48hIfFr: ['⏰ Résultats du test TB', '⏰ Suivi clinique TB'],
        source: 'WHO TB Guidelines + Liberia NTP',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 3: COVID-19 / INFLUENZA
    // ================================================
    {
        id: 'RESP_T3_COVID_FLU',
        name: 'Possible COVID-19 or Influenza',
        tier: 2,          // ← Changed from 3 to 2
        priority: 4,      // ← Lower number = higher priority
        requiredSymptoms: ['fever', 'cough'],
        anyOfSymptoms: ['loss_smell', 'body_aches', 'headache', 'sore_throat'],
        title: '⚠️ Possible COVID-19 or Influenza',
        titleFr: '⚠️ COVID-19 ou Grippe Possible',
        summary: 'Fever with cough and respiratory symptoms. Consider COVID-19 or flu.',
        summaryFr: 'Fièvre avec toux. Considérer COVID-19 ou grippe.',
        possibleConditions: [
            { name: 'Influenza', nameFr: 'Grippe', likelihood: 'likely' },
            { name: 'COVID-19', nameFr: 'COVID-19', likelihood: 'possible' },
            { name: 'Upper respiratory infection', nameFr: 'Infection respiratoire', likelihood: 'possible' },
            { name: 'Malaria', nameFr: 'Paludisme', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Isolate patient if COVID-19 suspected',
            'Test for COVID-19 if available',
            'Test for malaria (rule out)',
            'Give paracetamol for fever',
            'Encourage fluids and rest',
            'Monitor for difficulty breathing'
        ],
        recommendedActionsFr: [
            'Isoler si COVID-19 suspecté',
            'Tester COVID-19 si disponible',
            'Tester le paludisme',
            'Paracétamol',
            'Liquides et repos'
        ],
        returnImmediatelyIf: [
            '🚨 Difficulty breathing',
            '🚨 Chest pain',
            '🚨 Confusion',
            '🚨 Blue lips'
        ],
        returnImmediatelyIfFr: ['🚨 Difficulté à respirer', '🚨 Douleur thoracique', '🚨 Confusion', '🚨 Lèvres bleues'],
        return24hIf: ['Fever persists >3 days', 'Cough worsens'],
        return24hIfFr: ['Fièvre persiste', 'Toux s\'aggrave'],
        return48hIf: ['⏰ No improvement in 48 hours'],
        return48hIfFr: ['⏰ Pas d\'amélioration'],
        source: 'WHO COVID-19 Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 2: BRONCHITIS
    // ================================================
    {
        id: 'RESP_T2_BRONCHITIS',
        name: 'Acute Bronchitis',
        tier: 2,
        priority: 6,
        requiredSymptoms: ['cough'],
        anyOfSymptoms: ['productive_cough', 'chest_pain'],
        excludedSymptoms: ['fever', 'fast_breathing', 'difficulty_breathing'],
        title: 'Acute Bronchitis',
        titleFr: 'Bronchite Aiguë',
        summary: 'Cough without fever or fast breathing suggests bronchitis.',
        summaryFr: 'Toux sans fièvre suggère bronchite.',
        possibleConditions: [
            { name: 'Acute bronchitis', nameFr: 'Bronchite aiguë', likelihood: 'very_likely' },
            { name: 'Post-viral cough', nameFr: 'Toux post-virale', likelihood: 'possible' },
            { name: 'Asthma', nameFr: 'Asthme', likelihood: 'unlikely' }
        ],
        recommendedActions: [
            'Encourage fluids and rest',
            'Give honey for cough (if >1 year old)',
            'Avoid antibiotics (viral cause)',
            'Return if fever develops or worsens'
        ],
        recommendedActionsFr: [
            'Liquides et repos',
            'Miel pour la toux (si >1 an)',
            'Éviter les antibiotiques',
            'Retour si fièvre ou aggravation'
        ],
        returnImmediatelyIf: [
            '🚨 Fever develops',
            '🚨 Difficulty breathing',
            '🚨 Chest pain worsens',
            '🚨 Coughing up blood'
        ],
        returnImmediatelyIfFr: ['🚨 Fièvre', '🚨 Difficulté à respirer', '🚨 Douleur thoracique', '🚨 Sang dans les crachats'],
        return24hIf: ['Cough worsens significantly'],
        return24hIfFr: ['Toux s\'aggrave'],
        return48hIf: ['⏰ Cough persists > 10 days', '⏰ Fever develops'],
        return48hIfFr: ['⏰ Toux > 10 jours', '⏰ Fièvre'],
        source: 'WHO Respiratory Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 2: ASTHMA / WHEEZING
    // ================================================
    {
        id: 'RESP_T2_ASTHMA',
        name: 'Possible Asthma',
        tier: 2,
        priority: 7,
        requiredSymptoms: ['wheezing'],
        anyOfSymptoms: ['difficulty_breathing', 'cough', 'chest_pain'],
        excludedSymptoms: ['fever', 'fast_breathing'],
        title: 'Possible Asthma — Wheezing',
        titleFr: 'Asthme Possible — Respiration sifflante',
        summary: 'Wheezing with difficulty breathing suggests asthma.',
        summaryFr: 'Respiration sifflante suggère asthme.',
        possibleConditions: [
            { name: 'Asthma', nameFr: 'Asthme', likelihood: 'very_likely' },
            { name: 'Bronchiolitis (child)', nameFr: 'Bronchiolite', likelihood: 'possible' },
            { name: 'Allergic reaction', nameFr: 'Réaction allergique', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Give Salbutamol (inhaler or nebulizer)',
            'Repeat if needed after 20 minutes',
            'Give oral steroids if severe',
            'Identify and avoid triggers',
            'Refer if no improvement'
        ],
        recommendedActionsFr: [
            'Salbutamol (inhalateur ou nébuliseur)',
            'Répéter si nécessaire',
            'Stéroïdes oraux si sévère',
            'Identifier les déclencheurs',
            'Référer si pas d\'amélioration'
        ],
        returnImmediatelyIf: [
            '🚨 Difficulty breathing worsens',
            '🚨 Cannot speak full sentences',
            '🚨 Blue lips or face',
            '🚨 No improvement after inhaler'
        ],
        returnImmediatelyIfFr: ['🚨 Difficulté à respirer', '🚨 Ne peut pas parler', '🚨 Lèvres bleues', '🚨 Pas d\'amélioration'],
        return24hIf: ['Wheezing persists'],
        return24hIfFr: ['Respiration sifflante persiste'],
        return48hIf: ['⏰ Recurrent wheezing', '⏰ Follow up for asthma plan'],
        return48hIfFr: ['⏰ Sifflements récurrents', '⏰ Suivi asthme'],
        source: 'WHO Asthma Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 3: PERTUSSIS (WHOOPING COUGH)
    // ================================================
    {
        id: 'RESP_T3_PERTUSSIS',
        name: 'Possible Pertussis (Whooping Cough)',
        tier: 3,
        priority: 8,
        requiredSymptoms: ['cough'],
        anyOfSymptoms: ['vomiting'],
        ageMax: 10,
        title: '⚠️ Possible Pertussis (Whooping Cough)',
        titleFr: '⚠️ Coqueluche Possible',
        summary: 'Child with severe cough and vomiting after cough suggests pertussis.',
        summaryFr: 'Enfant avec toux sévère et vomissements suggère coqueluche.',
        possibleConditions: [
            { name: 'Pertussis', nameFr: 'Coqueluche', likelihood: 'likely' },
            { name: 'Severe viral cough', nameFr: 'Toux virale sévère', likelihood: 'possible' },
            { name: 'Bronchitis', nameFr: 'Bronchite', likelihood: 'possible' }
        ],
        recommendedActions: [
            '🚨 NOTIFY District Surveillance Officer WITHIN 24 HOURS',
            'Complete IDSR Case-Based Reporting Form',
            'Isolate patient (highly contagious)',
            'Treat with Azithromycin or Erythromycin',
            'Check vaccination status of contacts',
            'Prophylaxis for close contacts'
        ],
        recommendedActionsFr: [
            '🚨 NOTIFIER dans les 24H',
            'Remplir le formulaire IDSR',
            'Isoler le patient',
            'Azithromycine ou Érythromycine',
            'Vérifier la vaccination des contacts',
            'Prophylaxie pour contacts'
        ],
        returnImmediatelyIf: [
            '🚨 Difficulty breathing',
            '🚨 Blue lips or face',
            '🚨 Apnea (stopping breathing)',
            '🚨 Seizures'
        ],
        returnImmediatelyIfFr: ['🚨 Difficulté à respirer', '🚨 Lèvres bleues', '🚨 Apnée', '🚨 Convulsions'],
        return24hIf: ['Cough worsens', 'Cannot feed'],
        return24hIfFr: ['Toux s\'aggrave', 'Ne peut pas s\'alimenter'],
        return48hIf: ['⏰ Follow up on test results'],
        return48hIfFr: ['⏰ Suivi des résultats'],
        source: 'Liberia IDSR Technical Guidelines',
        updatedAt: '2026-01'
    }
];