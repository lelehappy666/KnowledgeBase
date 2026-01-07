import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getSubjectMappingById } from "@/lib/content-system";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash, BookOpen, GraduationCap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteSubjectMappingAction } from "@/app/actions/subject-mapping";

export default async function SubjectMappingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const mapping = await getSubjectMappingById(id);

  if (!mapping) {
    notFound();
  }

  async function deleteAction() {
    'use server'
    await deleteSubjectMappingAction(id);
    redirect('/content/subject-mappings');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/content/subject-mappings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{mapping.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Badge variant="outline">{mapping.basic.code}</Badge>
                        <span>{mapping.basic.purpose}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <Link href={`/content/subject-mappings/${id}/edit`}>
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                    </Button>
                </Link>
                <form action={deleteAction}>
                    <Button variant="destructive" type="submit">
                        <Trash className="mr-2 h-4 w-4" />
                        删除
                    </Button>
                </form>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
                <CardHeader><CardTitle>维度快照</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">学科定位</span>
                        <div className="flex flex-wrap gap-1">
                             <Badge>{mapping.dimensions.subject.category}</Badge>
                             <Badge variant="secondary">{mapping.dimensions.subject.branch}</Badge>
                        </div>
                    </div>
                     <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">适用学段</span>
                        <div className="flex flex-wrap gap-1">
                             <Badge variant="outline">{mapping.dimensions.grade.level}</Badge>
                             <span className="text-sm">{mapping.dimensions.grade.ageRange}</span>
                        </div>
                    </div>
                     <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">展项类型</span>
                        <div className="text-sm font-medium">{mapping.dimensions.exhibit.subTypes.join(', ')}</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader><CardTitle>核心知识匹配</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {mapping.knowledge.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">知识点编码: {mapping.knowledge.code}</p>
                        </div>
                         <div className="text-right">
                             <div className="text-sm text-muted-foreground">匹配度</div>
                             <div className="text-2xl font-bold text-green-600">{mapping.knowledge.match.score}/5</div>
                         </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-sm">
                        <p className="font-medium mb-1">匹配理由:</p>
                        <p>{mapping.knowledge.match.reason}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                         <div>
                             <span className="text-green-600 font-medium">优势:</span> {mapping.knowledge.match.pros.join(', ')}
                         </div>
                         <div>
                             <span className="text-red-500 font-medium">劣势:</span> {mapping.knowledge.match.cons.join(', ')}
                         </div>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-3">
                <Tabs defaultValue="teaching">
                    <TabsList>
                        <TabsTrigger value="teaching">教学整合</TabsTrigger>
                        <TabsTrigger value="goals">目标与评估</TabsTrigger>
                        <TabsTrigger value="implementation">实施支持</TabsTrigger>
                        <TabsTrigger value="validation">案例验证</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="teaching" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                             <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4"/> 教学策略</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li><strong>时机:</strong> {mapping.teaching.timing}</li>
                                        <li><strong>时长:</strong> {mapping.teaching.duration}</li>
                                        <li><strong>方法:</strong> {mapping.teaching.method.join(', ')}</li>
                                        <li><strong>连接:</strong> {mapping.teaching.connection}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">适应性分析</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li><strong>认知难度:</strong> {mapping.teaching.difficulty.cognitive}/5</li>
                                        <li><strong>操作难度:</strong> {mapping.teaching.difficulty.operation}/5</li>
                                        <li><strong>特殊需求:</strong> {mapping.teaching.adaptability.specialNeeds.join(', ') || '无'}</li>
                                    </ul>
                                </div>
                             </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="goals" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Target className="h-4 w-4"/> 学习目标</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><Badge variant="outline">知识</Badge> {mapping.goals.knowledge.join('; ')}</div>
                                        <div><Badge variant="outline">能力</Badge> {mapping.goals.ability.join('; ')}</div>
                                        <div><Badge variant="outline">素养</Badge> {mapping.goals.literacy.join('; ')}</div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">评估方案</h3>
                                    <p className="text-sm mb-2"><strong>预期表现:</strong> {mapping.assessment.performance}</p>
                                    <p className="text-sm mb-2"><strong>产出作品:</strong> {mapping.outcome.works.join(', ')}</p>
                                </div>
                            </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="implementation" className="mt-4">
                         <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-muted rounded">
                                    <div className="font-medium mb-1">空间需求</div>
                                    <div className="text-sm">{mapping.implementation.conditions.space}</div>
                                </div>
                                 <div className="p-4 bg-muted rounded">
                                    <div className="font-medium mb-1">设备清单</div>
                                    <div className="text-sm">{mapping.implementation.conditions.equipment.join(', ')}</div>
                                </div>
                                 <div className="p-4 bg-muted rounded">
                                    <div className="font-medium mb-1">总成本</div>
                                    <div className="text-sm font-mono">¥{mapping.implementation.cost.total}</div>
                                </div>
                            </div>
                            <div className="text-sm border-t pt-4">
                                <strong>安全提示:</strong> {mapping.implementation.conditions.safety}
                            </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="validation" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                            {mapping.validation.schools.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">验证学校: {mapping.validation.schools.join(', ')}</div>
                                        <Badge variant={mapping.validation.status.level === '已验证' ? 'default' : 'secondary'}>{mapping.validation.status.level}</Badge>
                                    </div>
                                    <div className="p-4 bg-green-50 text-green-800 rounded text-sm">
                                        <strong>反馈摘要:</strong> {mapping.validation.report}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">暂无验证案例</div>
                            )}
                        </CardContent></Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
      </div>
    </div>
  );
}
