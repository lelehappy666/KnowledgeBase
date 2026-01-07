'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { createTechnicalFeasibilityAction } from '@/app/actions/technical-feasibility'
import { toast } from 'sonner'
import { FileJson, Copy, Loader2, AlertCircle, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const exampleJson = {
  "name": "全息投影技术方案",
  "basic": {
    "id": "TECH-VIS-001",
    "category": "视觉技术",
    "description": "基于佩珀尔幻像原理的3D全息展示系统",
    "keywords": ["全息", "3D", "佩珀尔幻像"],
    "source": "采购"
  },
  "specs": {
    "dimensions": "2m x 2m x 2m",
    "weight": "150kg",
    "power": "800W",
    "materials": ["钢化玻璃", "铝合金框架"],
    "network": "千兆以太网",
    "software": "Unity3D / UE5"
  },
  "analysis": {
    "maturity": {
      "trl": 9,
      "status": "商业成熟",
      "cases": 50
    },
    "stability": {
      "mtbf": "5000小时",
      "durability": "高",
      "maintenanceCycle": "3个月"
    },
    "safety": {
      "risks": ["玻璃破碎风险"],
      "measures": ["使用钢化夹胶玻璃", "设置防护栏"],
      "certifications": ["CE", "CCC"]
    },
    "riskLevel": "Low"
  },
  "requirements": {
    "environment": {
      "temperature": "10-35℃",
      "humidity": "20-80%",
      "lighting": "需暗环境 (<50 lux)",
      "noise": "<40dB"
    },
    "installation": {
      "space": "3m x 3m 独立空间",
      "loadBearing": ">200kg/m2",
      "difficulty": 3,
      "time": "2天"
    },
    "skill": {
      "development": ["3D建模", "特效制作"],
      "operation": ["基础开关机", "清洁维护"]
    }
  },
  "cost": {
    "development": 50000,
    "hardware": 80000,
    "software": 20000,
    "deployment": 10000,
    "maintenance": 5000,
    "total": 165000
  },
  "interaction": {
    "input": ["手势识别", "触摸屏"],
    "output": ["3D影像", "定向音响"],
    "latency": "<50ms",
    "throughput": "10-20人/批"
  }
};

export function TechnicalFeasibilityImportDialog() {
  const [open, setOpen] = useState(false)
  const [jsonStr, setJsonStr] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()

  const handleImport = async () => {
    if (!jsonStr.trim()) return;
    
    setIsLoading(true)
    setError(null)

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(jsonStr)
      } catch (e) {
        throw new Error("JSON 格式错误: 请检查语法")
      }

      const res = await createTechnicalFeasibilityAction(parsedData)
      
      if (res.success) {
        toast.success("技术方案导入成功")
        setOpen(false)
        setJsonStr('')
        router.push('/technical/feasibility')
        router.refresh()
      } else {
        throw new Error(res.error || "导入失败")
      }
    } catch (e: any) {
      setError(e.message)
      toast.error("导入失败")
    } finally {
      setIsLoading(false)
    }
  }

  const copyTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(exampleJson, null, 2))
    setIsCopied(true)
    toast.success("模板已复制到剪贴板")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileJson className="mr-2 h-4 w-4" />
          快速导入
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle className="flex items-center justify-between">
            <span>导入技术方案</span>
            <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={copyTemplate}>
              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="text-xs">复制模板</span>
            </Button>
          </DialogTitle>
          <DialogDescription>
            请粘贴符合格式的 JSON 数据。
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 py-4 overflow-y-auto">
          <Textarea 
            placeholder={`例如:\n${JSON.stringify(exampleJson, null, 2)}`}
            className="min-h-[300px] h-full font-mono text-xs resize-none placeholder:text-muted-foreground/40"
            value={jsonStr}
            onChange={(e) => setJsonStr(e.target.value)}
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
          <Button onClick={handleImport} disabled={isLoading || !jsonStr.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            确认导入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
