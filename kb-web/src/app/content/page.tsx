import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Atom, BookOpen, ScrollText } from "lucide-react";

export default function ContentLibraryHub() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight">展项内容知识库</h1>
            <p className="text-muted-foreground mt-2">
              包含科学原理、学科对照及叙事主题三大核心模块。
            </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            <Link href="/content/science-principles">
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                            <Atom className="h-6 w-6 text-blue-700" />
                        </div>
                        <CardTitle>科学原理库</CardTitle>
                        <CardDescription>Science Principles Library</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            沉淀核心科学原理，关联教育课标、跨学科应用及展项设计策略。
                        </p>
                    </CardContent>
                </Card>
            </Link>

            <Link href="/content/subject-mappings">
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                            <BookOpen className="h-6 w-6 text-green-700" />
                        </div>
                        <CardTitle>学科对照库</CardTitle>
                        <CardDescription>Subject Mapping Library</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            展项与学科、学段的矩阵对照关系库。
                        </p>
                    </CardContent>
                </Card>
            </Link>

            <Link href="/content/narrative-themes">
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                            <ScrollText className="h-6 w-6 text-purple-700" />
                        </div>
                        <CardTitle>叙事与主题库</CardTitle>
                        <CardDescription>Narrative & Theme Library</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            沉淀常用的策展主题、叙事逻辑与故事线模版。
                        </p>
                    </CardContent>
                </Card>
            </Link>
        </div>
      </div>
    </div>
  );
}
