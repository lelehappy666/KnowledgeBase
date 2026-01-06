'use server'

import { createTrend, TrendData, deleteTrend } from '@/lib/trend-system';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTrendAction(formData: FormData) {
    const rawData: any = {
        basic: {
            name: formData.get('name'),
            aliases: (formData.get('aliases') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            discoveryDate: formData.get('discoveryDate'),
            maturityPeriod: {
                start: formData.get('maturityStart'),
                end: formData.get('maturityEnd'),
            },
            declineDate: formData.get('declineDate'),
        },
        attributes: {
            type: formData.get('type'),
            intensity: formData.get('intensity'),
            scope: (formData.get('scope') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            credibility: formData.get('credibility'),
        },
        content: {
            description: formData.get('description'),
            features: (formData.get('features') as string)?.split('\n').filter(Boolean) || [],
            drivers: (formData.get('drivers') as string)?.split('\n').filter(Boolean) || [],
            constraints: (formData.get('constraints') as string)?.split('\n').filter(Boolean) || [],
        },
        impact: {
            design: formData.get('impactDesign'),
            technology: formData.get('impactTech'),
            cost: formData.get('impactCost'),
            user: formData.get('impactUser'),
        },
        data: {
            marketShare: Number(formData.get('marketShare')) || 0,
            growthRate: Number(formData.get('growthRate')) || 0,
            patents: Number(formData.get('patents')) || 0,
            papers: Number(formData.get('papers')) || 0,
            mediaReports: Number(formData.get('mediaReports')) || 0,
        },
        application: {
            scenarios: (formData.get('scenarios') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            suggestions: formData.get('suggestions'),
            risks: formData.get('risks'),
        },
        // Defaults for other fields
        cases: { typical: [], failures: [], competitors: [] },
        update: { frequency: 'Quarterly', lastUpdate: new Date().toISOString(), nextUpdate: '', history: [] },
        sources: []
    };

    try {
        await createTrend(rawData);
    } catch (e) {
        console.error('Create trend failed', e);
        return { error: 'Failed to create trend' };
    }

    revalidatePath('/cognitive/trends');
    return { success: true };
}

export async function updateTrendAction(formData: FormData) {
    const id = formData.get('id') as string;
    
    // 复用 createTrendAction 的数据解析逻辑，或抽取为公共函数
    // 为了快速修复，这里直接复制并添加 id
    const rawData: any = {
        id,
        basic: {
            name: formData.get('name'),
            aliases: (formData.get('aliases') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            discoveryDate: formData.get('discoveryDate'),
            maturityPeriod: {
                start: formData.get('maturityStart'),
                end: formData.get('maturityEnd'),
            },
            declineDate: formData.get('declineDate'),
        },
        attributes: {
            type: formData.get('type'),
            intensity: formData.get('intensity'),
            scope: (formData.get('scope') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            credibility: formData.get('credibility'),
        },
        content: {
            description: formData.get('description'),
            features: (formData.get('features') as string)?.split('\n').filter(Boolean) || [],
            drivers: (formData.get('drivers') as string)?.split('\n').filter(Boolean) || [],
            constraints: (formData.get('constraints') as string)?.split('\n').filter(Boolean) || [],
        },
        impact: {
            design: formData.get('impactDesign'),
            technology: formData.get('impactTech'),
            cost: formData.get('impactCost'),
            user: formData.get('impactUser'),
        },
        data: {
            marketShare: Number(formData.get('marketShare')) || 0,
            growthRate: Number(formData.get('growthRate')) || 0,
            patents: Number(formData.get('patents')) || 0,
            papers: Number(formData.get('papers')) || 0,
            mediaReports: Number(formData.get('mediaReports')) || 0,
        },
        application: {
            scenarios: (formData.get('scenarios') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            suggestions: formData.get('suggestions'),
            risks: formData.get('risks'),
        },
    };

    try {
        const { getTrendById, saveTrend } = await import('@/lib/trend-system');
        const existingTrend = await getTrendById(id);
        
        if (existingTrend) {
            // Merge with existing data to preserve uneditable fields
            const mergedData = {
                ...existingTrend,
                ...rawData,
                cases: existingTrend.cases,
                update: existingTrend.update,
                sources: existingTrend.sources,
                updatedAt: new Date().toISOString()
            };
            await saveTrend(mergedData);
        } else {
            return { error: 'Trend not found' };
        }
    } catch (e) {
        console.error('Update trend failed', e);
        return { error: 'Failed to update trend' };
    }

    revalidatePath('/cognitive/trends');
    revalidatePath(`/cognitive/trends/${id}`);
    return { success: true };
}

export async function deleteTrendAction(id: string) {
    try {
        await deleteTrend(id);
    } catch (e) {
        console.error('Delete trend failed', e);
        return { error: 'Failed to delete trend' };
    }
    
    revalidatePath('/cognitive/trends');
    return { success: true };
}
