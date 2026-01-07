import { Navbar } from "@/components/layout/navbar";
import { TechnicalFeasibilityForm } from "@/components/technical/technical-feasibility-form";
import { getTechnicalFeasibilityById } from "@/lib/technical-system";
import { notFound } from "next/navigation";

export default async function EditTechnicalFeasibilityPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const item = await getTechnicalFeasibilityById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">编辑技术方案</h1>
            <p className="text-muted-foreground mt-2">修改技术可行性评估信息。</p>
        </div>
        <TechnicalFeasibilityForm initialData={item} isEditing />
      </div>
    </div>
  );
}
