'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createTrendAction, updateTrendAction } from '@/app/actions/trend'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface TrendFormProps {
    initialData?: any
    isEditing?: boolean
}

export function TrendForm({ initialData, isEditing = false }: TrendFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            if (isEditing && initialData?.id) {
                // Append ID to formData for update
                formData.append('id', initialData.id);
                const res = await updateTrendAction(formData);
                if (res.success) {
                    toast.success('更新成功');
                    router.push(`/cognitive/trends/${initialData.id}`);
                } else {
                    toast.error('更新失败');
                }
            } else {
                const res = await createTrendAction(formData);
                if (res.success) {
                    toast.success('创建成功');
                    router.push('/cognitive/trends');
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
                    {isEditing ? '保存修改' : '创建趋势'}
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>趋势基础</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>趋势名称</Label>
                            <Input name="name" required placeholder="例如: AI视觉交互" defaultValue={initialData?.basic?.name} />
                        </div>
                        <div className="space-y-2">
                            <Label>趋势别名 (逗号分隔)</Label>
                            <Input name="aliases" placeholder="例如: 视觉交互, 机器视觉" defaultValue={initialData?.basic?.aliases?.join(', ')} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>发现时间</Label>
                                <Input type="date" name="discoveryDate" defaultValue={initialData?.basic?.discoveryDate} />
                            </div>
                            <div className="space-y-2">
                                <Label>预计衰退期</Label>
                                <Input type="date" name="declineDate" defaultValue={initialData?.basic?.declineDate} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>成熟期开始</Label>
                                <Input type="date" name="maturityStart" defaultValue={initialData?.basic?.maturityPeriod?.start} />
                            </div>
                            <div className="space-y-2">
                                <Label>成熟期结束</Label>
                                <Input type="date" name="maturityEnd" defaultValue={initialData?.basic?.maturityPeriod?.end} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>趋势属性</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>趋势类型</Label>
                                <Select name="type" defaultValue={initialData?.attributes?.type || "Technical"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Technical">技术</SelectItem>
                                        <SelectItem value="Content">内容</SelectItem>
                                        <SelectItem value="Experience">体验</SelectItem>
                                        <SelectItem value="Other">其他</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>趋势强度</Label>
                                <Select name="intensity" defaultValue={initialData?.attributes?.intensity || "Growing"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Emerging">萌芽期</SelectItem>
                                        <SelectItem value="Growing">成长期</SelectItem>
                                        <SelectItem value="Mature">成熟期</SelectItem>
                                        <SelectItem value="Declining">衰退期</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>影响范围 (逗号分隔)</Label>
                            <Input name="scope" placeholder="例如: 国内, 行业" defaultValue={initialData?.attributes?.scope?.join(', ')} />
                        </div>
                        <div className="space-y-2">
                            <Label>可信度评级</Label>
                            <Select name="credibility" defaultValue={initialData?.attributes?.credibility || "Medium"}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">低</SelectItem>
                                    <SelectItem value="Medium">中</SelectItem>
                                    <SelectItem value="High">高</SelectItem>
                                    <SelectItem value="Verified">已验证</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>内容描述</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>趋势描述</Label>
                            <Textarea name="description" className="min-h-[100px]" defaultValue={initialData?.content?.description} />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>核心特性 (每行一个)</Label>
                                <Textarea name="features" placeholder="实时性&#10;个性化" defaultValue={initialData?.content?.features?.join('\n')} />
                            </div>
                            <div className="space-y-2">
                                <Label>驱动因素 (每行一个)</Label>
                                <Textarea name="drivers" placeholder="硬件成本下降&#10;用户需求" defaultValue={initialData?.content?.drivers?.join('\n')} />
                            </div>
                            <div className="space-y-2">
                                <Label>制约因素 (每行一个)</Label>
                                <Textarea name="constraints" placeholder="技术门槛&#10;隐私问题" defaultValue={initialData?.content?.constraints?.join('\n')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>影响与数据</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>对设计的影响</Label>
                                <Textarea name="impactDesign" defaultValue={initialData?.impact?.design} />
                            </div>
                            <div className="space-y-2">
                                <Label>对技术的影响</Label>
                                <Textarea name="impactTech" defaultValue={initialData?.impact?.technology} />
                            </div>
                            <div className="space-y-2">
                                <Label>对成本的影响</Label>
                                <Textarea name="impactCost" defaultValue={initialData?.impact?.cost} />
                            </div>
                            <div className="space-y-2">
                                <Label>对用户的影响</Label>
                                <Textarea name="impactUser" defaultValue={initialData?.impact?.user} />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <Label>市场占比 (%)</Label>
                                <Input type="number" name="marketShare" defaultValue={initialData?.data?.marketShare} />
                            </div>
                            <div className="space-y-2">
                                <Label>年增长率 (%)</Label>
                                <Input type="number" name="growthRate" defaultValue={initialData?.data?.growthRate} />
                            </div>
                            <div className="space-y-2">
                                <Label>专利数</Label>
                                <Input type="number" name="patents" defaultValue={initialData?.data?.patents} />
                            </div>
                            <div className="space-y-2">
                                <Label>论文数</Label>
                                <Input type="number" name="papers" defaultValue={initialData?.data?.papers} />
                            </div>
                            <div className="space-y-2">
                                <Label>报道量</Label>
                                <Input type="number" name="mediaReports" defaultValue={initialData?.data?.mediaReports} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>应用建议</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>适用场景 (逗号分隔)</Label>
                            <Input name="scenarios" placeholder="例如: 科技馆, 企业展厅" defaultValue={initialData?.application?.scenarios?.join(', ')} />
                        </div>
                        <div className="space-y-2">
                            <Label>实施建议</Label>
                            <Textarea name="suggestions" defaultValue={initialData?.application?.suggestions} />
                        </div>
                        <div className="space-y-2">
                            <Label>风险评估</Label>
                            <Textarea name="risks" defaultValue={initialData?.application?.risks} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}
