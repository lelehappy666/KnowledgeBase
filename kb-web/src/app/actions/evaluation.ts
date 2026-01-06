'use server'

import { createEvaluation, EvaluationData, deleteEvaluation, saveEvaluation, getEvaluationById } from '@/lib/evaluation-system';
import { revalidatePath } from 'next/cache';

export async function createEvaluationAction(formData: FormData) {
    const rawData: any = {
        target: {
            type: formData.get('targetType'),
            name: formData.get('targetName'),
            refId: formData.get('targetRefId'),
        },
        scores: {
            experience: Number(formData.get('scoreExperience')) || 3,
            understanding: Number(formData.get('scoreUnderstanding')) || 3,
            scientific: Number(formData.get('scoreScientific')) || 3,
            maintainability: Number(formData.get('scoreMaintainability')) || 3,
            innovation: Number(formData.get('scoreInnovation')) || 3,
            replicability: Number(formData.get('scoreReplicability')) || 3,
        },
        cost: {
            range: formData.get('costRange'),
            currency: 'CNY',
            details: formData.get('costDetails'),
        },
        analysis: {
            pros: (formData.get('analysisPros') as string)?.split('\n').filter(Boolean) || [],
            cons: (formData.get('analysisCons') as string)?.split('\n').filter(Boolean) || [],
            summary: formData.get('analysisSummary'),
        },
        tags: (formData.get('tags') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
    };

    try {
        await createEvaluation(rawData);
    } catch (e) {
        console.error('Create evaluation failed', e);
        return { error: 'Failed to create evaluation' };
    }

    revalidatePath('/cognitive/evaluations');
    return { success: true };
}

export async function updateEvaluationAction(formData: FormData) {
    const id = formData.get('id') as string;
    
    const rawData: any = {
        id,
        target: {
            type: formData.get('targetType'),
            name: formData.get('targetName'),
            refId: formData.get('targetRefId'),
        },
        scores: {
            experience: Number(formData.get('scoreExperience')) || 3,
            understanding: Number(formData.get('scoreUnderstanding')) || 3,
            scientific: Number(formData.get('scoreScientific')) || 3,
            maintainability: Number(formData.get('scoreMaintainability')) || 3,
            innovation: Number(formData.get('scoreInnovation')) || 3,
            replicability: Number(formData.get('scoreReplicability')) || 3,
        },
        cost: {
            range: formData.get('costRange'),
            currency: 'CNY',
            details: formData.get('costDetails'),
        },
        analysis: {
            pros: (formData.get('analysisPros') as string)?.split('\n').filter(Boolean) || [],
            cons: (formData.get('analysisCons') as string)?.split('\n').filter(Boolean) || [],
            summary: formData.get('analysisSummary'),
        },
        tags: (formData.get('tags') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
    };

    try {
        const existingEvaluation = await getEvaluationById(id);
        if (existingEvaluation) {
            const mergedData = {
                ...existingEvaluation,
                ...rawData,
                updatedAt: new Date().toISOString()
            };
            await saveEvaluation(mergedData);
        } else {
            return { error: 'Evaluation not found' };
        }
    } catch (e) {
        console.error('Update evaluation failed', e);
        return { error: 'Failed to update evaluation' };
    }

    revalidatePath('/cognitive/evaluations');
    revalidatePath(`/cognitive/evaluations/${id}`);
    return { success: true };
}

export async function deleteEvaluationAction(id: string) {
    try {
        await deleteEvaluation(id);
    } catch (e) {
        console.error('Delete evaluation failed', e);
        return { error: 'Failed to delete evaluation' };
    }
    
    revalidatePath('/cognitive/evaluations');
    return { success: true };
}
