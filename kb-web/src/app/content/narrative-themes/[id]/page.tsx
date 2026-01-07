import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getNarrativeThemeById } from "@/lib/content-system";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash, Zap, Layout, Users, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteNarrativeThemeAction } from "@/app/actions/narrative-theme";

export default async function NarrativeThemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const theme = await getNarrativeThemeById(id);

  if (!theme) {
    notFound();
  }

  async function deleteAction() {
    'use server'
    await deleteNarrativeThemeAction(id);
    redirect('/content/narrative-themes');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/content/narrative-themes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{theme.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Badge variant="outline">{theme.basic.id}</Badge>
                        <span className="italic">"{theme.basic.slogan}"</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <Link href={`/content/narrative-themes/${id}/edit`}>
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
                <CardHeader><CardTitle>主题摘要</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed mb-4">{theme.basic.abstract}</p>
                    <div className="flex flex-wrap gap-2">
                        {theme.basic.relations.keywords.map(k => <Badge key={k} variant="secondary">#{k}</Badge>)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>关键属性</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">类型</span>
                        <span className="font-medium">{theme.basic.attributes.type}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">规模</span>
                        <span className="font-medium">{theme.basic.attributes.scale}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">重要性</span>
                        <span className="font-medium">{theme.basic.attributes.importance}</span>
                    </div>
                     <div className="space-y-2">
                        <span className="text-muted-foreground text-sm">关联学科</span>
                        <div className="flex flex-wrap gap-1">
                            {theme.basic.relations.subjects.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-3">
                <Tabs defaultValue="structure">
                    <TabsList>
                        <TabsTrigger value="structure">叙事结构</TabsTrigger>
                        <TabsTrigger value="configuration">布局与展项</TabsTrigger>
                        <TabsTrigger value="experience">体验设计</TabsTrigger>
                        <TabsTrigger value="evaluation">评估数据</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="structure" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-6">
                             <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2"><Layout className="h-4 w-4"/> 叙事框架</h3>
                                    <p className="text-sm"><strong>类型:</strong> {theme.structure.framework.type}</p>
                                    <p className="text-sm"><strong>视角:</strong> {theme.structure.framework.perspective}</p>
                                    <p className="text-sm"><strong>节奏:</strong> {theme.structure.framework.rhythm}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2"><Zap className="h-4 w-4"/> 核心要素</h3>
                                    <p className="text-sm"><strong>主角:</strong> {theme.structure.elements.protagonist}</p>
                                    <p className="text-sm"><strong>冲突:</strong> {theme.structure.elements.conflict}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4"/> 认知目标</h3>
                                    <p className="text-sm text-muted-foreground">{theme.structure.cognition.goal}</p>
                                </div>
                             </div>
                             
                             <div className="border-t pt-4">
                                <h3 className="font-semibold mb-4">叙事阶段</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {theme.structure.stages.map((stage, i) => (
                                        <div key={i} className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                                            <div className="font-bold">{stage.name}</div>
                                            <div className="text-sm text-muted-foreground mt-1">{stage.desc}</div>
                                            <div className="text-xs mt-2 text-right">{stage.duration} min</div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="configuration" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2">空间布局</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li><strong>类型:</strong> {theme.configuration.layout.type}</li>
                                        <li><strong>面积:</strong> {theme.configuration.layout.area} ㎡</li>
                                        <li><strong>视觉焦点:</strong> {theme.configuration.layout.focus.join('; ')}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">内容载体</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {theme.content.carriers.interactive.map((i, idx) => (
                                            <Badge key={idx} variant="secondary">{i.func} ({i.interface})</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="experience" className="mt-4">
                         <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4"/> 情感体验</h3>
                                    <div className="p-3 bg-pink-50 text-pink-900 rounded text-sm mb-2">
                                        <strong>情感路径:</strong> {theme.experience.emotion.path}
                                    </div>
                                    <p className="text-sm"><strong>记忆点:</strong> {theme.experience.design.memory.join('; ')}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">参与深度</h3>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between"><span>个人参与</span> <span>{'★'.repeat(theme.experience.participation.individual)}</span></div>
                                        <div className="flex justify-between"><span>小组参与</span> <span>{'★'.repeat(theme.experience.participation.group)}</span></div>
                                        <div className="flex justify-between"><span>家庭参与</span> <span>{'★'.repeat(theme.experience.participation.family)}</span></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="evaluation" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-2xl font-bold">{theme.evaluation.indicators.satisfaction}</div>
                                    <div className="text-xs text-muted-foreground">满意度</div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-2xl font-bold">{theme.evaluation.indicators.understanding}</div>
                                    <div className="text-xs text-muted-foreground">理解度</div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-2xl font-bold">{theme.evaluation.indicators.duration}m</div>
                                    <div className="text-xs text-muted-foreground">停留时长</div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-2xl font-bold">{theme.evaluation.status.count}</div>
                                    <div className="text-xs text-muted-foreground">验证次数</div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">成功经验</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {theme.evaluation.iteration.success.map(s => <li key={s}>{s}</li>)}
                                </ul>
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
