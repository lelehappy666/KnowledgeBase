import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, ScrollText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { getAllNarrativeThemes } from "@/lib/content-system";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function NarrativeThemesPage() {
  const themes = await getAllNarrativeThemes();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">叙事与主题库</h1>
            <p className="text-muted-foreground mt-2">
              沉淀策展主题、叙事框架与故事线模版。
            </p>
          </div>
          <div className="flex items-center gap-2">
             <Link href="/content/narrative-themes/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                新建主题
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <Link key={theme.id} href={`/content/narrative-themes/${theme.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-xl">{theme.name}</CardTitle>
                        <CardDescription>{theme.basic.id}</CardDescription>
                    </div>
                    <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center">
                        <ScrollText className="h-5 w-5 text-purple-700" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                     <p className="text-sm text-muted-foreground line-clamp-2">{theme.basic.abstract}</p>
                     <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{theme.basic.attributes.type}</Badge>
                        <Badge variant="outline">{theme.structure.framework.type}</Badge>
                     </div>
                     <div className="text-xs text-muted-foreground pt-2 border-t">
                        <strong>核心冲突:</strong> {theme.structure.elements.conflict}
                     </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {themes.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              暂无叙事主题，请点击右上角新建。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
