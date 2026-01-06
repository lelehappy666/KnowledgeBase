import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Layers, ClipboardCheck } from "lucide-react";

export default function CognitivePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">展品展项认知基础库</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                构建对展项的底层理解框架。在这里探索全球趋势、了解展项分类体系、以及查看展项评价标准。
            </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
            {/* Module A1: Trends */}
            <Link href="/cognitive/trends">
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-l-4 border-l-blue-500">
                    <CardHeader>
                        <Lightbulb className="h-8 w-8 text-blue-500 mb-2" />
                        <CardTitle>展项趋势洞察库</CardTitle>
                        <CardDescription>洞察行业前沿与未来方向。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>全球展项趋势更新</li>
                            <li>新技术应用 (AI, MR, etc.)</li>
                            <li>行业风格与体验趋势</li>
                        </ul>
                    </CardContent>
                </Card>
            </Link>

            {/* Module A2: Types */}
            <Link href="/cognitive/types">
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-l-4 border-l-green-500">
                    <CardHeader>
                        <Layers className="h-8 w-8 text-green-500 mb-2" />
                        <CardTitle>展项类型体系</CardTitle>
                        <CardDescription>标准化的展项分类与定义。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>交互/内容/体验分类</li>
                            <li>技术复杂度与成本评估</li>
                            <li>设计规范与评价标准</li>
                        </ul>
                    </CardContent>
                </Card>
            </Link>

            {/* Module A3: Evaluation */}
            <Link href="/cognitive/evaluations">
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-l-4 border-l-amber-500">
                    <CardHeader>
                        <ClipboardCheck className="h-8 w-8 text-amber-500 mb-2" />
                        <CardTitle>展项评价体系</CardTitle>
                        <CardDescription>案例评分与质量标准库。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>多维度评分 (体验, 科学性等)</li>
                            <li>优缺点深度分析</li>
                            <li>成本与可复制性评估</li>
                        </ul>
                    </CardContent>
                </Card>
            </Link>
        </div>
      </div>
    </div>
  );
}
