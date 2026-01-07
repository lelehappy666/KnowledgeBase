'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createSciencePrincipleAction, updateSciencePrincipleAction } from '@/app/actions/science-principle'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { SciencePrinciple } from '@/lib/content-system'

interface SciencePrincipleFormProps {
    initialData?: SciencePrinciple
    isEditing?: boolean
}

export function SciencePrincipleForm({ initialData, isEditing = false }: SciencePrincipleFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Initialize state with default structure or initialData
    const [data, setData] = useState<Partial<SciencePrinciple>>(initialData || {
        name: '',
        basic: { aliases: [], enName: '', abstract: '', history: '' },
        classification: { category: '', subCategory: '', crossDiscipline: [], knowledgeSystem: '', difficultyLevel: '' },
        education: { 
            gradeLevel: [], gradeSpecific: [], 
            curriculum: { standard: [], requirements: '', knowledgePointId: '', coreLiteracy: [], abilityGoals: [], cognitiveLevel: '' },
            teaching: { misconceptions: [], difficulties: '', suggestions: '', safety: '' }
        },
        exhibitRelation: {
            exhibitability: '', suitableTypes: [], existingCases: [], creativeIdeas: [],
            design: { visualStrategy: '', interactionPoints: [], experiencePoints: [], techPath: [] },
            difficulty: { understanding: 0, operation: 0, immersion: 0, memory: 0 }
        },
        activity: {
            curriculum: { theme: '', type: [], duration: '', location: [], audienceSize: '' },
            project: { theme: '', cycle: '', drivingQuestion: '', outcome: [], evaluationRubric: '' },
            resources: { ppt: '', guide: '', manual: '', video: '', materials: '', equipment: [], cost: 0 }
        },
        crossDisciplinary: {
            steam: { s: [], t: [], e: [], a: [], m: [] },
            application: { daily: [], industrial: [], research: [], medical: [], military: [] },
            frontier: { research: '', unsolved: [], trends: '' }
        },
        evaluation: {
            teaching: { indicators: [], methods: [], tools: '', data: [] },
            exhibit: { effect: 0, feedback: '', suggestions: '' },
            content: { accuracy: '', timeliness: '', completeness: 0, utility: 0, popularity: 0 }
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

    // Helper for array inputs (comma separated)
    const handleArrayChange = (path: string, value: string) => {
        handleChange(path, value.split(/[,，]/).map(s => s.trim()).filter(Boolean));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditing && initialData?.id) {
                const res = await updateSciencePrincipleAction(initialData.id, data);
                if (res.success) {
                    toast.success('更新成功');
                    router.push(`/content/science-principles/${initialData.id}`);
                } else {
                    toast.error('更新失败');
                }
            } else {
                const res = await createSciencePrincipleAction(data);
                if (res.success) {
                    toast.success('创建成功');
                    router.push('/content/science-principles');
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
                    {isEditing ? '保存修改' : '创建原理'}
                </Button>
            </div>

            <Card className="p-6">
                <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>原理名称</Label>
                            <Input value={data.name} onChange={e => handleChange('name', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>英文名称</Label>
                            <Input value={data.basic?.enName} onChange={e => handleChange('basic.enName', e.target.value)} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label>摘要</Label>
                        <Textarea value={data.basic?.abstract} onChange={e => handleChange('basic.abstract', e.target.value)} />
                     </div>
                </div>
            </Card>

            <Tabs defaultValue="classification">
                <TabsList className="grid w-full grid-cols-6 h-auto flex-wrap">
                    <TabsTrigger value="classification">分类体系</TabsTrigger>
                    <TabsTrigger value="education">教育课程</TabsTrigger>
                    <TabsTrigger value="exhibit">展项关联</TabsTrigger>
                    <TabsTrigger value="activity">课程活动</TabsTrigger>
                    <TabsTrigger value="cross">跨学科</TabsTrigger>
                    <TabsTrigger value="evaluation">评估反馈</TabsTrigger>
                </TabsList>

                <TabsContent value="classification" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>分类体系</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>一级学科</Label>
                                <Input value={data.classification?.category} onChange={e => handleChange('classification.category', e.target.value)} placeholder="物理/化学/生物..." />
                            </div>
                            <div className="space-y-2">
                                <Label>二级学科</Label>
                                <Input value={data.classification?.subCategory} onChange={e => handleChange('classification.subCategory', e.target.value)} placeholder="光学/力学..." />
                            </div>
                            <div className="space-y-2">
                                <Label>知识体系</Label>
                                <Select value={data.classification?.knowledgeSystem} onValueChange={v => handleChange('classification.knowledgeSystem', v)}>
                                    <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="经典物理">经典物理</SelectItem>
                                        <SelectItem value="近代物理">近代物理</SelectItem>
                                        <SelectItem value="应用物理">应用物理</SelectItem>
                                        <SelectItem value="基础理论">基础理论</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>难度层级</Label>
                                <Select value={data.classification?.difficultyLevel} onValueChange={v => handleChange('classification.difficultyLevel', v)}>
                                    <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="启蒙级">启蒙级</SelectItem>
                                        <SelectItem value="入门级">入门级</SelectItem>
                                        <SelectItem value="进阶级">进阶级</SelectItem>
                                        <SelectItem value="专业级">专业级</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>交叉学科 (逗号分隔)</Label>
                            <Input value={data.classification?.crossDiscipline?.join(', ')} onChange={e => handleArrayChange('classification.crossDiscipline', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="education" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>教育与课程</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>适用学段 (逗号分隔)</Label>
                                <Input value={data.education?.gradeLevel?.join(', ')} onChange={e => handleArrayChange('education.gradeLevel', e.target.value)} placeholder="初中, 高中" />
                            </div>
                            <div className="space-y-2">
                                <Label>具体年级 (逗号分隔)</Label>
                                <Input value={data.education?.gradeSpecific?.join(', ')} onChange={e => handleArrayChange('education.gradeSpecific', e.target.value)} placeholder="八年级, 高二" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>课标要求</Label>
                            <Textarea value={data.education?.curriculum?.requirements} onChange={e => handleChange('education.curriculum.requirements', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>知识点编号</Label>
                            <Input value={data.education?.curriculum?.knowledgePointId} onChange={e => handleChange('education.curriculum.knowledgePointId', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>核心素养 (逗号分隔)</Label>
                                <Input value={data.education?.curriculum?.coreLiteracy?.join(', ')} onChange={e => handleArrayChange('education.curriculum.coreLiteracy', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>能力目标 (逗号分隔)</Label>
                                <Input value={data.education?.curriculum?.abilityGoals?.join(', ')} onChange={e => handleArrayChange('education.curriculum.abilityGoals', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>教学建议</Label>
                            <Textarea value={data.education?.teaching?.suggestions} onChange={e => handleChange('education.teaching.suggestions', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="exhibit" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>展项关联</CardTitle></CardHeader><CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label>可展示性</Label>
                            <Select value={data.exhibitRelation?.exhibitability} onValueChange={v => handleChange('exhibitRelation.exhibitability', v)}>
                                <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="极易展示">极易展示</SelectItem>
                                    <SelectItem value="较易展示">较易展示</SelectItem>
                                    <SelectItem value="较难展示">较难展示</SelectItem>
                                    <SelectItem value="极难展示">极难展示</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>视觉策略</Label>
                            <Textarea value={data.exhibitRelation?.design?.visualStrategy} onChange={e => handleChange('exhibitRelation.design.visualStrategy', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>交互要点 (逗号分隔)</Label>
                            <Input value={data.exhibitRelation?.design?.interactionPoints?.join(', ')} onChange={e => handleArrayChange('exhibitRelation.design.interactionPoints', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>技术实现路径 (逗号分隔)</Label>
                            <Input value={data.exhibitRelation?.design?.techPath?.join(', ')} onChange={e => handleArrayChange('exhibitRelation.design.techPath', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                             <div className="space-y-2">
                                <Label>理解难度 (1-5)</Label>
                                <Input type="number" min="1" max="5" value={data.exhibitRelation?.difficulty?.understanding} onChange={e => handleChange('exhibitRelation.difficulty.understanding', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>操作难度 (1-5)</Label>
                                <Input type="number" min="1" max="5" value={data.exhibitRelation?.difficulty?.operation} onChange={e => handleChange('exhibitRelation.difficulty.operation', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>沉浸深度 (1-5)</Label>
                                <Input type="number" min="1" max="5" value={data.exhibitRelation?.difficulty?.immersion} onChange={e => handleChange('exhibitRelation.difficulty.immersion', Number(e.target.value))} />
                            </div>
                             <div className="space-y-2">
                                <Label>记忆强度 (1-5)</Label>
                                <Input type="number" min="1" max="5" value={data.exhibitRelation?.difficulty?.memory} onChange={e => handleChange('exhibitRelation.difficulty.memory', Number(e.target.value))} />
                            </div>
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>课程与活动</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>课程主题</Label>
                                <Input value={data.activity?.curriculum?.theme} onChange={e => handleChange('activity.curriculum.theme', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>课程类型 (逗号分隔)</Label>
                                <Input value={data.activity?.curriculum?.type?.join(', ')} onChange={e => handleArrayChange('activity.curriculum.type', e.target.value)} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>驱动问题 (PBL)</Label>
                            <Input value={data.activity?.project?.drivingQuestion} onChange={e => handleChange('activity.project.drivingQuestion', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>项目产出 (逗号分隔)</Label>
                            <Input value={data.activity?.project?.outcome?.join(', ')} onChange={e => handleArrayChange('activity.project.outcome', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>器材清单 (JSON格式)</Label>
                            <Textarea 
                                value={JSON.stringify(data.activity?.resources?.equipment || [], null, 2)} 
                                onChange={e => {
                                    try {
                                        handleChange('activity.resources.equipment', JSON.parse(e.target.value))
                                    } catch(err) {
                                        // Ignore parse error while typing
                                    }
                                }} 
                                className="font-mono text-xs"
                                placeholder='[{"name": "偏振片", "count": 10}]'
                            />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="cross" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>跨学科拓展</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-5 gap-2">
                            <div className="space-y-2"><Label>S (科学)</Label><Input value={data.crossDisciplinary?.steam?.s?.join(', ')} onChange={e => handleArrayChange('crossDisciplinary.steam.s', e.target.value)} /></div>
                            <div className="space-y-2"><Label>T (技术)</Label><Input value={data.crossDisciplinary?.steam?.t?.join(', ')} onChange={e => handleArrayChange('crossDisciplinary.steam.t', e.target.value)} /></div>
                            <div className="space-y-2"><Label>E (工程)</Label><Input value={data.crossDisciplinary?.steam?.e?.join(', ')} onChange={e => handleArrayChange('crossDisciplinary.steam.e', e.target.value)} /></div>
                            <div className="space-y-2"><Label>A (艺术)</Label><Input value={data.crossDisciplinary?.steam?.a?.join(', ')} onChange={e => handleArrayChange('crossDisciplinary.steam.a', e.target.value)} /></div>
                            <div className="space-y-2"><Label>M (数学)</Label><Input value={data.crossDisciplinary?.steam?.m?.join(', ')} onChange={e => handleArrayChange('crossDisciplinary.steam.m', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>日常生活应用 (逗号分隔)</Label>
                            <Input value={data.crossDisciplinary?.application?.daily?.join(', ')} onChange={e => handleArrayChange('crossDisciplinary.application.daily', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>前沿研究</Label>
                            <Input value={data.crossDisciplinary?.frontier?.research} onChange={e => handleChange('crossDisciplinary.frontier.research', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                 <TabsContent value="evaluation" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>评估反馈</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>学习效果指标 (逗号分隔)</Label>
                            <Input value={data.evaluation?.teaching?.indicators?.join(', ')} onChange={e => handleArrayChange('evaluation.teaching.indicators', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>展项教学效果 (1-5)</Label>
                            <Input type="number" min="1" max="5" value={data.evaluation?.exhibit?.effect} onChange={e => handleChange('evaluation.exhibit.effect', Number(e.target.value))} />
                        </div>
                         <div className="space-y-2">
                            <Label>改进建议</Label>
                            <Textarea value={data.evaluation?.exhibit?.suggestions} onChange={e => handleChange('evaluation.exhibit.suggestions', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}
