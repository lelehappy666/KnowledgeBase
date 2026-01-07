'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createSubjectMappingAction, updateSubjectMappingAction } from '@/app/actions/subject-mapping'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { SubjectMapping } from '@/lib/content-system'

interface SubjectMappingFormProps {
    initialData?: SubjectMapping
    isEditing?: boolean
}

export function SubjectMappingForm({ initialData, isEditing = false }: SubjectMappingFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [data, setData] = useState<Partial<SubjectMapping>>(initialData || {
        name: '',
        basic: { code: '', purpose: '' },
        dimensions: {
            exhibit: { typeId: '', subTypes: [], interaction: [], experience: [] },
            subject: { category: '', branch: '', topic: '', standard: '' },
            grade: { level: '', specific: [], ageRange: '', cognitiveLevel: '' }
        },
        knowledge: {
            principleId: '', name: '', code: '', depth: '', type: '',
            match: { score: 0, reason: '', pros: [], cons: [], complementary: [] }
        },
        teaching: {
            timing: '', method: [], duration: '', connection: '',
            difficulty: { cognitive: 0, operation: 0, threshold: '', skills: [] },
            adaptability: { gender: '', culture: '', specialNeeds: [], learningStyle: [], personality: [] },
            groupFit: { individual: 0, group: 0, class: 0, family: 0 }
        },
        goals: { knowledge: [], ability: [], literacy: [], emotion: [] },
        assessment: { dimensions: [], methods: [], tools: '', standards: [], performance: '' },
        outcome: { works: [], example: '', display: [] },
        implementation: {
            conditions: { space: '', equipment: [], personnel: '', safety: '', maintenance: '' },
            resources: { guide: '', manual: '', background: '', extended: [], qa: '' },
            schedule: { prep: 0, activity: 0, cleanup: 0, bestTime: [] },
            cost: { equipment: 0, material: 0, labor: 0, total: 0 }
        },
        validation: {
            cases: [], schools: [], dates: [], report: '',
            feedback: { student: '', teacher: '', effect: [], engagement: 0, satisfaction: 0 },
            improvement: { history: [], todos: [], suggestions: '' },
            status: { level: '', agency: '', date: '', report: '' }
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
                const res = await updateSubjectMappingAction(initialData.id, data);
                if (res.success) {
                    toast.success('更新成功');
                    router.push(`/content/subject-mappings/${initialData.id}`);
                } else {
                    toast.error('更新失败');
                }
            } else {
                const res = await createSubjectMappingAction(data);
                if (res.success) {
                    toast.success('创建成功');
                    router.push('/content/subject-mappings');
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
                    {isEditing ? '保存修改' : '创建对照'}
                </Button>
            </div>

            <Card className="p-6">
                <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>条目名称</Label>
                            <Input value={data.name} onChange={e => handleChange('name', e.target.value)} required placeholder="例如: 力的相互作用与滑轮组" />
                        </div>
                        <div className="space-y-2">
                            <Label>编码</Label>
                            <Input value={data.basic?.code} onChange={e => handleChange('basic.code', e.target.value)} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label>创建目的</Label>
                        <Textarea value={data.basic?.purpose} onChange={e => handleChange('basic.purpose', e.target.value)} />
                     </div>
                </div>
            </Card>

            <Tabs defaultValue="dimensions">
                <TabsList className="grid w-full grid-cols-6 h-auto flex-wrap">
                    <TabsTrigger value="dimensions">关联维度</TabsTrigger>
                    <TabsTrigger value="knowledge">知识匹配</TabsTrigger>
                    <TabsTrigger value="teaching">教学整合</TabsTrigger>
                    <TabsTrigger value="goals">目标评估</TabsTrigger>
                    <TabsTrigger value="implementation">实施支持</TabsTrigger>
                    <TabsTrigger value="validation">案例验证</TabsTrigger>
                </TabsList>

                <TabsContent value="dimensions" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>展项与学科关联</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>学科分类</Label>
                                <Input value={data.dimensions?.subject?.category} onChange={e => handleChange('dimensions.subject.category', e.target.value)} placeholder="物理/数学..." />
                            </div>
                            <div className="space-y-2">
                                <Label>学科分支</Label>
                                <Input value={data.dimensions?.subject?.branch} onChange={e => handleChange('dimensions.subject.branch', e.target.value)} placeholder="力学/代数..." />
                            </div>
                            <div className="space-y-2">
                                <Label>适用学段</Label>
                                <Select value={data.dimensions?.grade?.level} onValueChange={v => handleChange('dimensions.grade.level', v)}>
                                    <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="小学">小学</SelectItem>
                                        <SelectItem value="初中">初中</SelectItem>
                                        <SelectItem value="高中">高中</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>具体年级 (逗号分隔)</Label>
                                <Input value={data.dimensions?.grade?.specific?.join(', ')} onChange={e => handleArrayChange('dimensions.grade.specific', e.target.value)} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>交互方式 (逗号分隔)</Label>
                            <Input value={data.dimensions?.exhibit?.interaction?.join(', ')} onChange={e => handleArrayChange('dimensions.exhibit.interaction', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>课程标准</Label>
                            <Input value={data.dimensions?.subject?.standard} onChange={e => handleChange('dimensions.subject.standard', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="knowledge" className="space-y-4 mt-4">
                     <Card><CardHeader><CardTitle>知识点匹配</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>知识点名称</Label>
                                <Input value={data.knowledge?.name} onChange={e => handleChange('knowledge.name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>匹配度 (1-5)</Label>
                                <Input type="number" min="1" max="5" value={data.knowledge?.match?.score} onChange={e => handleChange('knowledge.match.score', Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>匹配理由</Label>
                            <Textarea value={data.knowledge?.match?.reason} onChange={e => handleChange('knowledge.match.reason', e.target.value)} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>优势 (逗号分隔)</Label>
                                <Input value={data.knowledge?.match?.pros?.join(', ')} onChange={e => handleArrayChange('knowledge.match.pros', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>劣势 (逗号分隔)</Label>
                                <Input value={data.knowledge?.match?.cons?.join(', ')} onChange={e => handleArrayChange('knowledge.match.cons', e.target.value)} />
                            </div>
                        </div>
                     </CardContent></Card>
                </TabsContent>

                <TabsContent value="teaching" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>教学整合分析</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>教学时机</Label>
                                <Input value={data.teaching?.timing} onChange={e => handleChange('teaching.timing', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>建议时长</Label>
                                <Input value={data.teaching?.duration} onChange={e => handleChange('teaching.duration', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>教学方法 (逗号分隔)</Label>
                            <Input value={data.teaching?.method?.join(', ')} onChange={e => handleArrayChange('teaching.method', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>认知难度 (1-5)</Label>
                                <Input type="number" min="1" max="5" value={data.teaching?.difficulty?.cognitive} onChange={e => handleChange('teaching.difficulty.cognitive', Number(e.target.value))} />
                            </div>
                             <div className="space-y-2">
                                <Label>操作难度 (1-5)</Label>
                                <Input type="number" min="1" max="5" value={data.teaching?.difficulty?.operation} onChange={e => handleChange('teaching.difficulty.operation', Number(e.target.value))} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>所需技能 (逗号分隔)</Label>
                            <Input value={data.teaching?.difficulty?.skills?.join(', ')} onChange={e => handleArrayChange('teaching.difficulty.skills', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="goals" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>目标与评估</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>知识目标 (逗号分隔)</Label>
                            <Input value={data.goals?.knowledge?.join(', ')} onChange={e => handleArrayChange('goals.knowledge', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>能力目标 (逗号分隔)</Label>
                            <Input value={data.goals?.ability?.join(', ')} onChange={e => handleArrayChange('goals.ability', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>评估维度 (逗号分隔)</Label>
                            <Input value={data.assessment?.dimensions?.join(', ')} onChange={e => handleArrayChange('assessment.dimensions', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>预期表现</Label>
                            <Input value={data.assessment?.performance} onChange={e => handleChange('assessment.performance', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>产出作品 (逗号分隔)</Label>
                            <Input value={data.outcome?.works?.join(', ')} onChange={e => handleArrayChange('outcome.works', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="implementation" className="space-y-4 mt-4">
                     <Card><CardHeader><CardTitle>实施支持</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>空间要求</Label>
                                <Input value={data.implementation?.conditions?.space} onChange={e => handleChange('implementation.conditions.space', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>总成本估算</Label>
                                <Input type="number" value={data.implementation?.cost?.total} onChange={e => handleChange('implementation.cost.total', Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>设备清单 (逗号分隔)</Label>
                            <Input value={data.implementation?.conditions?.equipment?.join(', ')} onChange={e => handleArrayChange('implementation.conditions.equipment', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>安全提示</Label>
                            <Textarea value={data.implementation?.conditions?.safety} onChange={e => handleChange('implementation.conditions.safety', e.target.value)} />
                        </div>
                     </CardContent></Card>
                </TabsContent>

                <TabsContent value="validation" className="space-y-4 mt-4">
                     <Card><CardHeader><CardTitle>案例验证</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>验证学校 (逗号分隔)</Label>
                            <Input value={data.validation?.schools?.join(', ')} onChange={e => handleArrayChange('validation.schools', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>验证报告摘要</Label>
                            <Textarea value={data.validation?.report} onChange={e => handleChange('validation.report', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>学生反馈</Label>
                                <Input value={data.validation?.feedback?.student} onChange={e => handleChange('validation.feedback.student', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>教师反馈</Label>
                                <Input value={data.validation?.feedback?.teacher} onChange={e => handleChange('validation.feedback.teacher', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>待改进事项 (逗号分隔)</Label>
                            <Input value={data.validation?.improvement?.todos?.join(', ')} onChange={e => handleArrayChange('validation.improvement.todos', e.target.value)} />
                        </div>
                     </CardContent></Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}
