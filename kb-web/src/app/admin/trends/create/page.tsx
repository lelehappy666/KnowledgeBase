import { Navbar } from "@/components/layout/navbar";
import { TrendForm } from "@/components/admin/trend-form";
import { TrendImportDialog } from "@/components/admin/trend-import-dialog";

export default function CreateTrendPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">新建趋势</h1>
                <p className="text-muted-foreground mt-2">录入新的行业趋势数据。</p>
            </div>
            <TrendImportDialog />
        </div>
        <TrendForm />
      </div>
    </div>
  );
}
