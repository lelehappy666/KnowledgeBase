import { Navbar } from "@/components/layout/navbar";
import { SciencePrincipleForm } from "@/components/content/science-principle-form";
import { getSciencePrincipleById } from "@/lib/content-system";
import { notFound } from "next/navigation";

export default async function EditSciencePrinciplePage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const principle = await getSciencePrincipleById(id);

  if (!principle) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">编辑科学原理</h1>
            <p className="text-muted-foreground mt-2">修改科学原理信息。</p>
        </div>
        <SciencePrincipleForm initialData={principle} isEditing />
      </div>
    </div>
  );
}
