import { Navbar } from "@/components/layout/navbar";
import { TypeForm } from "@/components/admin/type-form";
import { getTypeById } from "@/lib/type-system";
import { notFound } from "next/navigation";

export default async function EditTypePage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const typeItem = await getTypeById(id);

  if (!typeItem) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">编辑类型</h1>
            <p className="text-muted-foreground mt-2">修改展项类型定义。</p>
        </div>
        <TypeForm initialData={typeItem} isEditing />
      </div>
    </div>
  );
}
