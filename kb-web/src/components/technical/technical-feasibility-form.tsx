'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createTechnicalFeasibilityAction, updateTechnicalFeasibilityAction } from '@/app/actions/technical-feasibility'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TechnicalFeasibility } from '@/lib/technical-system'

interface TechnicalFeasibilityFormProps {
    initialData?: TechnicalFeasibility
    isEditing?: boolean
}

export function TechnicalFeasibilityForm({ initialData, isEditing = false }: TechnicalFeasibilityFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [data, setData] = useState<Partial<TechnicalFeasibility>>(initialData || {
        name: '',
        basic: { id: '', category: '', description: '', keywords: [], source: '' },
        specs: { dimensions: '', weight: '', power: '', materials: [], network: '', software: '' },
        analysis: {
            maturity: { trl: 0, status: '', cases: 0 },
            stability: { mtbf: '', durability: '', maintenanceCycle: '' },
            safety: { risks: [], measures: [], certifications: [] },
            riskLevel: 'Low'
        },
        requirements: {
            environment: { temperature: '', humidity: '', lighting: '', noise: '' },
            installation: { space: '', loadBearing: '', difficulty: 0, time: '' },
            skill: { development: [], operation: [] }
        },
        cost: { development: 0, hardware: 0, software: 0, deployment: 0, maintenance: 0, total: 0 },
        interaction: { input: [], output: [], latency: '', throughput: '' }
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
                const res = await updateTechnicalFeasibilityAction(initialData.id, data);
                if (res.success) {
                    toast.success('更新成功');
                    router.push(`/technical/feasibility/${initialData.id}`);
                } else {
                    toast.error('更新失败');
                }
            } else {
                const res = await createTechnicalFeasibilityAction(data);
                if (res.success) {
                    toast.success('创建成功');
                    router.push('/technical/feasibility');
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
                    {isEditing ? '保存修改' : '创建方案'}
                </Button>
            </div>

            <Card className="p-6">
                <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>方案名称</Label>
                            <Input value={data.name} onChange={e => handleChange('name', e.target.value)} required placeholder="例如: 全息投影技术方案" />
                        </div>
                        <div className="space-y-2">
                            <Label>方案ID</Label>
                            <Input value={data.basic?.id} onChange={e => handleChange('basic.id', e.target.value)} placeholder="TECH_..." />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>技术分类</Label>
                            <Input value={data.basic?.category} onChange={e => handleChange('basic.category', e.target.value)} placeholder="视觉/机械/互动..." />
                        </div>
                        <div className="space-y-2">
                            <Label>来源</Label>
                            <Select value={data.basic?.source} onValueChange={v => handleChange('basic.source', v)}>
                                <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="自研">自研</SelectItem>
                                    <SelectItem value="采购">采购</SelectItem>
                                    <SelectItem value="开源">开源</SelectItem>
                                    <SelectItem value="定制">定制</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label>方案描述</Label>
                        <Textarea value={data.basic?.description} onChange={e => handleChange('basic.description', e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <Label>关键词 (逗号分隔)</Label>
                        <Input value={data.basic?.keywords?.join(', ')} onChange={e => handleArrayChange('basic.keywords', e.target.value)} />
                     </div>
                </div>
            </Card>

            <Tabs defaultValue="specs">
                <TabsList className="grid w-full grid-cols-5 h-auto flex-wrap">
                    <TabsTrigger value="specs">技术规格</TabsTrigger>
                    <TabsTrigger value="analysis">可行性评估</TabsTrigger>
                    <TabsTrigger value="requirements">实施要求</TabsTrigger>
                    <TabsTrigger value="interaction">交互体验</TabsTrigger>
                    <TabsTrigger value="cost">成本估算</TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>技术规格参数</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>尺寸</Label>
                                <Input value={data.specs?.dimensions} onChange={e => handleChange('specs.dimensions', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>重量</Label>
                                <Input value={data.specs?.weight} onChange={e => handleChange('specs.weight', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>功耗</Label>
                                <Input value={data.specs?.power} onChange={e => handleChange('specs.power', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>材质 (逗号分隔)</Label>
                            <Input value={data.specs?.materials?.join(', ')} onChange={e => handleArrayChange('specs.materials', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>网络需求</Label>
                                <Input value={data.specs?.network} onChange={e => handleChange('specs.network', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>软件环境</Label>
                                <Input value={data.specs?.software} onChange={e => handleChange('specs.software', e.target.value)} />
                            </div>
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>可行性评估</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>技术成熟度 (TRL 1-9)</Label>
                                <Input type="number" min="1" max="9" value={data.analysis?.maturity?.trl} onChange={e => handleChange('analysis.maturity.trl', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>商业状态</Label>
                                <Input value={data.analysis?.maturity?.status} onChange={e => handleChange('analysis.maturity.status', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>案例数量</Label>
                                <Input type="number" value={data.analysis?.maturity?.cases} onChange={e => handleChange('analysis.maturity.cases', Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>平均无故障时间 (MTBF)</Label>
                                <Input value={data.analysis?.stability?.mtbf} onChange={e => handleChange('analysis.stability.mtbf', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>维护周期</Label>
                                <Input value={data.analysis?.stability?.maintenanceCycle} onChange={e => handleChange('analysis.stability.maintenanceCycle', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>风险等级</Label>
                                <Select value={data.analysis?.riskLevel} onValueChange={v => handleChange('analysis.riskLevel', v)}>
                                    <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">低风险</SelectItem>
                                        <SelectItem value="Medium">中风险</SelectItem>
                                        <SelectItem value="High">高风险</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>潜在风险 (逗号分隔)</Label>
                            <Input value={data.analysis?.safety?.risks?.join(', ')} onChange={e => handleArrayChange('analysis.safety.risks', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>防护措施 (逗号分隔)</Label>
                            <Input value={data.analysis?.safety?.measures?.join(', ')} onChange={e => handleArrayChange('analysis.safety.measures', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>所需认证 (逗号分隔)</Label>
                            <Input value={data.analysis?.safety?.certifications?.join(', ')} onChange={e => handleArrayChange('analysis.safety.certifications', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="requirements" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>实施与环境要求</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>温度要求</Label>
                                <Input value={data.requirements?.environment?.temperature} onChange={e => handleChange('requirements.environment.temperature', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>湿度要求</Label>
                                <Input value={data.requirements?.environment?.humidity} onChange={e => handleChange('requirements.environment.humidity', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>光照要求</Label>
                                <Input value={data.requirements?.environment?.lighting} onChange={e => handleChange('requirements.environment.lighting', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>噪音限制</Label>
                                <Input value={data.requirements?.environment?.noise} onChange={e => handleChange('requirements.environment.noise', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>空间要求</Label>
                            <Input value={data.requirements?.installation?.space} onChange={e => handleChange('requirements.installation.space', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>实施难度 (1-5)</Label>
                                <Input type="number" min="1" max="5" value={data.requirements?.installation?.difficulty} onChange={e => handleChange('requirements.installation.difficulty', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>实施周期</Label>
                                <Input value={data.requirements?.installation?.time} onChange={e => handleChange('requirements.installation.time', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>开发技能 (逗号分隔)</Label>
                            <Input value={data.requirements?.skill?.development?.join(', ')} onChange={e => handleArrayChange('requirements.skill.development', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>运维技能 (逗号分隔)</Label>
                            <Input value={data.requirements?.skill?.operation?.join(', ')} onChange={e => handleArrayChange('requirements.skill.operation', e.target.value)} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="interaction" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>交互与性能</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>输入设备 (逗号分隔)</Label>
                            <Input value={data.interaction?.input?.join(', ')} onChange={e => handleArrayChange('interaction.input', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>输出设备 (逗号分隔)</Label>
                            <Input value={data.interaction?.output?.join(', ')} onChange={e => handleArrayChange('interaction.output', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>响应延迟</Label>
                                <Input value={data.interaction?.latency} onChange={e => handleChange('interaction.latency', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>并发吞吐量</Label>
                                <Input value={data.interaction?.throughput} onChange={e => handleChange('interaction.throughput', e.target.value)} />
                            </div>
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="cost" className="space-y-4 mt-4">
                    <Card><CardHeader><CardTitle>成本估算 (CNY)</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>研发成本</Label>
                                <Input type="number" value={data.cost?.development} onChange={e => handleChange('cost.development', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>硬件成本</Label>
                                <Input type="number" value={data.cost?.hardware} onChange={e => handleChange('cost.hardware', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>软件成本</Label>
                                <Input type="number" value={data.cost?.software} onChange={e => handleChange('cost.software', Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>实施部署</Label>
                                <Input type="number" value={data.cost?.deployment} onChange={e => handleChange('cost.deployment', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>年维护费</Label>
                                <Input type="number" value={data.cost?.maintenance} onChange={e => handleChange('cost.maintenance', Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>总计估算</Label>
                                <Input type="number" value={data.cost?.total} onChange={e => handleChange('cost.total', Number(e.target.value))} />
                            </div>
                        </div>
                    </CardContent></Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}
