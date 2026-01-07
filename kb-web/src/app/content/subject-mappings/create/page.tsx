import { Navbar } from "@/components/layout/navbar";
import { SubjectMappingForm } from "@/components/content/subject-mapping-form";
import { SubjectMappingImportDialog } from "@/components/content/subject-mapping-import-dialog";

export default function CreateSubjectMappingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">新建学科对照</h1>
                <p className="text-muted-foreground mt-2">建立新的展项与学科知识关联。</p>
            </div>
            <SubjectMappingImportDialog />
        </div>
        <SubjectMappingForm />
      </div>
    </div>
  );
}
