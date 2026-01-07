'use server'

import { SciencePrinciple, saveSciencePrinciple, deleteSciencePrinciple, getSciencePrincipleById } from '@/lib/content-system';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function createSciencePrincipleAction(data: any) {
    // Check if it's a raw JSON import (already structured) or from FormData
    // If it comes from our Form component, it might be structured if we submit JSON, 
    // or flat if we use native form submission. 
    // For this complex object, we assume client component constructs the JSON object.
    
    // Validate or ensure ID
    if (!data.id) {
        data.id = uuidv4();
    }
    
    try {
        await saveSciencePrinciple(data as SciencePrinciple);
    } catch (e) {
        console.error('Create science principle failed', e);
        return { error: 'Failed to create science principle' };
    }

    revalidatePath('/content/science-principles');
    return { success: true, id: data.id };
}

export async function updateSciencePrincipleAction(id: string, data: any) {
    try {
        const existing = await getSciencePrincipleById(id);
        if (!existing) {
            return { error: 'Science principle not found' };
        }

        const mergedData = {
            ...existing,
            ...data,
            id: existing.id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        };

        await saveSciencePrinciple(mergedData as SciencePrinciple, existing.name);
    } catch (e) {
        console.error('Update science principle failed', e);
        return { error: 'Failed to update science principle' };
    }

    revalidatePath('/content/science-principles');
    revalidatePath(`/content/science-principles/${id}`);
    return { success: true };
}

export async function deleteSciencePrincipleAction(id: string) {
    try {
        await deleteSciencePrinciple(id);
    } catch (e) {
        console.error('Delete science principle failed', e);
        return { error: 'Failed to delete science principle' };
    }
    
    revalidatePath('/content/science-principles');
    return { success: true };
}
