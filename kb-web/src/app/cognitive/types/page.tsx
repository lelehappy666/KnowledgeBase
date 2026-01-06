import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ArrowRight, Star } from "lucide-react";
import { getAllTypes } from "@/lib/type-system";

export const dynamic = 'force-dynamic';

export default async function TypesPage() {
  const types = await getAllTypes();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">展项类型体系</h1>
                <p className="text-muted-foreground mt-2">标准化展项分类 ({types.length})。</p>
            </div>
            <Button asChild>
                <Link href="/admin/types/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    新建类型
                </Link>
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {types.map((item) => (
                <Link key={item.id} href={`/cognitive/types/${item.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="outline">{item.definition.code}</Badge>
                                <div className="flex items-center text-amber-500">
                                    {Array.from({length: Math.min(5, Math.max(0, item.technical.difficulty))}).map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-current" />
                                    ))}
                                </div>
                            </div>
                            <CardTitle className="mt-2">{item.definition.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                适用: {item.classification.experienceType.join(', ')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {item.classification.interactionMethod?.slice(0, 3).map(m => (
                                    <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                                ))}
                                {item.classification.interactionMethod?.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">...</Badge>
                                )}
                            </div>
                            <div className="flex items-center text-sm text-primary font-medium">
                                查看详情 <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            {types.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                    暂无类型数据，请先创建。
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
