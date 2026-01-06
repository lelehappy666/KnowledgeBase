'use server'

import { createTrend, TrendData } from '@/lib/trend-system';
import { revalidatePath } from 'next/cache';

export async function importTrendAction(data: any) {
    // Basic validation
    if (!data || typeof data !== 'object') {
        return { error: 'Invalid JSON data' };
    }

    if (!data.basic?.name) {
        return { error: 'Missing required field: basic.name' };
    }

    // Sanitize and fill defaults
    const trendData: Omit<TrendData, 'id' | 'updatedAt'> = {
        basic: {
            name: data.basic.name,
            aliases: Array.isArray(data.basic.aliases) ? data.basic.aliases : [],
            discoveryDate: data.basic.discoveryDate || new Date().toISOString().split('T')[0],
            maturityPeriod: {
                start: data.basic.maturityPeriod?.start || '',
                end: data.basic.maturityPeriod?.end || '',
            },
            declineDate: data.basic.declineDate || '',
        },
        attributes: {
            type: ['Technical', 'Content', 'Experience', 'Other'].includes(data.attributes?.type) ? data.attributes.type : 'Technical',
            intensity: ['Emerging', 'Growing', 'Mature', 'Declining'].includes(data.attributes?.intensity) ? data.attributes.intensity : 'Emerging',
            scope: Array.isArray(data.attributes?.scope) ? data.attributes.scope : [],
            credibility: ['Low', 'Medium', 'High', 'Verified'].includes(data.attributes?.credibility) ? data.attributes.credibility : 'Medium',
        },
        content: {
            description: data.content?.description || '',
            features: Array.isArray(data.content?.features) ? data.content.features : [],
            drivers: Array.isArray(data.content?.drivers) ? data.content.drivers : [],
            constraints: Array.isArray(data.content?.constraints) ? data.content.constraints : [],
        },
        impact: {
            design: data.impact?.design || '',
            technology: data.impact?.technology || '',
            cost: data.impact?.cost || '',
            user: data.impact?.user || '',
        },
        data: {
            marketShare: Number(data.data?.marketShare) || 0,
            growthRate: Number(data.data?.growthRate) || 0,
            patents: Number(data.data?.patents) || 0,
            papers: Number(data.data?.papers) || 0,
            mediaReports: Number(data.data?.mediaReports) || 0,
        },
        application: {
            scenarios: Array.isArray(data.application?.scenarios) ? data.application.scenarios : [],
            exhibitTypes: Array.isArray(data.application?.exhibitTypes) ? data.application.exhibitTypes : [],
            suggestions: data.application?.suggestions || '',
            risks: data.application?.risks || '',
        },
        cases: {
            typical: Array.isArray(data.cases?.typical) ? data.cases.typical : [],
            failures: Array.isArray(data.cases?.failures) ? data.cases.failures : [],
            competitors: Array.isArray(data.cases?.competitors) ? data.cases.competitors : [],
        },
        update: {
            frequency: data.update?.frequency || 'Quarterly',
            lastUpdate: data.update?.lastUpdate || new Date().toISOString(),
            nextUpdate: data.update?.nextUpdate || '',
            history: Array.isArray(data.update?.history) ? data.update.history : [],
        },
        sources: Array.isArray(data.sources) ? data.sources : [],
    };

    try {
        await createTrend(trendData);
        revalidatePath('/cognitive/trends');
        return { success: true };
    } catch (e) {
        console.error('Import trend failed', e);
        return { error: 'Failed to import trend' };
    }
}
