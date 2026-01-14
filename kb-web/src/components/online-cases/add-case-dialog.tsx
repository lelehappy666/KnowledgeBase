"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Globe, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type Step = "SELECT_PLATFORM" | "INPUT_URL" | "PREVIEW";
type Platform = "MANA" | "BEHANCE" | "YOUTUBE" | "XIAOHONGSHU";

  interface ParsedData {
    title: string;
    description: string;
    coverImage: string;
    content: string;
    platform: Platform;
    sourceUrl: string;
    images?: string[];
  }

const PLATFORMS: { id: Platform; name: string; icon: any; enabled: boolean }[] = [
  { id: "MANA", name: "Mana", icon: Globe, enabled: true },
  { id: "BEHANCE", name: "Behance", icon: Globe, enabled: true },
  { id: "YOUTUBE", name: "YouTube", icon: Globe, enabled: false },
  { id: "XIAOHONGSHU", name: "小红书", icon: Globe, enabled: false },
];

export function AddOnlineCaseDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("SELECT_PLATFORM");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [url, setUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const resetState = () => {
    setStep("SELECT_PLATFORM");
    setSelectedPlatform(null);
    setUrl("");
    setParsedData(null);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) resetState();
  };

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setStep("INPUT_URL");
  };

  const handleParse = async () => {
    if (!url) return;
    setIsParsing(true);
    try {
      const res = await fetch("/api/online-cases/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform: selectedPlatform }),
      });

      if (!res.ok) throw new Error("Parsing failed");

      const data = await res.json();
      setParsedData(data);
      setStep("PREVIEW");
    } catch (error) {
      toast.error("解析失败，请检查网址是否正确");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    if (!parsedData) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/online-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("案例已添加");
      setOpen(false);
      window.location.reload(); // Simple reload for now, ideally use SWR/React Query invalidation
    } catch (error) {
      toast.error("保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          快速增加在线案例
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {step === "SELECT_PLATFORM" && "选择来源平台"}
            {step === "INPUT_URL" && `输入 ${selectedPlatform} 网址`}
            {step === "PREVIEW" && "确认案例信息"}
          </DialogTitle>
          <DialogDescription>
            {step === "SELECT_PLATFORM" && "请选择你要采集案例的来源网站"}
            {step === "INPUT_URL" && "输入目标页面的网址，系统将自动解析内容"}
            {step === "PREVIEW" && "解析成功，请确认信息无误后保存"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex-1 overflow-y-auto px-1">
          {step === "SELECT_PLATFORM" && (
            <div className="grid grid-cols-2 gap-4">
              {PLATFORMS.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  disabled={!p.enabled}
                  onClick={() => handlePlatformSelect(p.id)}
                >
                  <p.icon className="h-8 w-8" />
                  {p.name}
                </Button>
              ))}
            </div>
          )}

          {step === "INPUT_URL" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>网址 URL</Label>
                <Input
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === "PREVIEW" && parsedData && (
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                {parsedData.coverImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={parsedData.coverImage}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    无封面图
                  </div>
                )}
              </div>

              {/* Candidate Images Selection (Behance) */}
              {parsedData.images && parsedData.images.length > 1 && (
                  <div className="space-y-2">
                      <Label>选择封面图 (点击切换)</Label>
                      <div className="grid grid-cols-4 gap-2 max-h-[120px] overflow-y-auto p-1 border rounded-md">
                          {parsedData.images.map((img, idx) => (
                              <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setParsedData({ ...parsedData, coverImage: img })}
                                  className={`relative aspect-video rounded overflow-hidden border-2 ${parsedData.coverImage === img ? 'border-primary' : 'border-transparent'}`}
                              >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={img} alt={`Candidate ${idx}`} className="w-full h-full object-cover" />
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              <div className="space-y-2">
                <Label>标题</Label>
                <Input
                  value={parsedData.title}
                  onChange={(e) =>
                    setParsedData({ ...parsedData, title: e.target.value })
                  }
                />
              </div>


              <div className="space-y-2">
                <Label>描述 (列表预览)</Label>
                <Input
                  value={parsedData.description}
                  onChange={(e) =>
                    setParsedData({ ...parsedData, description: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">仅用于列表卡片展示，完整内容请在下方查看。</p>
              </div>

              <div className="space-y-2">
                <Label>完整详情内容</Label>
                <Textarea
                  className="min-h-[200px]"
                  value={(() => {
                    try {
                        const c = JSON.parse(parsedData.content || "{}");
                        return c.rawDescription || "";
                    } catch { return ""; }
                  })()}
                  readOnly
                  disabled
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
            {step !== "SELECT_PLATFORM" && (
                 <Button variant="ghost" onClick={() => setStep(step === "PREVIEW" ? "INPUT_URL" : "SELECT_PLATFORM")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    上一步
                 </Button>
            )}
            <div className="flex gap-2">
                {step === "INPUT_URL" && (
                    <Button onClick={handleParse} disabled={!url || isParsing}>
                    {isParsing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    解析网址
                    </Button>
                )}
                {step === "PREVIEW" && (
                    <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    保存案例
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
