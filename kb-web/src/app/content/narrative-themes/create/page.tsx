import { Navbar } from "@/components/layout/navbar";
import { NarrativeThemeForm } from "@/components/content/narrative-theme-form";
import { NarrativeThemeImportDialog } from "@/components/content/narrative-theme-import-dialog";

export default function CreateNarrativeThemePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">新建叙事主题</h1>
                <p className="text-muted-foreground mt-2">定义新的策展主题与叙事框架。</p>
            </div>
            <NarrativeThemeImportDialog />
        </div>
        <NarrativeThemeForm />
      </div>
    </div>
  );
}
