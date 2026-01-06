import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Share2, Box, Info } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Exhibit3DViewer } from "@/components/exhibit/3d-viewer";
import { getExhibitById } from "@/lib/doc-system";

export default async function ExhibitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  
  const exhibit = await getExhibitById(id);

  if (!exhibit) {
    notFound();
  }

  const metadata = exhibit.metadata || {};
  const images = exhibit.assets.filter(a => a.type === 'IMAGE');
  const model3d = exhibit.assets.find(a => a.type === 'MODEL_3D');
  const videos = exhibit.assets.filter(a => a.type === 'VIDEO');

  // Helper to get asset URL
  const getAssetUrl = (path: string) => `/api/doc/${encodeURIComponent(exhibit.title)}/${encodeURIComponent(path)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-6">
            <Button variant="ghost" className="pl-0 hover:bg-transparent" asChild>
                <Link href="/gallery" className="flex items-center text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    返回列表
                </Link>
            </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Media */}
            <div className="lg:col-span-2 space-y-6">
                {model3d ? (
                    <Exhibit3DViewer url={getAssetUrl(model3d.path)} />
                ) : images.length > 0 ? (
                    <div className="rounded-xl overflow-hidden border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={getAssetUrl(images[0].path)} 
                            alt={exhibit.title} 
                            className="w-full h-auto max-h-[600px] object-contain"
                        />
                    </div>
                ) : (
                    <div className="aspect-video bg-muted rounded-xl flex items-center justify-center flex-col text-muted-foreground">
                        <Box className="h-16 w-16 mb-4 opacity-50" />
                        <p>暂无预览媒体</p>
                    </div>
                )}

                {/* Thumbnails / Additional Media */}
                {(images.length > 1 || videos.length > 0) && (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {images.map(img => (
                            <div key={img.id} className="h-20 w-20 flex-shrink-0 rounded-lg border overflow-hidden bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={getAssetUrl(img.path)} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Info */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{exhibit.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {exhibit.status === 'draft' && <Badge variant="secondary">草稿</Badge>}
                        {metadata.trends?.tags?.split(',').map((tag: string) => (
                             <Badge key={tag} variant="outline">{tag.trim()}</Badge>
                        ))}
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {exhibit.description}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">预估成本</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold">¥{metadata.cost?.range || ' -'}万</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">综合评分</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold text-primary">{metadata.evaluation?.score || 0}/5</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex gap-4">
                    <Button className="flex-1 shadow-lg shadow-primary/20">
                        <Download className="mr-2 h-4 w-4" /> 下载方案
                    </Button>
                    <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>

                <Card className="bg-muted/30 border-none">
                    <CardContent className="p-4 flex gap-3 text-sm text-muted-foreground">
                        <Info className="h-5 w-5 flex-shrink-0 text-primary" />
                        <p>该展项包含详细的工程图纸与BOM清单，如需实施请联系工程部评估场地条件。</p>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Bottom: Detailed Content */}
        <div className="mt-12 max-w-4xl">
            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details">详细介绍</TabsTrigger>
                    <TabsTrigger value="engineering">工程技术 (C)</TabsTrigger>
                    <TabsTrigger value="principles">科学原理 (B)</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-6 prose dark:prose-invert max-w-none">
                    {/* Render Markdown Content here - using simple div for now */}
                    <div className="whitespace-pre-wrap font-sans text-foreground/80 leading-7">
                        {exhibit.content || "暂无详细内容"}
                    </div>
                </TabsContent>
                <TabsContent value="engineering" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4">工程风险与要求</h3>
                            <div className="text-muted-foreground">
                                {metadata.engineering?.notes || "暂无工程备注"}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="principles" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4">关联科学原理</h3>
                            <div className="text-muted-foreground">
                                {metadata.principles?.notes || "暂无原理说明"}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </main>
    </div>
  );
}
