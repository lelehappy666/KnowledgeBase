import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { getTypeById } from "@/lib/type-system";
import { notFound } from "next/navigation";
import { DeleteTypeButton } from "@/components/admin/delete-type-button";

export default async function TypeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const item = await getTypeById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" className="pl-0 hover:bg-transparent" asChild>
                <Link href="/cognitive/types" className="flex items-center text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    返回列表
                </Link>
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href={`/admin/types/${item.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                    </Link>
                </Button>
                <DeleteTypeButton id={item.id} name={item.definition.name} />
            </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{item.definition.name}</h1>
                    <p className="text-xl text-muted-foreground">{item.definition.code}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>分类属性</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm text-muted-foreground block mb-1">交互方式</span>
                            <div className="flex flex-wrap gap-2">
                                {item.classification.interactionMethod.map(m => <Badge key={m} variant="secondary">{m}</Badge>)}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground block mb-1">内容类型</span>
                            <div className="flex flex-wrap gap-2">
                                {item.classification.contentType.map(m => <Badge key={m} variant="secondary">{m}</Badge>)}
                            </div>
                        </div>
                         <div>
                            <span className="text-sm text-muted-foreground block mb-1">体验类型</span>
                            <div className="flex flex-wrap gap-2">
                                {item.classification.experienceType.map(m => <Badge key={m} variant="secondary">{m}</Badge>)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>设计规范</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">设计指南</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{item.design.designGuide || '-'}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-semibold mb-2">布局建议</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{item.design.layoutSuggestions || '-'}</p>
                        </div>
                        <Separator />
                         <div>
                            <h3 className="font-semibold mb-2">安全规范</h3>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {item.design.safetySpecs.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <Separator />
                         <div>
                            <h3 className="font-semibold mb-2">无障碍设计</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{item.design.accessibility || '-'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>评价标准</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-medium mb-2">体验性</h4>
                            <p className="text-sm text-muted-foreground">{item.evaluation.experienceStandard || '-'}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">教育性</h4>
                            <p className="text-sm text-muted-foreground">{item.evaluation.educationStandard || '-'}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">技术性</h4>
                            <p className="text-sm text-muted-foreground">{item.evaluation.technicalStandard || '-'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>技术属性</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">复杂度</span>
                            <span className="font-medium">{item.technical.complexity}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">实现难度</span>
                            <span className="font-medium">{item.technical.difficulty} / 5</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">开发周期</span>
                            <span className="font-medium">{item.technical.developmentCycle}</span>
                        </div>
                        <Separator />
                        <div>
                            <span className="text-sm text-muted-foreground block mb-2">技术要求</span>
                            <div className="flex flex-wrap gap-2">
                                {item.technical.techRequirements.map((r, i) => <Badge key={i} variant="outline">{r}</Badge>)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>体验属性</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">互动深度</span>
                            <span className="font-medium">{item.experience.interactionDepth}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">参与人数</span>
                            <span className="font-medium">{item.experience.participantCount}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">互动时长</span>
                            <span className="font-medium">{item.experience.duration}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">学习曲线</span>
                            <span className="font-medium">{item.experience.learningCurve}</span>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>应用与成本</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                             <span className="text-sm text-muted-foreground block mb-1">适用空间</span>
                             <p className="text-sm">{item.application.spaceRequirements.join(', ')}</p>
                        </div>
                         <div>
                             <span className="text-sm text-muted-foreground block mb-1">适用场景</span>
                             <p className="text-sm">{item.application.scenarios.join(', ')}</p>
                        </div>
                         <div>
                             <span className="text-sm text-muted-foreground block mb-1">适用受众</span>
                             <p className="text-sm">{item.application.audience.join(', ')}</p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-muted-foreground">成本范围</div>
                                <div className="font-medium">{item.cost.costRange}</div>
                            </div>
                             <div>
                                <div className="text-xs text-muted-foreground">维护成本</div>
                                <div className="font-medium">{item.cost.maintenanceCost}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
