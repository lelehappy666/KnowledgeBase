import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getSciencePrincipleById, deleteSciencePrinciple } from "@/lib/content-system";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteSciencePrincipleAction } from "@/app/actions/science-principle";

export default async function SciencePrincipleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const principle = await getSciencePrincipleById(id);

  if (!principle) {
    notFound();
  }

  async function deleteAction() {
    'use server'
    await deleteSciencePrincipleAction(id);
    redirect('/content/science-principles');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/content/science-principles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{principle.name}</h1>
                    <p className="text-muted-foreground">{principle.basic.enName}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Link href={`/content/science-principles/${id}/edit`}>
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
            <Card className="md:col-span-2">
                <CardHeader><CardTitle>摘要</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed">{principle.basic.abstract}</p>
                    {principle.basic.history && (
                        <div className="mt-4 p-4 bg-muted rounded-md text-sm">
                            <h4 className="font-semibold mb-2">发现历史</h4>
                            <p>{principle.basic.history}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>分类信息</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">一级学科</span>
                        <span className="font-medium">{principle.classification.category}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">二级学科</span>
                        <span className="font-medium">{principle.classification.subCategory}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">知识体系</span>
                        <span className="font-medium">{principle.classification.knowledgeSystem}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">难度层级</span>
                        <Badge variant="secondary">{principle.classification.difficultyLevel}</Badge>
                    </div>
                     <div className="space-y-2">
                        <span className="text-muted-foreground text-sm">交叉学科</span>
                        <div className="flex flex-wrap gap-1">
                            {principle.classification.crossDiscipline.map(d => <Badge key={d} variant="outline">{d}</Badge>)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-3">
                <Tabs defaultValue="education">
                    <TabsList>
                        <TabsTrigger value="education">教育与课程</TabsTrigger>
                        <TabsTrigger value="exhibit">展项关联</TabsTrigger>
                        <TabsTrigger value="activity">课程活动</TabsTrigger>
                        <TabsTrigger value="cross">跨学科</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="education" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                             <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2">适用范围</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {principle.education.gradeLevel.map(g => <Badge key={g}>{g}</Badge>)}
                                    </div>
                                    <h3 className="font-semibold mb-2">课标要求</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{principle.education.curriculum.requirements}</p>
                                    <h3 className="font-semibold mb-2">核心素养</h3>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                        {principle.education.curriculum.coreLiteracy.map(c => <li key={c}>{c}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">教学建议</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{principle.education.teaching.suggestions}</p>
                                    <h3 className="font-semibold mb-2">常见误区</h3>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                        {principle.education.teaching.misconceptions.map(m => <li key={m}>{m}</li>)}
                                    </ul>
                                </div>
                             </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="exhibit" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                            <div className="flex gap-4 mb-4">
                                <Badge variant="outline">可展示性: {principle.exhibitRelation.exhibitability}</Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2">设计策略</h3>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <p><strong>视觉策略:</strong> {principle.exhibitRelation.design.visualStrategy}</p>
                                        <p><strong>交互要点:</strong> {principle.exhibitRelation.design.interactionPoints.join(', ')}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">难度评分</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex justify-between"><span>理解难度</span><span>{principle.exhibitRelation.difficulty.understanding}/5</span></div>
                                        <div className="flex justify-between"><span>操作难度</span><span>{principle.exhibitRelation.difficulty.operation}/5</span></div>
                                        <div className="flex justify-between"><span>沉浸深度</span><span>{principle.exhibitRelation.difficulty.immersion}/5</span></div>
                                        <div className="flex justify-between"><span>记忆强度</span><span>{principle.exhibitRelation.difficulty.memory}/5</span></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-4">
                         <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2">课程信息</h3>
                                    <p className="text-sm"><strong>主题:</strong> {principle.activity.curriculum.theme}</p>
                                    <p className="text-sm"><strong>类型:</strong> {principle.activity.curriculum.type.join(', ')}</p>
                                    <p className="text-sm"><strong>时长:</strong> {principle.activity.curriculum.duration}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">PBL项目</h3>
                                    <p className="text-sm"><strong>驱动问题:</strong> {principle.activity.project.drivingQuestion}</p>
                                    <p className="text-sm"><strong>产出:</strong> {principle.activity.project.outcome.join(', ')}</p>
                                </div>
                            </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="cross" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-5 gap-4 text-center">
                                {Object.entries(principle.crossDisciplinary.steam).map(([k, v]) => (
                                    <div key={k} className="p-2 bg-muted rounded">
                                        <div className="font-bold uppercase text-lg">{k}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {Array.isArray(v) ? v.join(', ') : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <div className="mt-6">
                                <h3 className="font-semibold mb-2">应用领域</h3>
                                <div className="flex flex-wrap gap-2">
                                    {principle.crossDisciplinary.application.daily.map(a => <Badge key={a} variant="secondary">生活: {a}</Badge>)}
                                    {principle.crossDisciplinary.application.industrial.map(a => <Badge key={a} variant="secondary">工业: {a}</Badge>)}
                                    {principle.crossDisciplinary.application.medical.map(a => <Badge key={a} variant="secondary">医疗: {a}</Badge>)}
                                </div>
                            </div>
                        </CardContent></Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
      </div>
    </div>
  );
}
