import { Navbar } from "@/components/layout/navbar";
import { EvaluationForm } from "@/components/admin/evaluation-form";
import { getEvaluationById } from "@/lib/evaluation-system";
import { notFound } from "next/navigation";

export default async function EditEvaluationPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const evaluation = await getEvaluationById(id);

  if (!evaluation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">编辑评价</h1>
            <p className="text-muted-foreground mt-2">修改展项评价记录。</p>
        </div>
        <EvaluationForm initialData={evaluation} isEditing />
      </div>
    </div>
  );
}
