import { Navbar } from "@/components/layout/navbar";
import { TechnicalFeasibilityForm } from "@/components/technical/technical-feasibility-form";
import { TechnicalFeasibilityImportDialog } from "@/components/technical/technical-feasibility-import-dialog";

export default function CreateTechnicalFeasibilityPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">新建技术方案</h1>
                <p className="text-muted-foreground mt-2">录入新的技术可行性评估方案。</p>
            </div>
            <TechnicalFeasibilityImportDialog />
        </div>
        <TechnicalFeasibilityForm />
      </div>
    </div>
  );
}
