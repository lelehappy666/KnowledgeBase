import { Navbar } from "@/components/layout/navbar";
import { TypeForm } from "@/components/admin/type-form";
import { TypeImportDialog } from "@/components/admin/type-import-dialog";

export default function CreateTypePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">新建类型</h1>
                <p className="text-muted-foreground mt-2">定义新的展项类型。</p>
            </div>
            <TypeImportDialog />
        </div>
        <TypeForm />
      </div>
    </div>
  );
}
