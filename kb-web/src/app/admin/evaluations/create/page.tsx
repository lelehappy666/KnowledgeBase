import { Navbar } from "@/components/layout/navbar";
import { EvaluationForm } from "@/components/admin/evaluation-form";
import { EvaluationImportDialog } from "@/components/admin/evaluation-import-dialog";

export default function CreateEvaluationPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">新建评价</h1>
                <p className="text-muted-foreground mt-2">创建新的展项评价记录。</p>
            </div>
            <EvaluationImportDialog />
        </div>
        <EvaluationForm />
      </div>
    </div>
  );
}
