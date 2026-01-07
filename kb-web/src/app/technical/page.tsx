import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu, Box, Coins } from "lucide-react";

export default function TechnicalEngineeringHub() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight">展品技术与工程知识库</h1>
            <p className="text-muted-foreground mt-2">
              包含技术可行性、可复用模块及成本数据三大核心模块。
            </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            <Link href="/technical/feasibility">
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                            <Cpu className="h-6 w-6 text-blue-700" />
                        </div>
                        <CardTitle>技术可行性数据库</CardTitle>
                        <CardDescription>Technical Feasibility Database</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            评估展项技术方案的成熟度、风险、稳定性及实施要求。
                        </p>
                    </CardContent>
                </Card>
            </Link>

            <Link href="#">
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group opacity-60">
                    <CardHeader>
                        <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                            <Box className="h-6 w-6 text-indigo-700" />
                        </div>
                        <CardTitle>可复用技术模块库</CardTitle>
                        <CardDescription>Reusable Module Library</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            标准化的软硬件功能模块与接口定义。（开发中）
                        </p>
                    </CardContent>
                </Card>
            </Link>

            <Link href="#">
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group opacity-60">
                    <CardHeader>
                        <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                            <Coins className="h-6 w-6 text-amber-700" />
                        </div>
                        <CardTitle>成本数据库</CardTitle>
                        <CardDescription>Cost Database</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            基于历史数据的多维度成本估算与参考。（开发中）
                        </p>
                    </CardContent>
                </Card>
            </Link>
        </div>
      </div>
    </div>
  );
}
