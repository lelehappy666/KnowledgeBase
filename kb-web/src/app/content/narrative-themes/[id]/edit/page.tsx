import { Navbar } from "@/components/layout/navbar";
import { NarrativeThemeForm } from "@/components/content/narrative-theme-form";
import { getNarrativeThemeById } from "@/lib/content-system";
import { notFound } from "next/navigation";

export default async function EditNarrativeThemePage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const theme = await getNarrativeThemeById(id);

  if (!theme) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">编辑叙事主题</h1>
            <p className="text-muted-foreground mt-2">修改主题定义与叙事设计。</p>
        </div>
        <NarrativeThemeForm initialData={theme} isEditing />
      </div>
    </div>
  );
}
