import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { getTrendById } from "@/lib/trend-system";
import { notFound } from "next/navigation";
import { DeleteTrendButton } from "@/components/admin/delete-trend-button";

export default async function TrendDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const trend = await getTrendById(id);

  if (!trend) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" className="pl-0 hover:bg-transparent" asChild>
                <Link href="/cognitive/trends" className="flex items-center text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    返回列表
                </Link>
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href={`/admin/trends/${trend.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                    </Link>
                </Button>
                <DeleteTrendButton id={trend.id} name={trend.basic.name} />
            </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">{trend.basic.name}</h1>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {trend.basic.aliases?.map(alias => (
                            <Badge key={alias} variant="secondary">{alias}</Badge>
                        ))}
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {trend.content.description}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>核心特性</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {trend.content.features?.map((feature, i) => (
                                <Badge key={i} variant="outline" className="px-3 py-1 text-sm">{feature}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>驱动因素</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {trend.content.drivers?.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>制约因素</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {trend.content.constraints?.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>影响分析</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <span className="font-semibold text-muted-foreground">设计影响</span>
                            <span>{trend.impact.design || '-'}</span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <span className="font-semibold text-muted-foreground">技术影响</span>
                            <span>{trend.impact.technology || '-'}</span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <span className="font-semibold text-muted-foreground">成本影响</span>
                            <span>{trend.impact.cost || '-'}</span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <span className="font-semibold text-muted-foreground">用户影响</span>
                            <span>{trend.impact.user || '-'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>关键指标</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">发现时间</span>
                            <span className="font-medium">{trend.basic.discoveryDate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">当前阶段</span>
                            <Badge>{trend.attributes.intensity}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">可信度</span>
                            <span className="font-medium">{trend.attributes.credibility}</span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold">{trend.data.marketShare}%</div>
                                <div className="text-xs text-muted-foreground">市场占比</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{trend.data.growthRate}%</div>
                                <div className="text-xs text-muted-foreground">年增长率</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>应用建议</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm font-medium mb-2">适用场景</div>
                            <div className="flex flex-wrap gap-2">
                                {trend.application.scenarios?.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium mb-1">实施建议</div>
                            <p className="text-sm text-muted-foreground">{trend.application.suggestions || '-'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
