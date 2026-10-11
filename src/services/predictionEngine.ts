import { FEVER_RULES, ClinicalRule } from '../data/feverRules';
import { RESPIRATORY_RULES } from '../data/respiratoryRules';
import { DIARRHEAL_RULES } from '../data/diarrhealRules';
import { SymptomEntry, Prediction } from '../db/database';

// Combine all rules
const ALL_RULES: ClinicalRule[] = [
    ...FEVER_RULES,
    ...RESPIRATORY_RULES,
    ...DIARRHEAL_RULES
];

export interface PredictionInput {
    symptoms: string[];
    age: number;
    sex: 'M' | 'F';
    temperature?: number;
}

export interface PredictionOutput {
    matchedRule: ClinicalRule | null;
    confidence: number;
    tier: 1 | 2 | 3;
    allMatches: ClinicalRule[];
}

// ================================================
// CORE PREDICTION FUNCTION
// ================================================

export function predict(input: PredictionInput): PredictionOutput {
    const matchingRules = ALL_RULES.filter(rule => matchesRule(rule, input));

    if (matchingRules.length === 0) {
        return {
            matchedRule: null,
            confidence: 0,
            tier: 2,
            allMatches: []
        };
    }

    // Sort by tier (lower = higher priority) then by priority number
    matchingRules.sort((a, b) => {
        if (a.tier !== b.tier) return a.tier - b.tier;
        return a.priority - b.priority;
    });

    const bestMatch = matchingRules[0];

    return {
        matchedRule: bestMatch,
        confidence: calculateConfidence(bestMatch, input),
        tier: bestMatch.tier,
        allMatches: matchingRules
    };
}

// ================================================
// RULE MATCHING LOGIC
// ================================================

function matchesRule(rule: ClinicalRule, input: PredictionInput): boolean {
    const symptoms = new Set(input.symptoms);

    // Check required symptoms (ALL must be present)
    if (rule.requiredSymptoms) {
        for (const req of rule.requiredSymptoms) {
            if (!symptoms.has(req)) return false;
        }
    }

    // Check "any of" symptoms (at least ONE must be present)
    if (rule.anyOfSymptoms && rule.anyOfSymptoms.length > 0) {
        const hasAny = rule.anyOfSymptoms.some(s => symptoms.has(s));
        if (!hasAny) return false;
    }

    // Check excluded symptoms (NONE must be present)
    if (rule.excludedSymptoms) {
        for (const exc of rule.excludedSymptoms) {
            if (symptoms.has(exc)) return false;
        }
    }

    // Check age range
    if (rule.ageMin !== undefined && input.age < rule.ageMin) return false;
    if (rule.ageMax !== undefined && input.age > rule.ageMax) return false;

    // Check temperature
    if (rule.temperatureMin !== undefined) {
        if (!input.temperature || input.temperature < rule.temperatureMin) return false;
    }

    return true;
}

// ================================================
// CONFIDENCE CALCULATION (no fake scores)
// ================================================

function calculateConfidence(rule: ClinicalRule, input: PredictionInput): number {
    let base = 60;

    if (rule.tier === 1) base = 90;
    else if (rule.tier === 2) base = 70;

    const symptomBonus = Math.min(input.symptoms.length * 2, 15);

    return Math.min(base + symptomBonus, 95);
}

// ================================================
// CONVERT TO DATABASE RECORD
// ================================================

export function createPredictionRecord(
    symptomEntry: SymptomEntry,
    output: PredictionOutput
): Prediction | null {
    if (!output.matchedRule) return null;

    return {
        symptomEntryId: symptomEntry.id!,
        patientUhid: symptomEntry.patientUhid,
        patientName: symptomEntry.patientName,
        matchedRuleId: output.matchedRule.id,
        matchedRuleName: output.matchedRule.name,
        tier: output.matchedRule.tier,
        title: output.matchedRule.title,
        summary: output.matchedRule.summary,
        possibleConditions: output.matchedRule.possibleConditions.map(c => ({
            name: c.name,
            likelihood: c.likelihood
        })),
        recommendedActions: output.matchedRule.recommendedActions,
        returnImmediatelyIf: output.matchedRule.returnImmediatelyIf,
        return24hIf: output.matchedRule.return24hIf,
        return48hIf: output.matchedRule.return48hIf,
        confidence: output.confidence,
        createdAt: new Date().toISOString(),
        synced: 0
    };
}

// ================================================
// DEBUG: Show why no rule matched
// ================================================

export function debugNoMatch(input: PredictionInput): string {
    const symptoms = new Set(input.symptoms);
    const results: string[] = [];

    for (const rule of ALL_RULES) {
        let why = '';

        if (rule.requiredSymptoms) {
            const missing = rule.requiredSymptoms.filter(s => !symptoms.has(s));
            if (missing.length > 0) {
                why = `Missing required: ${missing.join(', ')}`;
            }
        }

        if (!why && rule.anyOfSymptoms && rule.anyOfSymptoms.length > 0) {
            const hasAny = rule.anyOfSymptoms.some(s => symptoms.has(s));
            if (!hasAny) {
                why = `Need at least one of: ${rule.anyOfSymptoms.join(', ')}`;
            }
        }

        if (!why && rule.excludedSymptoms) {
            const found = rule.excludedSymptoms.filter(s => symptoms.has(s));
            if (found.length > 0) {
                why = `Excluded symptom present: ${found.join(', ')}`;
            }
        }

        if (!why && rule.ageMax !== undefined && input.age > rule.ageMax) {
            why = `Age ${input.age} exceeds max ${rule.ageMax}`;
        }

        if (!why) {
            results.push(`✅ ${rule.id}: MATCHES`);
        } else {
            results.push(`❌ ${rule.id}: ${why}`);
        }
    }

    return results.join('\n');
}