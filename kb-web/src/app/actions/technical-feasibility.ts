'use server'

import { TechnicalFeasibility, saveTechnicalFeasibility, deleteTechnicalFeasibility, getTechnicalFeasibilityById } from '@/lib/technical-system';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function createTechnicalFeasibilityAction(data: any) {
    if (!data.id) {
        data.id = uuidv4();
    }
    
    try {
        await saveTechnicalFeasibility(data as TechnicalFeasibility);
    } catch (e) {
        console.error('Create technical feasibility failed', e);
        return { error: 'Failed to create technical feasibility' };
    }

    revalidatePath('/technical/feasibility');
    return { success: true, id: data.id };
}

export async function updateTechnicalFeasibilityAction(id: string, data: any) {
    try {
        const existing = await getTechnicalFeasibilityById(id);
        if (!existing) {
            return { error: 'Technical feasibility not found' };
        }

        const mergedData = {
            ...existing,
            ...data,
            id: existing.id,
            updatedAt: new Date().toISOString()
        };

        await saveTechnicalFeasibility(mergedData as TechnicalFeasibility, existing.name);
    } catch (e) {
        console.error('Update technical feasibility failed', e);
        return { error: 'Failed to update technical feasibility' };
    }

    revalidatePath('/technical/feasibility');
    revalidatePath(`/technical/feasibility/${id}`);
    return { success: true };
}

export async function deleteTechnicalFeasibilityAction(id: string) {
    try {
        await deleteTechnicalFeasibility(id);
    } catch (e) {
        console.error('Delete technical feasibility failed', e);
        return { error: 'Failed to delete technical feasibility' };
    }
    
    revalidatePath('/technical/feasibility');
    return { success: true };
}
