import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Atom, Microscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { getAllSciencePrinciples } from "@/lib/content-system";

export const dynamic = 'force-dynamic';

export default async function SciencePrinciplesPage() {
  const principles = await getAllSciencePrinciples();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">科学原理库</h1>
            <p className="text-muted-foreground mt-2">
              管理科学原理、教育关联及跨学科应用。
            </p>
          </div>
          <div className="flex items-center gap-2">
             <Link href="/content/science-principles/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                新建原理
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => (
            <Link key={principle.id} href={`/content/science-principles/${principle.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-xl">{principle.name}</CardTitle>
                        <CardDescription>{principle.basic.enName}</CardDescription>
                    </div>
                    {principle.basic.icon && (
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                            <Atom className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="line-clamp-2">{principle.basic.abstract}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {principle.classification.category}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                            {principle.classification.difficultyLevel}
                        </span>
                        {principle.education.gradeLevel.slice(0, 2).map(grade => (
                             <span key={grade} className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                                {grade}
                            </span>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {principles.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              暂无科学原理，请点击右上角新建或导入。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
