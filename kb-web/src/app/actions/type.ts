'use server'

import { createType, TypeData, deleteType, saveType, getTypeById } from '@/lib/type-system';
import { revalidatePath } from 'next/cache';

export async function createTypeAction(formData: FormData) {
    const rawData: any = {
        definition: {
            name: formData.get('name'),
            code: formData.get('code'),
        },
        classification: {
            interactionMethod: (formData.get('interactionMethod') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            contentType: (formData.get('contentType') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            experienceType: (formData.get('experienceType') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        },
        technical: {
            complexity: formData.get('complexity'),
            difficulty: Number(formData.get('difficulty')) || 1,
            developmentCycle: formData.get('developmentCycle'),
            techRequirements: (formData.get('techRequirements') as string)?.split('\n').filter(Boolean) || [],
        },
        experience: {
            interactionDepth: formData.get('interactionDepth'),
            participantCount: formData.get('participantCount'),
            duration: formData.get('duration'),
            learningCurve: formData.get('learningCurve'),
        },
        application: {
            spaceRequirements: (formData.get('spaceRequirements') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            themes: [], // TODO: Link to Themes
            scenarios: (formData.get('scenarios') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            audience: (formData.get('audience') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        },
        cost: {
            costRange: formData.get('costRange'),
            maintenanceCost: formData.get('maintenanceCost'),
            updateFrequency: formData.get('updateFrequency'),
        },
        relations: {
            typicalCases: [],
            bestPractices: [],
            commonIssues: [],
            predecessors: [],
            similarTypes: [],
            complementaryTypes: [],
        },
        design: {
            designGuide: formData.get('designGuide'),
            layoutSuggestions: formData.get('layoutSuggestions'),
            safetySpecs: (formData.get('safetySpecs') as string)?.split('\n').filter(Boolean) || [],
            accessibility: formData.get('accessibility'),
        },
        evaluation: {
            experienceStandard: formData.get('experienceStandard'),
            educationStandard: formData.get('educationStandard'),
            technicalStandard: formData.get('technicalStandard'),
        },
    };

    try {
        await createType(rawData);
    } catch (e) {
        console.error('Create type failed', e);
        return { error: 'Failed to create type' };
    }

    revalidatePath('/cognitive/types');
    return { success: true };
}

export async function updateTypeAction(formData: FormData) {
    const id = formData.get('id') as string;
    
    const rawData: any = {
        id,
        definition: {
            name: formData.get('name'),
            code: formData.get('code'),
        },
        classification: {
            interactionMethod: (formData.get('interactionMethod') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            contentType: (formData.get('contentType') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            experienceType: (formData.get('experienceType') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        },
        technical: {
            complexity: formData.get('complexity'),
            difficulty: Number(formData.get('difficulty')) || 1,
            developmentCycle: formData.get('developmentCycle'),
            techRequirements: (formData.get('techRequirements') as string)?.split('\n').filter(Boolean) || [],
        },
        experience: {
            interactionDepth: formData.get('interactionDepth'),
            participantCount: formData.get('participantCount'),
            duration: formData.get('duration'),
            learningCurve: formData.get('learningCurve'),
        },
        application: {
            spaceRequirements: (formData.get('spaceRequirements') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            themes: [], 
            scenarios: (formData.get('scenarios') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            audience: (formData.get('audience') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        },
        cost: {
            costRange: formData.get('costRange'),
            maintenanceCost: formData.get('maintenanceCost'),
            updateFrequency: formData.get('updateFrequency'),
        },
        design: {
            designGuide: formData.get('designGuide'),
            layoutSuggestions: formData.get('layoutSuggestions'),
            safetySpecs: (formData.get('safetySpecs') as string)?.split('\n').filter(Boolean) || [],
            accessibility: formData.get('accessibility'),
        },
        evaluation: {
            experienceStandard: formData.get('experienceStandard'),
            educationStandard: formData.get('educationStandard'),
            technicalStandard: formData.get('technicalStandard'),
        },
    };

    try {
        const existingType = await getTypeById(id);
        if (existingType) {
            const mergedData = {
                ...existingType,
                ...rawData,
                relations: existingType.relations, // Preserve relations for now
                application: {
                    ...rawData.application,
                    themes: existingType.application.themes // Preserve themes
                },
                updatedAt: new Date().toISOString()
            };
            await saveType(mergedData);
        } else {
            return { error: 'Type not found' };
        }
    } catch (e) {
        console.error('Update type failed', e);
        return { error: 'Failed to update type' };
    }

    revalidatePath('/cognitive/types');
    revalidatePath(`/cognitive/types/${id}`);
    return { success: true };
}

export async function deleteTypeAction(id: string) {
    try {
        await deleteType(id);
    } catch (e) {
        console.error('Delete type failed', e);
        return { error: 'Failed to delete type' };
    }
    
    revalidatePath('/cognitive/types');
    return { success: true };
}
