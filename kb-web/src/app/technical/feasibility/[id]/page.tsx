import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { getTechnicalFeasibilityById } from "@/lib/technical-system";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash, Cpu, ShieldAlert, Activity, Ruler, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteTechnicalFeasibilityAction } from "@/app/actions/technical-feasibility";

export default async function TechnicalFeasibilityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const item = await getTechnicalFeasibilityById(id);

  if (!item) {
    notFound();
  }

  async function deleteAction() {
    'use server'
    await deleteTechnicalFeasibilityAction(id);
    redirect('/technical/feasibility');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/technical/feasibility">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Badge variant="outline">{item.basic.id}</Badge>
                        <Badge variant="secondary">{item.basic.category}</Badge>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <Link href={`/technical/feasibility/${id}/edit`}>
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
                <CardHeader><CardTitle>方案描述</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed mb-4">{item.basic.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {item.basic.keywords.map(k => <Badge key={k} variant="secondary">#{k}</Badge>)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>核心指标</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">成熟度 (TRL)</span>
                        <span className="font-bold">Level {item.analysis.maturity.trl}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">风险等级</span>
                        <Badge variant={item.analysis.riskLevel === 'Low' ? 'outline' : 'destructive'} className={item.analysis.riskLevel === 'Low' ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                            {item.analysis.riskLevel}
                        </Badge>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">来源</span>
                        <span className="font-medium">{item.basic.source}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">实施难度</span>
                        <span className="font-medium">{item.requirements.installation.difficulty}/5</span>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-3">
                <Tabs defaultValue="specs">
                    <TabsList>
                        <TabsTrigger value="specs">技术规格</TabsTrigger>
                        <TabsTrigger value="analysis">详细评估</TabsTrigger>
                        <TabsTrigger value="requirements">实施要求</TabsTrigger>
                        <TabsTrigger value="cost">成本分析</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="specs" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                             <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Ruler className="h-4 w-4"/> 物理参数</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li><strong>尺寸:</strong> {item.specs.dimensions}</li>
                                        <li><strong>重量:</strong> {item.specs.weight}</li>
                                        <li><strong>材质:</strong> {item.specs.materials.join(', ')}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Activity className="h-4 w-4"/> 运行参数</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li><strong>功耗:</strong> {item.specs.power}</li>
                                        <li><strong>网络:</strong> {item.specs.network}</li>
                                        <li><strong>软件:</strong> {item.specs.software}</li>
                                    </ul>
                                </div>
                             </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="analysis" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold mb-2">稳定性</h3>
                                    <p className="text-sm"><strong>MTBF:</strong> {item.analysis.stability.mtbf}</p>
                                    <p className="text-sm"><strong>维护周期:</strong> {item.analysis.stability.maintenanceCycle}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold mb-2">安全性</h3>
                                    <p className="text-sm"><strong>风险:</strong> {item.analysis.safety.risks.join('; ') || '无显著风险'}</p>
                                    <p className="text-sm"><strong>认证:</strong> {item.analysis.safety.certifications.join(', ') || '无'}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold mb-2">成熟度</h3>
                                    <p className="text-sm"><strong>状态:</strong> {item.analysis.maturity.status}</p>
                                    <p className="text-sm"><strong>案例数:</strong> {item.analysis.maturity.cases}+</p>
                                </div>
                            </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="requirements" className="mt-4">
                         <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2">环境要求</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li><strong>温度:</strong> {item.requirements.environment.temperature}</li>
                                        <li><strong>湿度:</strong> {item.requirements.environment.humidity}</li>
                                        <li><strong>光照:</strong> {item.requirements.environment.lighting}</li>
                                        <li><strong>噪音:</strong> {item.requirements.environment.noise}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">技能需求</h3>
                                    <p className="text-sm mb-2"><strong>开发:</strong> {item.requirements.skill.development.join(', ')}</p>
                                    <p className="text-sm"><strong>运维:</strong> {item.requirements.skill.operation.join(', ')}</p>
                                </div>
                            </div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="cost" className="mt-4">
                        <Card><CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-sm text-muted-foreground">硬件成本</div>
                                    <div className="text-lg font-bold">¥{item.cost.hardware.toLocaleString()}</div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-sm text-muted-foreground">软件成本</div>
                                    <div className="text-lg font-bold">¥{item.cost.software.toLocaleString()}</div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-sm text-muted-foreground">研发成本</div>
                                    <div className="text-lg font-bold">¥{item.cost.development.toLocaleString()}</div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-sm text-muted-foreground">实施部署</div>
                                    <div className="text-lg font-bold">¥{item.cost.deployment.toLocaleString()}</div>
                                </div>
                                <div className="p-4 bg-muted rounded">
                                    <div className="text-sm text-muted-foreground">年维护费</div>
                                    <div className="text-lg font-bold">¥{item.cost.maintenance.toLocaleString()}</div>
                                </div>
                                <div className="p-4 bg-primary/10 rounded border border-primary/20">
                                    <div className="text-sm text-primary font-medium">总计估算</div>
                                    <div className="text-xl font-bold text-primary">¥{item.cost.total.toLocaleString()}</div>
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
