import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, GitGraph, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { getAllSubjectMappings } from "@/lib/content-system";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function SubjectMappingsPage() {
  const mappings = await getAllSubjectMappings();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">学科对照库</h1>
            <p className="text-muted-foreground mt-2">
              管理展项与K12学科、学段及知识点的矩阵映射关系。
            </p>
          </div>
          <div className="flex items-center gap-2">
             <Link href="/content/subject-mappings/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                新建对照
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mappings.map((mapping) => (
            <Link key={mapping.id} href={`/content/subject-mappings/${mapping.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-xl">{mapping.name}</CardTitle>
                        <CardDescription>{mapping.basic.code}</CardDescription>
                    </div>
                    <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                        <GitGraph className="h-5 w-5 text-green-700" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                     <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                            {mapping.dimensions.subject.category}
                        </Badge>
                         <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-100">
                            {mapping.dimensions.grade.level}
                        </Badge>
                     </div>
                     <div className="text-sm text-muted-foreground line-clamp-2">
                        <strong>知识点:</strong> {mapping.knowledge.name}
                     </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        <strong>展项交互:</strong> {mapping.dimensions.exhibit.interaction.join(', ')}
                     </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {mappings.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              暂无学科对照数据，请点击右上角新建。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
