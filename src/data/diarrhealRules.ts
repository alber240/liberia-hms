// Clinical rules for diarrheal syndrome
// Based on WHO Diarrhea Guidelines + Liberia IDSR

import { ClinicalRule } from './feverRules';

export const DIARRHEAL_RULES: ClinicalRule[] = [

    // ================================================
    // TIER 1: CHOLERA SUSPECTED (EMERGENCY — IDSR IMMEDIATE)
    // ================================================
    {
        id: 'DIAR_T1_CHOLERA',
        name: 'Suspected Cholera',
        tier: 1,
        priority: 1,
        requiredSymptoms: ['watery_diarrhea'],
        anyOfSymptoms: ['danger_severe_dehydration', 'vomiting', 'danger_lethargic'],
        title: '🚨 SUSPECTED CHOLERA — Immediate Action',
        titleFr: '🚨 CHOLÉRA SUSPECTÉ — Action Immédiate',
        summary: 'Profuse watery diarrhea with severe dehydration. Cholera must be ruled out.',
        summaryFr: 'Diarrhée aqueuse profuse avec déshydratation sévère. Choléra à exclure.',
        possibleConditions: [
            { name: 'Cholera (SUSPECTED)', nameFr: 'Choléra (SUSPECTÉ)', likelihood: 'very_likely' },
            { name: 'Severe gastroenteritis', nameFr: 'Gastro-entérite sévère', likelihood: 'possible' },
            { name: 'Other severe diarrheal disease', nameFr: 'Autre maladie diarrhéique', likelihood: 'possible' }
        ],
        recommendedActions: [
            '🚨 ISOLATE the patient immediately',
            'START aggressive rehydration (ORS + IV fluids)',
            'Use strict hygiene precautions',
            'NOTIFY District Surveillance Officer WITHIN 24 HOURS',
            'Complete IDSR Case-Based Reporting Form',
            'Collect stool sample for culture',
            'Chlorinate water sources if suspected'
        ],
        recommendedActionsFr: [
            '🚨 ISOLER le patient immédiatement',
            'RÉHYDRATATION agressive (SRO + IV)',
            'Précautions d\'hygiène strictes',
            'NOTIFIER dans les 24H',
            'Remplir le formulaire IDSR',
            'Prélever un échantillon de selles',
            'Chlorer les sources d\'eau'
        ],
        returnImmediatelyIf: [
            '🚨 Signs of severe dehydration',
            '🚨 Sunken eyes',
            '🚨 Skin pinch stays up',
            '🚨 Unable to drink',
            '🚨 Unconscious or lethargic'
        ],
        returnImmediatelyIfFr: [
            '🚨 Déshydratation sévère',
            '🚨 Yeux enfoncés',
            '🚨 Pli cutané persistant',
            '🚨 Incapable de boire',
            '🚨 Inconscient'
        ],
        return24hIf: ['Not applicable — patient should be admitted'],
        return24hIfFr: ['Non applicable — hospitaliser'],
        return48hIf: ['Follow up after rehydration'],
        return48hIfFr: ['Suivi après réhydratation'],
        source: 'Liberia IDSR Technical Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 1: SEVERE DEHYDRATION
    // ================================================
    {
        id: 'DIAR_T1_SEVERE_DEHYDRATION',
        name: 'Severe Dehydration',
        tier: 1,
        priority: 2,
        requiredSymptoms: ['diarrhea'],
        anyOfSymptoms: ['danger_severe_dehydration', 'danger_lethargic', 'danger_unable_drink'],
        title: '🚨 SEVERE DEHYDRATION — Emergency',
        titleFr: '🚨 DÉSHYDRATATION SÉVÈRE — Urgence',
        summary: 'Patient with diarrhea and signs of severe dehydration. IV fluids needed NOW.',
        summaryFr: 'Patient avec diarrhée et déshydratation sévère. Fluides IV nécessaires.',
        possibleConditions: [
            { name: 'Severe dehydration', nameFr: 'Déshydratation sévère', likelihood: 'very_likely' },
            { name: 'Cholera', nameFr: 'Choléra', likelihood: 'possible' },
            { name: 'Severe gastroenteritis', nameFr: 'Gastro-entérite sévère', likelihood: 'possible' }
        ],
        recommendedActions: [
            '🚨 START IV fluids IMMEDIATELY (Ringer\'s Lactate)',
            'Give ORS as soon as patient can drink',
            'Check for underlying cause (cholera?)',
            'REFER to hospital if not improving',
            'Monitor urine output',
            'Weigh patient for fluid calculation'
        ],
        recommendedActionsFr: [
            '🚨 FLUIDES IV IMMÉDIATEMENT (Ringer Lactate)',
            'SRO dès que possible',
            'Vérifier la cause (choléra?)',
            'RÉFÉRER si pas d\'amélioration',
            'Surveiller la diurèse',
            'Peser le patient'
        ],
        returnImmediatelyIf: ['Not applicable — emergency treatment now'],
        returnImmediatelyIfFr: ['Non applicable — traitement immédiat'],
        return24hIf: ['Not applicable'],
        return24hIfFr: ['Non applicable'],
        return48hIf: ['Follow up after rehydration complete'],
        return48hIfFr: ['Suivi après réhydratation'],
        source: 'WHO Diarrhea Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 2: DYSENTERY (BLOODY DIARRHEA)
    // ================================================
    {
        id: 'DIAR_T2_DYSENTERY',
        name: 'Dysentery (Bloody Diarrhea)',
        tier: 2,
        priority: 3,
        requiredSymptoms: ['diarrhea', 'bloody_diarrhea'],
        title: '⚠️ Dysentery — Bacterial Infection',
        titleFr: '⚠️ Dysenterie — Infection Bactérienne',
        summary: 'Bloody diarrhea suggests bacterial dysentery (Shigella). Treat with antibiotics.',
        summaryFr: 'Diarrhée sanglante suggère dysenterie. Traiter avec antibiotiques.',
        possibleConditions: [
            { name: 'Shigellosis (dysentery)', nameFr: 'Shigellose (dysenterie)', likelihood: 'very_likely' },
            { name: 'Amebic dysentery', nameFr: 'Dysenterie amibienne', likelihood: 'possible' },
            { name: 'Invasive E. coli', nameFr: 'E. coli invasif', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Give Ciprofloxacin (or Azithromycin for children)',
            'Give ORS for hydration',
            'Encourage fluids',
            'Check for complications (dehydration)',
            'NOTIFY if outbreak suspected',
            'Follow up in 2 days'
        ],
        recommendedActionsFr: [
            'Ciprofloxacine (ou Azithromycine)',
            'SRO pour hydratation',
            'Encourager les liquides',
            'Vérifier complications',
            'NOTIFIER si épidémie suspectée',
            'Suivi dans 2 jours'
        ],
        returnImmediatelyIf: [
            '🚨 Severe dehydration',
            '🚨 Bloody diarrhea + high fever',
            '🚨 Convulsions',
            '🚨 Unable to drink'
        ],
        returnImmediatelyIfFr: ['🚨 Déshydratation sévère', '🚨 Diarrhée + fièvre élevée', '🚨 Convulsions', '🚨 Incapable de boire'],
        return24hIf: ['Blood in stool persists', 'Fever worsens'],
        return24hIfFr: ['Sang persiste', 'Fièvre s\'aggrave'],
        return48hIf: ['⏰ No improvement after 2 days', '⏰ Still passing blood'],
        return48hIfFr: ['⏰ Pas d\'amélioration après 2 jours', '⏰ Sang persiste'],
        source: 'WHO Dysentery Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 2: CHOLERA (SUSPECTED, MILD)
    // ================================================
    {
        id: 'DIAR_T2_CHOLERA_MILD',
        name: 'Possible Cholera (Mild)',
        tier: 2,
        priority: 4,
        requiredSymptoms: ['watery_diarrhea'],
        anyOfSymptoms: ['vomiting', 'abdominal_pain'],
        excludedSymptoms: ['danger_severe_dehydration', 'danger_lethargic'],
        title: 'Possible Cholera — Monitor Closely',
        titleFr: 'Choléra Possible — Surveillance Étroite',
        summary: 'Profuse watery diarrhea without severe dehydration. Monitor and treat aggressively.',
        summaryFr: 'Diarrhée aqueuse profuse sans déshydratation sévère.',
        possibleConditions: [
            { name: 'Cholera (SUSPECTED)', nameFr: 'Choléra (SUSPECTÉ)', likelihood: 'likely' },
            { name: 'Viral gastroenteritis', nameFr: 'Gastro-entérite virale', likelihood: 'possible' },
            { name: 'Other diarrheal disease', nameFr: 'Autre maladie diarrhéique', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Give ORS aggressively',
            'Encourage fluids continuously',
            'Monitor hydration status hourly',
            'NOTIFY if multiple cases appear',
            'Collect stool sample',
            'Isolate if cholera confirmed'
        ],
        recommendedActionsFr: [
            'SRO agressif',
            'Liquides continus',
            'Surveiller l\'hydratation',
            'NOTIFIER si cas multiples',
            'Prélever un échantillon',
            'Isoler si confirmé'
        ],
        returnImmediatelyIf: [
            '🚨 Severe dehydration develops',
            '🚨 Sunken eyes',
            '🚨 Unable to drink',
            '🚨 Skin pinch stays up'
        ],
        returnImmediatelyIfFr: ['🚨 Déshydratation sévère', '🚨 Yeux enfoncés', '🚨 Incapable de boire', '🚨 Pli cutané persistant'],
        return24hIf: ['Diarrhea persists', 'Signs of dehydration'],
        return24hIfFr: ['Diarrhée persiste', 'Signes de déshydratation'],
        return48hIf: ['⏰ Diarrhea > 2 days', '⏰ Not improving'],
        return48hIfFr: ['⏰ Diarrhée > 2 jours', '⏰ Pas d\'amélioration'],
        source: 'Liberia IDSR + WHO Cholera Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 2: ACUTE DIARRHEA IN CHILD
    // ================================================
    {
        id: 'DIAR_T2_CHILD_DIARRHEA',
        name: 'Acute Diarrhea in Child',
        tier: 2,
        priority: 5,
        requiredSymptoms: ['diarrhea'],
        ageMax: 5,
        excludedSymptoms: ['danger_severe_dehydration', 'danger_lethargic', 'bloody_diarrhea'],
        title: 'Acute Diarrhea in Child — IMCI Protocol',
        titleFr: 'Diarrhée Aiguë chez l\'Enfant — PCIME',
        summary: 'Child with acute diarrhea. Assess hydration and manage per IMCI.',
        summaryFr: 'Enfant avec diarrhée aiguë. Évaluer hydratation.',
        possibleConditions: [
            { name: 'Acute gastroenteritis', nameFr: 'Gastro-entérite aiguë', likelihood: 'very_likely' },
            { name: 'Rotavirus', nameFr: 'Rotavirus', likelihood: 'likely' },
            { name: 'Malaria with GI symptoms', nameFr: 'Paludisme avec symptômes GI', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Assess hydration (skin pinch, eyes, mouth)',
            'Give ORS (Plan A, B, or C based on hydration)',
            'Give Zinc for 10-14 days (if < 5 years)',
            'Continue feeding',
            'Give Vitamin A if not given in past 6 months',
            'Test for malaria if fever present'
        ],
        recommendedActionsFr: [
            'Évaluer l\'hydratation',
            'SRO selon plan A, B ou C',
            'Zinc pendant 10-14 jours',
            'Continuer l\'alimentation',
            'Vitamine A si non donnée',
            'Tester le paludisme si fièvre'
        ],
        returnImmediatelyIf: [
            '🚨 Signs of severe dehydration',
            '🚨 Blood in stool',
            '🚨 Persistent vomiting',
            '🚨 Unable to drink',
            '🚨 Fever develops'
        ],
        returnImmediatelyIfFr: ['🚨 Déshydratation sévère', '🚨 Sang dans les selles', '🚨 Vomissements', '🚨 Incapable de boire', '🚨 Fièvre'],
        return24hIf: ['Diarrhea persists', 'Dehydration signs appear'],
        return24hIfFr: ['Diarrhée persiste', 'Déshydratation'],
        return48hIf: ['⏰ Diarrhea > 3 days', '⏰ Child not improving'],
        return48hIfFr: ['⏰ Diarrhée > 3 jours', '⏰ Enfant ne s\'améliore pas'],
        source: 'WHO IMCI + Liberia Diarrhea Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 2: PERSISTENT DIARRHEA
    // ================================================
    {
        id: 'DIAR_T2_PERSISTENT',
        name: 'Persistent Diarrhea (>14 days)',
        tier: 2,
        priority: 6,
        requiredSymptoms: ['diarrhea'],
        title: 'Persistent Diarrhea — Nutritional Risk',
        titleFr: 'Diarrhée Persistante — Risque Nutritionnel',
        summary: 'Diarrhea lasting more than 14 days. High risk of malnutrition.',
        summaryFr: 'Diarrhée > 14 jours. Risque élevé de malnutrition.',
        possibleConditions: [
            { name: 'Persistent diarrhea', nameFr: 'Diarrhée persistante', likelihood: 'very_likely' },
            { name: 'Malabsorption syndrome', nameFr: 'Syndrome de malabsorption', likelihood: 'possible' },
            { name: 'Parasitic infection', nameFr: 'Infection parasitaire', likelihood: 'possible' },
            { name: 'HIV-related enteropathy', nameFr: 'Entéropathie VIH', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Assess nutritional status (MUAC, weight for height)',
            'Give Zinc supplementation',
            'Give multivitamins',
            'Consider parasitic treatment (Albendazole)',
            'Test for HIV if not known',
            'Refer to nutrition program'
        ],
        recommendedActionsFr: [
            'Évaluer l\'état nutritionnel (PB, poids/taille)',
            'Supplément de Zinc',
            'Multivitamines',
            'Albendazole (parasites)',
            'Tester le VIH',
            'Référer au programme nutrition'
        ],
        returnImmediatelyIf: [
            '🚨 Severe malnutrition (MUAC < 11.5cm)',
            '🚨 Severe dehydration',
            '🚨 Persistent vomiting',
            '🚨 Blood in stool'
        ],
        returnImmediatelyIfFr: ['🚨 Malnutrition sévère', '🚨 Déshydratation sévère', '🚨 Vomissements', '🚨 Sang dans les selles'],
        return24hIf: ['Worsening diarrhea', 'Weight loss'],
        return24hIfFr: ['Diarrhée s\'aggrave', 'Perte de poids'],
        return48hIf: ['⏰ Follow up nutrition program', '⏰ Nutritional assessment'],
        return48hIfFr: ['⏰ Suivi programme nutrition', '⏰ Évaluation nutritionnelle'],
        source: 'WHO Persistent Diarrhea Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 1: DIARRHEA + MALNUTRITION
    // ================================================
    {
        id: 'DIAR_T1_MALNUTRITION',
        name: 'Diarrhea with Severe Malnutrition',
        tier: 1,
        priority: 3,
        requiredSymptoms: ['diarrhea', 'malnutrition'],
        title: '🚨 DIARRHEA + SEVERE MALNUTRITION — Emergency',
        titleFr: '🚨 DIARRHÉE + MALNUTRITION SÉVÈRE — Urgence',
        summary: 'Diarrhea in severely malnourished child. High mortality risk. Refer immediately.',
        summaryFr: 'Diarrhée chez enfant malnutri sévère. Risque élevé de mortalité.',
        possibleConditions: [
            { name: 'Complicated diarrhea with malnutrition', nameFr: 'Diarrhée compliquée avec malnutrition', likelihood: 'very_likely' },
            { name: 'Sepsis', nameFr: 'Sepsis', likelihood: 'possible' },
            { name: 'Severe infection', nameFr: 'Infection sévère', likelihood: 'possible' }
        ],
        recommendedActions: [
            '🚨 REFER TO STABILIZATION CENTER IMMEDIATELY',
            'Start F-75 therapeutic milk if available',
            'Give antibiotics (per malnutrition protocol)',
            'Give Vitamin A',
            'Correct electrolytes (ReSoMal for ORS)',
            'Do NOT use standard ORS (high sodium)'
        ],
        recommendedActionsFr: [
            '🚨 RÉFÉRER AU CENTRE DE STABILISATION',
            'Lait thérapeutique F-75 si disponible',
            'Antibiotiques (protocole malnutrition)',
            'Vitamine A',
            'Corriger les électrolytes (ReSoMal)',
            'NE PAS utiliser SRO standard'
        ],
        returnImmediatelyIf: ['Not applicable — refer NOW'],
        returnImmediatelyIfFr: ['Non applicable — référer immédiatement'],
        return24hIf: ['Not applicable'],
        return24hIfFr: ['Non applicable'],
        return48hIf: ['Follow up at stabilization center'],
        return48hIfFr: ['Suivi au centre'],
        source: 'WHO Malnutrition Guidelines',
        updatedAt: '2026-01'
    },

    // ================================================
    // TIER 2: TYPHOID WITH GI SYMPTOMS
    // ================================================
    {
        id: 'DIAR_T2_TYPHOID',
        name: 'Typhoid Fever with GI Symptoms',
        tier: 2,
        priority: 7,
        requiredSymptoms: ['fever', 'diarrhea'],
        anyOfSymptoms: ['abdominal_pain', 'constipation', 'headache'],
        excludedSymptoms: ['sore_throat', 'rash'],
        title: 'Possible Typhoid with Diarrhea',
        titleFr: 'Suspicion de Typhoïde avec Diarrhée',
        summary: 'Fever with diarrhea and abdominal pain. Consider typhoid.',
        summaryFr: 'Fièvre avec diarrhée et douleur abdominale.',
        possibleConditions: [
            { name: 'Typhoid fever', nameFr: 'Fièvre typhoïde', likelihood: 'likely' },
            { name: 'Malaria with GI symptoms', nameFr: 'Paludisme avec symptômes GI', likelihood: 'possible' },
            { name: 'Gastroenteritis', nameFr: 'Gastro-entérite', likelihood: 'possible' }
        ],
        recommendedActions: [
            'Test for malaria FIRST (rule out)',
            'If malaria negative → consider typhoid',
            'Consider antibiotics (Ciprofloxacin)',
            'Give ORS for hydration',
            'Encourage fluids',
            'Follow up in 3-5 days'
        ],
        recommendedActionsFr: [
            'Tester le paludisme',
            'Si négatif → typhoïde',
            'Ciprofloxacine',
            'SRO pour hydratation',
            'Liquides',
            'Suivi 3-5 jours'
        ],
        returnImmediatelyIf: [
            '🚨 Severe abdominal pain',
            '🚨 Bloody stool',
            '🚨 Confusion',
            '🚨 Signs of shock'
        ],
        returnImmediatelyIfFr: ['🚨 Douleur abdominale sévère', '🚨 Sang dans les selles', '🚨 Confusion', '🚨 Choc'],
        return24hIf: ['Fever worsens', 'Diarrhea persists'],
        return24hIfFr: ['Fièvre s\'aggrave', 'Diarrhée persiste'],
        return48hIf: ['⏰ No improvement after 3 days', '⏰ Fever persists'],
        return48hIfFr: ['⏰ Pas d\'amélioration', '⏰ Fièvre persiste'],
        source: 'WHO Typhoid Guidelines',
        updatedAt: '2026-01'
    }
];