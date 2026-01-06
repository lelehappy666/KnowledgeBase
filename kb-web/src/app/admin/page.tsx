import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package, Users, Settings, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { getAllExhibits } from "@/lib/doc-system";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const allExhibits = await getAllExhibits();
  
  // Take 5 recent
  const exhibits = allExhibits.slice(0, 5);

  const totalCount = allExhibits.length;
  const draftCount = allExhibits.filter(e => e.status === 'draft').length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">管理后台</h1>
                <p className="text-muted-foreground mt-2">管理展品、分类与系统设置。</p>
            </div>
            <Button className="gap-2 shadow-lg shadow-primary/20" asChild>
                <Link href="/admin/exhibits/create">
                    <PlusCircle className="h-4 w-4" />
                    新建展品
                </Link>
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard title="总展品数" value={totalCount.toString()} icon={<Package className="h-4 w-4 text-muted-foreground" />} description="较上月 +2" />
            <StatsCard title="草稿箱" value={draftCount.toString()} icon={<FileText className="h-4 w-4 text-muted-foreground" />} description="待发布" />
            <StatsCard title="活跃用户" value="1" icon={<Users className="h-4 w-4 text-muted-foreground" />} description="管理员" />
            <StatsCard title="系统状态" value="正常" icon={<Settings className="h-4 w-4 text-muted-foreground" />} description="v1.0.0" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 shadow-sm">
                <CardHeader>
                    <CardTitle>最近编辑</CardTitle>
                    <CardDescription>最近修改的展品记录。</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {exhibits.map((exhibit) => (
                            <div key={exhibit.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{exhibit.title}</p>
                                        <p className="text-sm text-muted-foreground">最后编辑: {new Date(exhibit.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/admin/exhibits/${exhibit.id}/edit`}>编辑</Link>
                                </Button>
                            </div>
                        ))}
                        {exhibits.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">暂无展品，请先创建。</div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Card className="col-span-3 shadow-sm">
                 <CardHeader>
                    <CardTitle>快速操作</CardTitle>
                    <CardDescription>常用管理功能入口。</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button variant="outline" className="justify-start h-auto py-4 px-6" asChild>
                        <Link href="/admin/assets">
                            <div className="flex flex-col items-start gap-1">
                                <span className="font-semibold">上传素材</span>
                                <span className="text-xs text-muted-foreground">批量上传图片/视频/模型到 NAS</span>
                            </div>
                        </Link>
                    </Button>
                     <Button variant="outline" className="justify-start h-auto py-4 px-6" asChild>
                        <Link href="/admin/categories">
                            <div className="flex flex-col items-start gap-1">
                                <span className="font-semibold">分类管理</span>
                                <span className="text-xs text-muted-foreground">维护学科、交互方式等标签体系</span>
                            </div>
                        </Link>
                    </Button>
                     <Button variant="outline" className="justify-start h-auto py-4 px-6" asChild>
                        <Link href="/admin/logs">
                            <div className="flex flex-col items-start gap-1">
                                <span className="font-semibold">系统日志</span>
                                <span className="text-xs text-muted-foreground">查看操作记录与错误报告</span>
                            </div>
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}
