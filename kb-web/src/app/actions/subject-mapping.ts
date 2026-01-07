'use server'

import { SubjectMapping, saveSubjectMapping, deleteSubjectMapping, getSubjectMappingById } from '@/lib/content-system';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function createSubjectMappingAction(data: any) {
    if (!data.id) {
        data.id = uuidv4();
    }
    
    try {
        await saveSubjectMapping(data as SubjectMapping);
    } catch (e) {
        console.error('Create subject mapping failed', e);
        return { error: 'Failed to create subject mapping' };
    }

    revalidatePath('/content/subject-mappings');
    return { success: true, id: data.id };
}

export async function updateSubjectMappingAction(id: string, data: any) {
    try {
        const existing = await getSubjectMappingById(id);
        if (!existing) {
            return { error: 'Subject mapping not found' };
        }

        const mergedData = {
            ...existing,
            ...data,
            id: existing.id,
            updatedAt: new Date().toISOString()
        };

        await saveSubjectMapping(mergedData as SubjectMapping, existing.name);
    } catch (e) {
        console.error('Update subject mapping failed', e);
        return { error: 'Failed to update subject mapping' };
    }

    revalidatePath('/content/subject-mappings');
    revalidatePath(`/content/subject-mappings/${id}`);
    return { success: true };
}

export async function deleteSubjectMappingAction(id: string) {
    try {
        await deleteSubjectMapping(id);
    } catch (e) {
        console.error('Delete subject mapping failed', e);
        return { error: 'Failed to delete subject mapping' };
    }
    
    revalidatePath('/content/subject-mappings');
    return { success: true };
}
