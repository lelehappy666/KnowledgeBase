'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createTypeAction, updateTypeAction } from '@/app/actions/type'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface TypeFormProps {
    initialData?: any
    isEditing?: boolean
}

export function TypeForm({ initialData, isEditing = false }: TypeFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            if (isEditing && initialData?.id) {
                formData.append('id', initialData.id);
                const res = await updateTypeAction(formData);
                if (res.success) {
                    toast.success('更新成功');
                    router.push(`/cognitive/types/${initialData.id}`);
                } else {
                    toast.error('更新失败');
                }
            } else {
                const res = await createTypeAction(formData);
                if (res.success) {
                    toast.success('创建成功');
                    router.push('/cognitive/types');
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
                    {isEditing ? '保存修改' : '创建类型'}
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>类型定义</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>类型名称</Label>
                            <Input name="name" required placeholder="例如: 体感互动装置" defaultValue={initialData?.definition?.name} />
                        </div>
                        <div className="space-y-2">
                            <Label>类型代码</Label>
                            <Input name="code" placeholder="例如: TYPE_SENSOR_001" defaultValue={initialData?.definition?.code} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>分类属性</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>交互方式 (逗号分隔)</Label>
                            <Input name="interactionMethod" placeholder="例如: 体感, 光影" defaultValue={initialData?.classification?.interactionMethod?.join(', ')} />
                        </div>
                        <div className="space-y-2">
                            <Label>内容类型 (逗号分隔)</Label>
                            <Input name="contentType" placeholder="例如: 科普, 游戏化互动" defaultValue={initialData?.classification?.contentType?.join(', ')} />
                        </div>
                        <div className="space-y-2">
                            <Label>体验类型 (逗号分隔)</Label>
                            <Input name="experienceType" placeholder="例如: 参与型, 协作型" defaultValue={initialData?.classification?.experienceType?.join(', ')} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>技术属性</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>技术复杂度</Label>
                                <Select name="complexity" defaultValue={initialData?.technical?.complexity || "Medium"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">低</SelectItem>
                                        <SelectItem value="Medium">中</SelectItem>
                                        <SelectItem value="High">高</SelectItem>
                                        <SelectItem value="Very High">极高</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>实现难度 (1-5)</Label>
                                <Input type="number" min="1" max="5" name="difficulty" defaultValue={initialData?.technical?.difficulty || 3} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>开发周期</Label>
                            <Select name="developmentCycle" defaultValue={initialData?.technical?.developmentCycle || "1-3个月"}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1个月内">1个月内</SelectItem>
                                    <SelectItem value="1-3个月">1-3个月</SelectItem>
                                    <SelectItem value="3-6个月">3-6个月</SelectItem>
                                    <SelectItem value="6个月以上">6个月以上</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>技术要求 (每行一个)</Label>
                            <Textarea name="techRequirements" placeholder="动作捕捉&#10;实时渲染" defaultValue={initialData?.technical?.techRequirements?.join('\n')} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>体验属性</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>互动深度</Label>
                                <Select name="interactionDepth" defaultValue={initialData?.experience?.interactionDepth || "中度互动"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="浅层互动">浅层互动</SelectItem>
                                        <SelectItem value="中度互动">中度互动</SelectItem>
                                        <SelectItem value="深度互动">深度互动</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>参与人数</Label>
                                <Select name="participantCount" defaultValue={initialData?.experience?.participantCount || "单人"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="单人">单人</SelectItem>
                                        <SelectItem value="2-5人">2-5人</SelectItem>
                                        <SelectItem value="6-10人">6-10人</SelectItem>
                                        <SelectItem value="10人以上">10人以上</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>互动时长</Label>
                                <Select name="duration" defaultValue={initialData?.experience?.duration || "1-3分钟"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1分钟内">1分钟内</SelectItem>
                                        <SelectItem value="1-3分钟">1-3分钟</SelectItem>
                                        <SelectItem value="3-5分钟">3-5分钟</SelectItem>
                                        <SelectItem value="5分钟以上">5分钟以上</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>学习曲线</Label>
                                <Select name="learningCurve" defaultValue={initialData?.experience?.learningCurve || "简单学习"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="无需学习">无需学习</SelectItem>
                                        <SelectItem value="简单学习">简单学习</SelectItem>
                                        <SelectItem value="需要指导">需要指导</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>应用与成本</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>适用空间 (逗号分隔)</Label>
                            <Input name="spaceRequirements" placeholder="中型空间, 大型空间" defaultValue={initialData?.application?.spaceRequirements?.join(', ')} />
                        </div>
                        <div className="space-y-2">
                            <Label>适用场景 (逗号分隔)</Label>
                            <Input name="scenarios" placeholder="常设展览, 教育活动" defaultValue={initialData?.application?.scenarios?.join(', ')} />
                        </div>
                        <div className="space-y-2">
                            <Label>适用受众 (逗号分隔)</Label>
                            <Input name="audience" placeholder="儿童, 青少年" defaultValue={initialData?.application?.audience?.join(', ')} />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label>成本范围</Label>
                                <Input name="costRange" placeholder="10-30万" defaultValue={initialData?.cost?.costRange} />
                            </div>
                            <div className="space-y-2">
                                <Label>维护成本</Label>
                                <Select name="maintenanceCost" defaultValue={initialData?.cost?.maintenanceCost || "Medium"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">低</SelectItem>
                                        <SelectItem value="Medium">中</SelectItem>
                                        <SelectItem value="High">高</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>更新频率</Label>
                                <Select name="updateFrequency" defaultValue={initialData?.cost?.updateFrequency || "低频更新"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="无需更新">无需更新</SelectItem>
                                        <SelectItem value="低频更新">低频更新</SelectItem>
                                        <SelectItem value="中频更新">中频更新</SelectItem>
                                        <SelectItem value="高频更新">高频更新</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>设计与评价</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>设计指南</Label>
                            <Textarea name="designGuide" className="min-h-[100px]" defaultValue={initialData?.design?.designGuide} />
                        </div>
                         <div className="space-y-2">
                            <Label>布局建议</Label>
                            <Textarea name="layoutSuggestions" className="min-h-[100px]" defaultValue={initialData?.design?.layoutSuggestions} />
                        </div>
                         <div className="space-y-2">
                            <Label>安全规范 (每行一个)</Label>
                            <Textarea name="safetySpecs" className="min-h-[100px]" defaultValue={initialData?.design?.safetySpecs?.join('\n')} />
                        </div>
                        <div className="space-y-2">
                            <Label>无障碍设计</Label>
                            <Textarea name="accessibility" className="min-h-[100px]" defaultValue={initialData?.design?.accessibility} />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                             <div className="space-y-2">
                                <Label>体验性评价标准</Label>
                                <Textarea name="experienceStandard" className="min-h-[100px]" defaultValue={initialData?.evaluation?.experienceStandard} />
                            </div>
                             <div className="space-y-2">
                                <Label>教育性评价标准</Label>
                                <Textarea name="educationStandard" className="min-h-[100px]" defaultValue={initialData?.evaluation?.educationStandard} />
                            </div>
                             <div className="space-y-2">
                                <Label>技术性评价标准</Label>
                                <Textarea name="technicalStandard" className="min-h-[100px]" defaultValue={initialData?.evaluation?.technicalStandard} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}
