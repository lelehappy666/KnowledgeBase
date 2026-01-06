import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">分类管理</h1>
                <p className="text-muted-foreground mt-2">维护学科、交互方式等标签体系。</p>
            </div>
            <Button variant="outline" asChild>
                <Link href="/admin">返回后台</Link>
            </Button>
        </div>

        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>预设分类体系</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium mb-3">交互方式 (Interaction)</h4>
                            <div className="flex flex-wrap gap-2">
                                {['触摸屏', '体感交互', 'VR/AR', '机械互动', '全息投影', '语音控制'].map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                                <Button variant="ghost" size="sm" className="h-6 text-xs border border-dashed">+ 添加</Button>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-3">学科领域 (Subject)</h4>
                            <div className="flex flex-wrap gap-2">
                                {['物理', '化学', '生物', '天文', '地理', '数学', '工程技术'].map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                                <Button variant="ghost" size="sm" className="h-6 text-xs border border-dashed">+ 添加</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                    <h4 className="text-sm font-medium text-yellow-800">功能开发中</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                        当前版本仅展示预设分类，完整的 CRUD 功能将在下一版本更新。
                        <br/>
                        目前您可以在编辑展品时直接手动输入标签。
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
