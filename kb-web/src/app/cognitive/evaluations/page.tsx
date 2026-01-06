import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ArrowRight, Star } from "lucide-react";
import { getAllEvaluations } from "@/lib/evaluation-system";

export const dynamic = 'force-dynamic';

export default async function EvaluationsPage() {
  const evaluations = await getAllEvaluations();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">展项评价体系</h1>
                <p className="text-muted-foreground mt-2">基于多维度的展项质量标准库 ({evaluations.length})。</p>
            </div>
            <Button asChild>
                <Link href="/admin/evaluations/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    新建评价
                </Link>
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {evaluations.map((item) => (
                <Link key={item.id} href={`/cognitive/evaluations/${item.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="outline">{item.target.type}</Badge>
                                <div className="flex items-center text-amber-500 font-bold">
                                    <Star className="w-4 h-4 fill-current mr-1" />
                                    {((item.scores.experience + item.scores.understanding + item.scores.scientific) / 3).toFixed(1)}
                                </div>
                            </div>
                            <CardTitle className="mt-2">{item.target.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {item.analysis.summary || '暂无总结'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {item.tags.slice(0, 3).map(t => (
                                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                                ))}
                                {item.tags.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">...</Badge>
                                )}
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{item.cost.range}</span>
                                <div className="flex items-center text-primary font-medium">
                                    查看详情 <ArrowRight className="ml-1 h-4 w-4" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            {evaluations.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                    暂无评价数据，请先创建。
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
