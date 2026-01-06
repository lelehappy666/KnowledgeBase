import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Box, Layers, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40 bg-gradient-to-b from-background to-muted/20">
          <div className="container px-4 md:px-8 relative z-10">
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium rounded-full border-primary/20 text-primary bg-primary/10 mb-4">
                v1.0 内部预览版
              </Badge>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                探索无尽的<br className="md:hidden" />
                <span className="text-primary">展品创意与知识</span>
              </h1>
              <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl font-light mt-4">
                沉淀公司的展品设计、工程实现与科学原理。
                <br className="hidden sm:inline" />
                从灵感到落地的全链路知识库。
              </p>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center mt-8">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20" asChild>
                  <Link href="/gallery">
                    开始探索 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full" asChild>
                  <Link href="/categories">
                    浏览分类
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl opacity-50" />
          <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl opacity-30" />
        </section>

        {/* Features Grid */}
        <section className="container px-4 md:px-8 py-16 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="趋势洞察 (A)"
              description="紧跟全球展项趋势，分析新技术应用与行业风格演变。"
            />
            <FeatureCard 
              icon={<Layers className="h-10 w-10 text-blue-500" />}
              title="内容矩阵 (B)"
              description="基于科学原理与学段的展项内容矩阵，服务策展与教育。"
            />
            <FeatureCard 
              icon={<Box className="h-10 w-10 text-orange-500" />}
              title="工程技术 (C)"
              description="详细的BOM成本、技术风险评估与可复用模块库。"
            />
          </div>
        </section>

        {/* Featured Exhibits (Mock) */}
        <section className="container px-4 md:px-8 py-16 border-t">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">精选展品</h2>
            <Link href="/gallery" className="text-primary hover:underline font-medium">查看全部</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card/50">
                <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                   {/* Placeholder for Image */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-muted/80 to-muted/20 flex items-center justify-center text-muted-foreground/30">
                     <Box className="h-12 w-12" />
                   </div>
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between mb-2">
                     <Badge variant="outline" className="text-xs">交互展项</Badge>
                     <span className="text-xs text-muted-foreground">¥10-30万</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">全息光影互动台 #{i}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    通过全息投影技术展示文物细节，支持手势交互旋转缩放。
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="border-t py-12 bg-muted/30">
        <div className="container px-4 md:px-8 text-center text-muted-foreground text-sm">
          <p>© 2026 展品知识库 (Internal). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start space-y-4 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all">
      <div className="p-3 rounded-xl bg-background shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
