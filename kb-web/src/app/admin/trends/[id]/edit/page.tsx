import { Navbar } from "@/components/layout/navbar";
import { TrendForm } from "@/components/admin/trend-form";
import { getTrendById } from "@/lib/trend-system";
import { notFound } from "next/navigation";

export default async function EditTrendPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const trend = await getTrendById(id);

  if (!trend) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">编辑趋势</h1>
            <p className="text-muted-foreground mt-2">修改趋势数据。</p>
        </div>
        <TrendForm initialData={trend} isEditing />
      </div>
    </div>
  );
}
