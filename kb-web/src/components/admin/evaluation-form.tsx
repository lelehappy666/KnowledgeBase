'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createEvaluationAction, updateEvaluationAction } from '@/app/actions/evaluation'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Slider } from "@/components/ui/slider"

interface EvaluationFormProps {
    initialData?: any
    isEditing?: boolean
}

export function EvaluationForm({ initialData, isEditing = false }: EvaluationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            if (isEditing && initialData?.id) {
                formData.append('id', initialData.id);
                const res = await updateEvaluationAction(formData);
                if (res.success) {
                    toast.success('更新成功');
                    router.push(`/cognitive/evaluations/${initialData.id}`);
                } else {
                    toast.error('更新失败');
                }
            } else {
                const res = await createEvaluationAction(formData);
                if (res.success) {
                    toast.success('创建成功');
                    router.push('/cognitive/evaluations');
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
        <form action={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>取消</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? '保存修改' : '创建评价'}
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>评价对象</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>对象类型</Label>
                                <Select name="targetType" defaultValue={initialData?.target?.type || "Exhibit"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Exhibit">具体展品</SelectItem>
                                        <SelectItem value="Type">展项类型</SelectItem>
                                        <SelectItem value="Trend">前沿趋势</SelectItem>
                                        <SelectItem value="Other">其他</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label>对象名称</Label>
                                <Input name="targetName" required placeholder="例如: Hololens 2" defaultValue={initialData?.target?.name} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>关联ID (可选)</Label>
                            <Input name="targetRefId" placeholder="关联的系统ID" defaultValue={initialData?.target?.refId} />
                        </div>
                         <div className="space-y-2">
                            <Label>标签 (逗号分隔)</Label>
                            <Input name="tags" placeholder="例如: AR, 穿戴式" defaultValue={initialData?.tags?.join(', ')} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>成本分析</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>成本范围</Label>
                            <Select name="costRange" defaultValue={initialData?.cost?.range || "10-30万"}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0-1万">0-1万 (极低)</SelectItem>
                                    <SelectItem value="1-5万">1-5万</SelectItem>
                                    <SelectItem value="5-10万">5-10万</SelectItem>
                                    <SelectItem value="10-30万">10-30万</SelectItem>
                                    <SelectItem value="30-100万">30-100万</SelectItem>
                                    <SelectItem value="100万以上">100万以上</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>成本详情说明</Label>
                            <Textarea name="costDetails" placeholder="硬件成本占比... 软件成本..." defaultValue={initialData?.cost?.details} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>评分维度 (1-5分)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                             <ScoreInput label="体验性 (顺畅/有趣)" name="scoreExperience" defaultValue={initialData?.scores?.experience} />
                             <ScoreInput label="易理解性 (任务清晰)" name="scoreUnderstanding" defaultValue={initialData?.scores?.understanding} />
                             <ScoreInput label="科学性 (严谨/可视化)" name="scoreScientific" defaultValue={initialData?.scores?.scientific} />
                             <ScoreInput label="可维护性 (易修)" name="scoreMaintainability" defaultValue={initialData?.scores?.maintainability} />
                             <ScoreInput label="创新度 (突破性)" name="scoreInnovation" defaultValue={initialData?.scores?.innovation} />
                             <ScoreInput label="可复制性 (产品化)" name="scoreReplicability" defaultValue={initialData?.scores?.replicability} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>综合分析</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>优点 (Pros) - 每行一个</Label>
                                <Textarea name="analysisPros" className="min-h-[150px]" defaultValue={initialData?.analysis?.pros?.join('\n')} />
                            </div>
                            <div className="space-y-2">
                                <Label>缺点/痛点 (Cons) - 每行一个</Label>
                                <Textarea name="analysisCons" className="min-h-[150px]" defaultValue={initialData?.analysis?.cons?.join('\n')} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>总结评价</Label>
                            <Textarea name="analysisSummary" className="min-h-[100px]" defaultValue={initialData?.analysis?.summary} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}

function ScoreInput({ label, name, defaultValue = 3 }: { label: string, name: string, defaultValue?: number }) {
    const [value, setValue] = useState(defaultValue);
    return (
        <div className="space-y-3">
            <div className="flex justify-between">
                <Label>{label}</Label>
                <span className="font-bold text-primary">{value}</span>
            </div>
            <Slider 
                defaultValue={[value]} 
                max={5} 
                min={1} 
                step={1} 
                onValueChange={(vals) => setValue(vals[0])} 
            />
            <input type="hidden" name={name} value={value} />
        </div>
    )
}
