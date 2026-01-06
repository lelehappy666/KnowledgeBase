import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Star, ThumbsUp, ThumbsDown, Info } from "lucide-react";
import Link from "next/link";
import { getEvaluationById } from "@/lib/evaluation-system";
import { notFound } from "next/navigation";
import { DeleteEvaluationButton } from "@/components/admin/delete-evaluation-button";
import { Progress } from "@/components/ui/progress";

export default async function EvaluationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const item = await getEvaluationById(id);

  if (!item) {
    notFound();
  }

  const ScoreBar = ({ label, value }: { label: string, value: number }) => (
      <div className="space-y-1">
          <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span className="font-medium">{value} / 5</span>
          </div>
          <Progress value={value * 20} className="h-2" />
      </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" className="pl-0 hover:bg-transparent" asChild>
                <Link href="/cognitive/evaluations" className="flex items-center text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    返回列表
                </Link>
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href={`/admin/evaluations/${item.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                    </Link>
                </Button>
                <DeleteEvaluationButton id={item.id} name={item.target.name} />
            </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge>{item.target.type}</Badge>
                        {item.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{item.target.name}</h1>
                    {item.target.refId && <p className="text-sm text-muted-foreground">ID: {item.target.refId}</p>}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>综合分析</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                            <p className="font-medium italic">"{item.analysis.summary}"</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="flex items-center font-semibold text-green-600 mb-2">
                                    <ThumbsUp className="w-4 h-4 mr-2" /> 优点
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {item.analysis.pros.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="flex items-center font-semibold text-red-600 mb-2">
                                    <ThumbsDown className="w-4 h-4 mr-2" /> 缺点/痛点
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {item.analysis.cons.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>成本分析</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold">{item.cost.range}</div>
                            <Badge variant="secondary">{item.cost.currency}</Badge>
                        </div>
                        {item.cost.details && (
                            <>
                                <Separator />
                                <div className="text-muted-foreground text-sm">
                                    <Info className="w-4 h-4 inline mr-1" />
                                    {item.cost.details}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400 mr-2" />
                            评分详情
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ScoreBar label="体验性" value={item.scores.experience} />
                        <ScoreBar label="易理解性" value={item.scores.understanding} />
                        <ScoreBar label="科学性" value={item.scores.scientific} />
                        <ScoreBar label="可维护性" value={item.scores.maintainability} />
                        <ScoreBar label="创新度" value={item.scores.innovation} />
                        <ScoreBar label="可复制性" value={item.scores.replicability} />
                        
                        <Separator />
                        <div className="pt-2 text-center">
                            <span className="text-sm text-muted-foreground">综合评分</span>
                            <div className="text-3xl font-bold text-amber-500 mt-1">
                                {((item.scores.experience + item.scores.understanding + item.scores.scientific + item.scores.maintainability + item.scores.innovation + item.scores.replicability) / 6).toFixed(1)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
