import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ArrowRight } from "lucide-react";
import { getAllTrends } from "@/lib/trend-system";

export const dynamic = 'force-dynamic';

export default async function TrendsPage() {
  const trends = await getAllTrends();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">展项趋势洞察库</h1>
                <p className="text-muted-foreground mt-2">探索 {trends.length} 个前沿趋势。</p>
            </div>
            <Button asChild>
                <Link href="/admin/trends/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    新建趋势
                </Link>
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trends.map((trend) => (
                <Link key={trend.id} href={`/cognitive/trends/${trend.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant={
                                    trend.attributes.intensity === 'Emerging' ? 'secondary' : 
                                    trend.attributes.intensity === 'Growing' ? 'default' : 'outline'
                                }>
                                    {trend.attributes.intensity === 'Emerging' ? '萌芽期' : 
                                     trend.attributes.intensity === 'Growing' ? '成长期' : 
                                     trend.attributes.intensity === 'Mature' ? '成熟期' : '衰退期'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{trend.basic.discoveryDate}</span>
                            </div>
                            <CardTitle className="mt-2">{trend.basic.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {trend.content.description || "暂无描述"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {trend.basic.aliases?.map(alias => (
                                    <Badge key={alias} variant="outline" className="text-xs">{alias}</Badge>
                                ))}
                            </div>
                            <div className="flex items-center text-sm text-primary font-medium">
                                查看详情 <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            {trends.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                    暂无趋势数据，请先创建。
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
