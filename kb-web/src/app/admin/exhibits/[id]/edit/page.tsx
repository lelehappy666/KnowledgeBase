import { Navbar } from "@/components/layout/navbar";
import { ExhibitForm } from "@/components/admin/exhibit-form";
import { getExhibitById } from "@/lib/doc-system";
import { notFound } from "next/navigation";

export default async function EditExhibitPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  
  const exhibit = await getExhibitById(id);

  if (!exhibit) {
    notFound();
  }

  // 转换数据格式以适配 Form (metadata 已经是对象，不需要 parse，但 form 可能期望 string? 不，form 内部判断了)
  // Form 中的 metadata state 初始化逻辑: JSON.parse(initialData.metadata)
  // 但我们的 FS 数据 metadata 是对象。
  // 所以我们需要把它转回 string，或者修改 Form 组件。
  // 为了最小改动，我们在传给 Form 之前把 metadata 转为 string
  
  const exhibitForForm = {
      ...exhibit,
      metadata: JSON.stringify(exhibit.metadata)
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">编辑展品</h1>
            <p className="text-muted-foreground mt-2">修改展品信息。</p>
        </div>
        <ExhibitForm initialData={exhibitForForm} isEditing />
      </div>
    </div>
  );
}
