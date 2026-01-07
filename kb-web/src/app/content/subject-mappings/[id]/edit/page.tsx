import { Navbar } from "@/components/layout/navbar";
import { SubjectMappingForm } from "@/components/content/subject-mapping-form";
import { getSubjectMappingById } from "@/lib/content-system";
import { notFound } from "next/navigation";

export default async function EditSubjectMappingPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const mapping = await getSubjectMappingById(id);

  if (!mapping) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">编辑学科对照</h1>
            <p className="text-muted-foreground mt-2">修改展项与学科关联信息。</p>
        </div>
        <SubjectMappingForm initialData={mapping} isEditing />
      </div>
    </div>
  );
}
