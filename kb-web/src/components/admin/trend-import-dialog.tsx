'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FileJson, Loader2, AlertCircle, Copy, Check } from "lucide-react"
import { importTrendAction } from '@/app/actions/trend-import'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TrendImportDialog() {
    const [open, setOpen] = useState(false)
    const [jsonContent, setJsonContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isCopied, setIsCopied] = useState(false)
    const router = useRouter()

    const handleImport = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // 1. JSON Parse Validation
            let parsedData;
            try {
                parsedData = JSON.parse(jsonContent)
            } catch (e) {
                throw new Error("JSON 格式错误: 请检查语法")
            }

            // 2. Schema Validation (Simple)
            if (!parsedData || typeof parsedData !== 'object') {
                throw new Error("数据格式错误: 必须是 JSON 对象")
            }
            if (!parsedData.basic?.name) {
                throw new Error("缺少必填字段: basic.name")
            }

            // 3. Server Action
            const res = await importTrendAction(parsedData)
            if (res.error) {
                throw new Error(res.error)
            }

            toast.success("导入成功")
            setOpen(false)
            setJsonContent('')
            router.push('/cognitive/trends')
        } catch (e: any) {
            setError(e.message)
            toast.error("导入失败")
        } finally {
            setIsLoading(false)
        }
    }

    const exampleJson = {
        "basic": {
            "name": "示例趋势",
            "aliases": ["别名1", "别名2"],
            "discoveryDate": "2024-01-01",
            "maturityPeriod": { "start": "2025-01-01", "end": "2030-01-01" },
            "declineDate": "2035-01-01"
        },
        "attributes": {
            "type": "Technical",
            "intensity": "Growing",
            "scope": ["国内", "行业"],
            "credibility": "Medium"
        },
        "content": {
            "description": "这是一个示例趋势描述...",
            "features": ["特性1", "特性2"],
            "drivers": ["驱动因素1"],
            "constraints": ["制约因素1"]
        },
        "impact": {
            "design": "对设计的影响...",
            "technology": "对技术的影响...",
            "cost": "对成本的影响...",
            "user": "对用户的影响..."
        },
        "data": {
            "marketShare": 15,
            "growthRate": 20,
            "patents": 100,
            "papers": 50,
            "mediaReports": 200
        },
        "application": {
            "scenarios": ["科技馆", "企业展厅"],
            "suggestions": "实施建议...",
            "risks": "风险评估..."
        }
    }

    const copyTemplate = () => {
        navigator.clipboard.writeText(JSON.stringify(exampleJson, null, 2));
        setIsCopied(true);
        toast.success("模板已复制到剪贴板");
        setTimeout(() => setIsCopied(false), 2000);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <FileJson className="h-4 w-4" />
                    快速导入 JSON
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                <DialogHeader className="flex-none">
                    <DialogTitle className="flex items-center justify-between">
                        <span>导入趋势数据</span>
                        <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={copyTemplate}>
                            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            <span className="text-xs">复制模板</span>
                        </Button>
                    </DialogTitle>
                    <DialogDescription>
                        请粘贴符合格式的 JSON 数据。您可以点击右上角复制标准模板。
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto py-4 min-h-0">
                    <Textarea 
                        placeholder={`例如:\n${JSON.stringify(exampleJson, null, 2)}`}
                        className="min-h-[300px] h-full font-mono text-sm resize-none"
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                    />
                    
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>错误</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="flex-none">
                    <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
                    <Button onClick={handleImport} disabled={isLoading || !jsonContent.trim()}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        确认导入
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
