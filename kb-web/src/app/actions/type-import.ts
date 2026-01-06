'use server'

import { createType, TypeData } from '@/lib/type-system';
import { revalidatePath } from 'next/cache';

export async function importTypeAction(data: any) {
    // Basic validation
    if (!data || typeof data !== 'object') {
        return { error: 'Invalid JSON data' };
    }

    if (!data.definition?.name) {
        return { error: 'Missing required field: definition.name' };
    }

    // Sanitize and fill defaults
    const typeData: Omit<TypeData, 'id' | 'updatedAt'> = {
        definition: {
            name: data.definition.name,
            code: data.definition.code || '',
        },
        classification: {
            interactionMethod: Array.isArray(data.classification?.interactionMethod) ? data.classification.interactionMethod : [],
            contentType: Array.isArray(data.classification?.contentType) ? data.classification.contentType : [],
            experienceType: Array.isArray(data.classification?.experienceType) ? data.classification.experienceType : [],
        },
        technical: {
            complexity: ['Low', 'Medium', 'High', 'Very High'].includes(data.technical?.complexity) ? data.technical.complexity : 'Medium',
            difficulty: Number(data.technical?.difficulty) || 1,
            developmentCycle: data.technical?.developmentCycle || '1-3个月',
            techRequirements: Array.isArray(data.technical?.techRequirements) ? data.technical.techRequirements : [],
        },
        experience: {
            interactionDepth: data.experience?.interactionDepth || '中度互动',
            participantCount: data.experience?.participantCount || '单人',
            duration: data.experience?.duration || '1-3分钟',
            learningCurve: data.experience?.learningCurve || '简单学习',
        },
        application: {
            spaceRequirements: Array.isArray(data.application?.spaceRequirements) ? data.application.spaceRequirements : [],
            themes: Array.isArray(data.application?.themes) ? data.application.themes : [],
            scenarios: Array.isArray(data.application?.scenarios) ? data.application.scenarios : [],
            audience: Array.isArray(data.application?.audience) ? data.application.audience : [],
        },
        cost: {
            costRange: data.cost?.costRange || '',
            maintenanceCost: data.cost?.maintenanceCost || 'Medium',
            updateFrequency: data.cost?.updateFrequency || '低频更新',
        },
        relations: {
            typicalCases: Array.isArray(data.relations?.typicalCases) ? data.relations.typicalCases : [],
            bestPractices: Array.isArray(data.relations?.bestPractices) ? data.relations.bestPractices : [],
            commonIssues: Array.isArray(data.relations?.commonIssues) ? data.relations.commonIssues : [],
            predecessors: Array.isArray(data.relations?.predecessors) ? data.relations.predecessors : [],
            similarTypes: Array.isArray(data.relations?.similarTypes) ? data.relations.similarTypes : [],
            complementaryTypes: Array.isArray(data.relations?.complementaryTypes) ? data.relations.complementaryTypes : [],
        },
        design: {
            designGuide: data.design?.designGuide || '',
            layoutSuggestions: data.design?.layoutSuggestions || '',
            safetySpecs: Array.isArray(data.design?.safetySpecs) ? data.design.safetySpecs : [],
            accessibility: data.design?.accessibility || '',
        },
        evaluation: {
            experienceStandard: data.evaluation?.experienceStandard || '',
            educationStandard: data.evaluation?.educationStandard || '',
            technicalStandard: data.evaluation?.technicalStandard || '',
        },
    };

    try {
        await createType(typeData);
        revalidatePath('/cognitive/types');
        return { success: true };
    } catch (e) {
        console.error('Import type failed', e);
        return { error: 'Failed to import type' };
    }
}
