import { Navbar } from "@/components/layout/navbar";
import { ExhibitForm } from "@/components/admin/exhibit-form";

export default function CreateExhibitPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">新建展品</h1>
            <p className="text-muted-foreground mt-2">录入新的展品信息，包括描述、多媒体资源及评估数据。</p>
        </div>
        <ExhibitForm />
      </div>
    </div>
  );
}
