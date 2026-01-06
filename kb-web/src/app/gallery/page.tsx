import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Box, Search, SlidersHorizontal } from "lucide-react";
import { getAllExhibits } from "@/lib/doc-system";

export const dynamic = 'force-dynamic';

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q || "";
  
  // Read from File System
  const allExhibits = await getAllExhibits();

  // Filter in memory
  const exhibits = allExhibits.filter(exhibit => {
      // 排除已归档
      if (exhibit.status === 'archived') return false;
      
      // 搜索过滤
      if (!query) return true;
      const q = query.toLowerCase();
      return (
          exhibit.title.toLowerCase().includes(q) ||
          (exhibit.description && exhibit.description.toLowerCase().includes(q))
      );
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">浏览展品</h1>
                <p className="text-muted-foreground mt-2">发现创意与灵感，探索 {exhibits.length} 个展项案例。</p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="搜索展品..." 
                        className="pl-8" 
                        defaultValue={query}
                    />
                </div>
                <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exhibits.map((exhibit) => {
                const metadata = exhibit.metadata || {};
                const coverImage = exhibit.assets.find(a => a.type === 'IMAGE');
                const costRange = metadata.cost?.range;

                // 需要对 title 和 filename 进行 encode，防止 URL 问题
                const coverUrl = coverImage 
                    ? `/api/doc/${encodeURIComponent(exhibit.title)}/${encodeURIComponent(coverImage.path)}`
                    : null;

                return (
                    <Link key={exhibit.id} href={`/gallery/${exhibit.id}`} className="group block h-full">
                        <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 flex flex-col">
                            <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                                {coverUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={coverUrl} 
                                        alt={exhibit.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-muted/80 to-muted/20 flex items-center justify-center text-muted-foreground/30">
                                        <Box className="h-12 w-12" />
                                    </div>
                                )}
                                {exhibit.status === 'draft' && (
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">草稿</Badge>
                                    </div>
                                )}
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex gap-2">
                                        {metadata.trends?.tags?.split(',')[0] && (
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                                {metadata.trends.tags.split(',')[0]}
                                            </Badge>
                                        )}
                                    </div>
                                    {costRange && (
                                        <span className="text-xs font-mono text-muted-foreground">¥{costRange}万</span>
                                    )}
                                </div>
                                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {exhibit.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 mt-auto">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {exhibit.description || "暂无描述"}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>

        {exhibits.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Box className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold">暂无展品</h3>
                <p className="text-muted-foreground">尝试调整搜索关键词，或在后台添加新展品。</p>
            </div>
        )}
      </main>
    </div>
  );
}
