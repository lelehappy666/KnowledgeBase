import { Navbar } from "@/components/layout/navbar";
import { SciencePrincipleForm } from "@/components/content/science-principle-form";
import { SciencePrincipleImportDialog } from "@/components/content/science-principle-import-dialog";

export default function CreateSciencePrinciplePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">新建科学原理</h1>
                <p className="text-muted-foreground mt-2">录入新的科学原理信息。</p>
            </div>
            <SciencePrincipleImportDialog />
        </div>
        <SciencePrincipleForm />
      </div>
    </div>
  );
}
