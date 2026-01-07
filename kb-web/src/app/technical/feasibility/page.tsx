import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Cpu, ShieldCheck, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { getAllTechnicalFeasibilities } from "@/lib/technical-system";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function TechnicalFeasibilityPage() {
  const items = await getAllTechnicalFeasibilities();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">技术可行性数据库</h1>
            <p className="text-muted-foreground mt-2">
              评估展项技术的成熟度、稳定性、安全性及实施成本。
            </p>
          </div>
          <div className="flex items-center gap-2">
             <Link href="/technical/feasibility/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                新建方案
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/technical/feasibility/${item.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-t-4 border-t-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-xl">{item.name}</CardTitle>
                        <CardDescription>{item.basic.id}</CardDescription>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <Cpu className="h-5 w-5 text-blue-700" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">成熟度 (TRL)</span>
                        <Badge variant={item.analysis.maturity.trl >= 8 ? 'default' : 'secondary'}>
                            Level {item.analysis.maturity.trl}
                        </Badge>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">风险等级</span>
                        <Badge variant={item.analysis.riskLevel === 'Low' ? 'outline' : 'destructive'} className={item.analysis.riskLevel === 'Low' ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                            {item.analysis.riskLevel}
                        </Badge>
                     </div>
                     <div className="text-xs text-muted-foreground pt-2 border-t line-clamp-2">
                        {item.basic.description}
                     </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {items.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              暂无技术方案，请点击右上角新建。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
