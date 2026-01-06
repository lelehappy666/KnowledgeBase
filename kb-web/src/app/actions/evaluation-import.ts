'use server'

import { createEvaluation, EvaluationData } from '@/lib/evaluation-system';
import { revalidatePath } from 'next/cache';

export async function importEvaluationAction(data: any) {
    // Basic validation
    if (!data || typeof data !== 'object') {
        return { error: 'Invalid JSON data' };
    }

    if (!data.target?.name) {
        return { error: 'Missing required field: target.name' };
    }

    // Sanitize and fill defaults
    const evaluationData: Omit<EvaluationData, 'id' | 'updatedAt'> = {
        target: {
            type: ['Exhibit', 'Type', 'Trend', 'Other'].includes(data.target?.type) ? data.target.type : 'Other',
            name: data.target.name,
            refId: data.target?.refId || '',
        },
        scores: {
            experience: Number(data.scores?.experience) || 3,
            understanding: Number(data.scores?.understanding) || 3,
            scientific: Number(data.scores?.scientific) || 3,
            maintainability: Number(data.scores?.maintainability) || 3,
            innovation: Number(data.scores?.innovation) || 3,
            replicability: Number(data.scores?.replicability) || 3,
        },
        cost: {
            range: data.cost?.range || '10-30万',
            currency: 'CNY',
            details: data.cost?.details || '',
        },
        analysis: {
            pros: Array.isArray(data.analysis?.pros) ? data.analysis.pros : [],
            cons: Array.isArray(data.analysis?.cons) ? data.analysis.cons : [],
            summary: data.analysis?.summary || '',
        },
        tags: Array.isArray(data.tags) ? data.tags : [],
    };

    try {
        await createEvaluation(evaluationData);
        revalidatePath('/cognitive/evaluations');
        return { success: true };
    } catch (e) {
        console.error('Import evaluation failed', e);
        return { error: 'Failed to import evaluation' };
    }
}
