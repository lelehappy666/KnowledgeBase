import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddOnlineCaseDialog } from "@/components/online-cases/add-case-dialog";
import { OnlineCaseList } from "@/components/online-cases/online-case-list";
import { Navbar } from "@/components/layout/navbar";

export default function OnlineCasesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">在线案例库</h1>
            <p className="text-muted-foreground mt-2">
              收集和整理来自 Mana, Behance, YouTube, 小红书 等平台的优秀案例。
            </p>
          </div>
          <AddOnlineCaseDialog />
        </div>

        <OnlineCaseList />
      </div>
    </div>
  );
}
