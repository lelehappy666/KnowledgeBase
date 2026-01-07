'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createNarrativeThemeAction, updateNarrativeThemeAction } from '@/app/actions/narrative-theme'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { NarrativeTheme } from '@/lib/content-system'

interface NarrativeThemeFormProps {
    initialData?: NarrativeTheme
    isEditing?: boolean
}

export function NarrativeThemeForm({ initialData, isEditing = false }: NarrativeThemeFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [data, setData] = useState<Partial<NarrativeTheme>>(initialData || {
        name: '',
        basic: { 
            id: '', aliases: [], icon: '', color: '', slogan: '', abstract: '',
            attributes: { type: '', scale: '', timeliness: '', importance: '', urgency: '' },
            relations: { subjects: [], domains: [], sdgs: [], keywords: [] }
        },
        structure: {
            framework: { type: '', perspective: '', rhythm: '', emotionCurve: '', goal: '' },
            stages: [], points: { turning: [], climax: '', ending: '' },
            elements: { protagonist: '', conflict: '', suspense: [], metaphor: [], quotes: [] },
            cognition: { start: '', goal: '', ladder: [], obstacles: [], breakthroughs: [] }
        },
        configuration: {
            exhibits: { suitableTypes: [], functionTable: [], combinations: [], core: [], auxiliary: [] },
            layout: { space: '', area: 0, type: '', flowChart: '', zones: [], focus: [], transition: '', restPoints: [] },
            examples: { visual: [], mechanical: [], data: [], immersive: [], interactive: [], art: [] }
        },
        content: {
            framework: { core: [], data: [], concepts: [], stories: [], timeline: [], geography: [] },
            levels: { l1: [], l2: [], l3: [], l4: [] },
            carriers: { boards: '', videos: [], interactive: [], objects: [], visualization: [] },
            tactics: { suspense: [], contrast: [], analogy: [], plot: '', resonance: [] }
        },
        experience: {
            goals: { cognitive: '', emotional: '', behavioral: '', social: '' },
            design: { senses: [], rhythm: '', surprise: [], memory: [], photo: [] },
            interaction: { observation: [], operation: [], inquiry: [], creation: [], share: [] },
            participation: { individual: 0, group: 0, family: 0, community: 0, continuous: '' },
            emotion: { start: '', path: '', climax: '', end: '', memory: '' }
        },
        evaluation: {
            indicators: { understanding: 0, satisfaction: 0, duration: 0, depth: '', behaviorChange: 0, socialShare: 0 },
            methods: { observation: '', interview: '', questionnaire: '', tracking: [], focusGroup: '' },
            iteration: { versions: [], success: [], failure: [], suggestions: '', todos: [] },
            references: { similar: [], global: [], awards: [], academic: [] },
            status: { maturity: '', count: 0, agencies: [], date: '', report: '' }
        }
    });

    const handleChange = (path: string, value: any) => {
        const keys = path.split('.');
        setData(prev => {
            const newData = { ...prev };
            let current: any = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const handleArrayChange = (path: string, value: string) => {
        handleChange(path, value.split(/[,，]/).map(s => s.trim()).filter(Boolean));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditing && initialData?.id) {
                const res = await updateNarrativeThemeAction(initialData.id, data);
                if (res.success) {
                    toast.success('更新成功');
                    router.push(`/content/narrative-themes/${initialData.id}`);
                } else {
                    toast.error('更新失败');
                }
            } else {
                const res = await createNarrativeThemeAction(data);
                if (res.success) {
                    toast.success('创建成功');
                    router.push('/content/narrative-themes');
                } else {
                    toast.error('创建失败');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('操作异常');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>取消</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? '保存修改' : '创建主题'}
                </Button>
            </div>

            <Card className="p-6">
                <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>主题名称</Label>
                            <Input value={data.name} onChange={e => handleChange('name', e.target.value)} required placeholder="例如: 能源革命" />
                        </div>
                        <div className="space-y-2">
                            <Label>主题ID</Label>
                            <Input value={data.basic?.id} onChange={e => handleChange('basic.id', e.target.value)} placeholder="THEME_..." />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label>口号</Label>
                        <Input value={data.basic?.slogan} onChange={e => handleChange('basic.slogan', e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <Label>摘要</Label>
                        <Textarea value={data.basic?.abstract} onChange={e => handleChange('basic.abstract', e.target.value)} />
                     </div>
                </div>
            </Card>

            <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-6 h-auto flex-wrap">
                    <TabsTrigger value="basic">基础信息</TabsTrigger>
                    <TabsTrigger value="structure">叙事结构</TabsTrigger>
                    <TabsTrigger value="configuration">展项配置</TabsTrigger>
                    <TabsTrigger value="content">内容信息</TabsTrigger>
                    <TabsTrigger value="experience">体验互动</TabsTrigger>
                    <TabsTrigger value="evaluation">评估优化</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>主题属性与关联</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>主题类型</Label>
                                <Input value={data.basic?.attributes?.type} onChange={e => handleChange('basic.attributes.type', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>规模</Label>
                                <Input value={data.basic?.attributes?.scale} onChange={e => handleChange('basic.attributes.scale', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>紧迫性</Label>
                                <Input value={data.basic?.attributes?.urgency} onChange={e => handleChange('basic.attributes.urgency', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>相关学科 (逗号分隔)</Label>
                                <Input value={data.basic?.relations?.subjects?.join(', ')} onChange={e => handleArrayChange('basic.relations.subjects', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>关键词 (逗号分隔)</Label>
                                <Input value={data.basic?.relations?.keywords?.join(', ')} onChange={e => handleArrayChange('basic.relations.keywords', e.target.value)} />
                            </div>
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="structure" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>叙事结构设计</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>叙事框架</Label>
                                <Input value={data.structure?.framework?.type} onChange={e => handleChange('structure.framework.type', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>视角</Label>
                                <Input value={data.structure?.framework?.perspective} onChange={e => handleChange('structure.framework.perspective', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>节奏</Label>
                                <Input value={data.structure?.framework?.rhythm} onChange={e => handleChange('structure.framework.rhythm', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>叙事目标</Label>
                            <Textarea value={data.structure?.framework?.goal} onChange={e => handleChange('structure.framework.goal', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>核心冲突</Label>
                            <Input value={data.structure?.elements?.conflict} onChange={e => handleChange('structure.elements.conflict', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="configuration" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>展项配置与布局</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>空间需求</Label>
                                <Input value={data.configuration?.layout?.space} onChange={e => handleChange('configuration.layout.space', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>建议面积 (㎡)</Label>
                                <Input type="number" value={data.configuration?.layout?.area} onChange={e => handleChange('configuration.layout.area', Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>布局类型</Label>
                            <Input value={data.configuration?.layout?.type} onChange={e => handleChange('configuration.layout.type', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>视觉焦点 (逗号分隔)</Label>
                            <Input value={data.configuration?.layout?.focus?.join(', ')} onChange={e => handleArrayChange('configuration.layout.focus', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>内容框架</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>核心信息 (逗号分隔)</Label>
                            <Input value={data.content?.framework?.core?.join(', ')} onChange={e => handleArrayChange('content.framework.core', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>故事情节</Label>
                            <Textarea value={data.content?.tactics?.plot} onChange={e => handleChange('content.tactics.plot', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>一级信息 (逗号分隔)</Label>
                            <Input value={data.content?.levels?.l1?.join(', ')} onChange={e => handleArrayChange('content.levels.l1', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>体验与情感</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>认知目标</Label>
                                <Input value={data.experience?.goals?.cognitive} onChange={e => handleChange('experience.goals.cognitive', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>情感目标</Label>
                                <Input value={data.experience?.goals?.emotional} onChange={e => handleChange('experience.goals.emotional', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>情感路径</Label>
                            <Input value={data.experience?.emotion?.path} onChange={e => handleChange('experience.emotion.path', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>记忆点 (逗号分隔)</Label>
                            <Input value={data.experience?.design?.memory?.join(', ')} onChange={e => handleArrayChange('experience.design.memory', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="evaluation" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>评估指标</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>理解度 (0-1)</Label>
                                <Input type="number" step="0.1" value={data.evaluation?.indicators?.understanding} onChange={e => handleChange('evaluation.indicators.understanding', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>满意度 (0-1)</Label>
                                <Input type="number" step="0.1" value={data.evaluation?.indicators?.satisfaction} onChange={e => handleChange('evaluation.indicators.satisfaction', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>停留时间 (分钟)</Label>
                                <Input type="number" value={data.evaluation?.indicators?.duration} onChange={e => handleChange('evaluation.indicators.duration', Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>成功经验 (逗号分隔)</Label>
                            <Input value={data.evaluation?.iteration?.success?.join(', ')} onChange={e => handleArrayChange('evaluation.iteration.success', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>优化建议</Label>
                            <Textarea value={data.evaluation?.iteration?.suggestions} onChange={e => handleChange('evaluation.iteration.suggestions', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}
