'use server'

import { NarrativeTheme, saveNarrativeTheme, deleteNarrativeTheme, getNarrativeThemeById } from '@/lib/content-system';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function createNarrativeThemeAction(data: any) {
    if (!data.id) {
        data.id = uuidv4();
    }
    
    try {
        await saveNarrativeTheme(data as NarrativeTheme);
    } catch (e) {
        console.error('Create narrative theme failed', e);
        return { error: 'Failed to create narrative theme' };
    }

    revalidatePath('/content/narrative-themes');
    return { success: true, id: data.id };
}

export async function updateNarrativeThemeAction(id: string, data: any) {
    try {
        const existing = await getNarrativeThemeById(id);
        if (!existing) {
            return { error: 'Narrative theme not found' };
        }

        const mergedData = {
            ...existing,
            ...data,
            id: existing.id,
            updatedAt: new Date().toISOString()
        };

        await saveNarrativeTheme(mergedData as NarrativeTheme, existing.name);
    } catch (e) {
        console.error('Update narrative theme failed', e);
        return { error: 'Failed to update narrative theme' };
    }

    revalidatePath('/content/narrative-themes');
    revalidatePath(`/content/narrative-themes/${id}`);
    return { success: true };
}

export async function deleteNarrativeThemeAction(id: string) {
    try {
        await deleteNarrativeTheme(id);
    } catch (e) {
        console.error('Delete narrative theme failed', e);
        return { error: 'Failed to delete narrative theme' };
    }
    
    revalidatePath('/content/narrative-themes');
    return { success: true };
}
