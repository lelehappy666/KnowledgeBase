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
import { createSciencePrincipleAction } from '@/app/actions/science-principle'
import { toast } from 'sonner'
import { FileJson, Copy, Loader2, AlertCircle, Check } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from 'next/navigation'

const exampleJson = {
  "name": "偏振光原理",
  "basic": {
    "aliases": ["偏光", "偏振现象"],
    "enName": "Polarization of Light",
    "abstract": "光波振动方向被限制在某一特定方向的现象",
    "history": "1808年由马吕斯发现..."
  },
  "classification": {
    "category": "物理",
    "subCategory": "光学",
    "crossDiscipline": ["材料科学", "通信工程"],
    "knowledgeSystem": "经典物理",
    "difficultyLevel": "入门级"
  },
  "education": {
    "gradeLevel": ["初中", "高中"],
    "gradeSpecific": ["八年级", "高二"],
    "curriculum": {
      "standard": [{ "version": "人教版", "grade": "8", "chapter": "光现象" }],
      "requirements": "理解光的偏振现象及其应用",
      "knowledgePointId": "PHY-08-03-02",
      "coreLiteracy": ["科学观念", "探究实践"],
      "abilityGoals": ["能解释偏振现象", "能列举偏振应用"],
      "cognitiveLevel": "应用"
    },
    "teaching": {
      "misconceptions": ["认为所有光都是偏振光"],
      "difficulties": "偏振方向的抽象理解",
      "suggestions": "采用探究式教学，先实验后理论",
      "safety": "避免激光直射眼睛"
    }
  },
  "exhibitRelation": {
    "exhibitability": "较易展示",
    "suitableTypes": [],
    "existingCases": [],
    "creativeIdeas": [{ "name": "偏振迷宫", "desc": "..." }],
    "design": {
      "visualStrategy": "使用偏振片和彩色LCD组合显示",
      "interactionPoints": ["提供偏振片旋转操作"],
      "experiencePoints": ["惊喜感:旋转看到变化"],
      "techPath": ["液晶显示", "偏振滤镜"]
    },
    "difficulty": {
      "understanding": 3,
      "operation": 2,
      "immersion": 3,
      "memory": 4
    }
  },
  "activity": {
    "curriculum": {
      "theme": "神奇的偏振世界",
      "type": ["实验课", "工作坊"],
      "duration": "45分钟",
      "location": ["教室", "展厅"],
      "audienceSize": "11-30人"
    },
    "project": {
      "theme": "设计一款偏振太阳镜",
      "cycle": "1周",
      "drivingQuestion": "如何利用偏振原理改善我们的日常生活？",
      "outcome": ["偏振太阳镜原型"],
      "evaluationRubric": ""
    },
    "resources": {
      "ppt": "",
      "guide": "",
      "manual": "",
      "video": "",
      "materials": "",
      "equipment": [{ "name": "偏振片", "count": 10 }],
      "cost": 500
    }
  },
  "crossDisciplinary": {
    "steam": {
      "s": ["光的波动性"],
      "t": ["液晶显示技术"],
      "e": ["光学仪器设计"],
      "a": ["偏振艺术画"],
      "m": ["向量运算"]
    },
    "application": {
      "daily": ["偏光太阳镜"],
      "industrial": ["应力检测"],
      "research": ["显微镜增强"],
      "medical": ["内窥镜成像"],
      "military": ["潜艇潜望镜"]
    },
    "frontier": {
      "research": "量子偏振纠缠研究",
      "unsolved": ["生物偏振感知机制"],
      "trends": "超材料实现新型偏振控制"
    }
  },
  "evaluation": {
    "teaching": {
      "indicators": ["概念理解正确率"],
      "methods": ["测试"],
      "tools": "",
      "data": []
    },
    "exhibit": {
      "effect": 4,
      "feedback": "孩子对偏振实验很感兴趣",
      "suggestions": "增加更多生活应用案例"
    },
    "content": {
      "accuracy": "已验证",
      "timeliness": "较新",
      "completeness": 4,
      "utility": 5,
      "popularity": 4
    }
  }
};

export function SciencePrincipleImportDialog() {
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

      const res = await createSciencePrincipleAction(parsedData)
      
      if (res.success) {
        toast.success("科学原理导入成功")
        setOpen(false)
        setJsonStr('')
        router.push('/content/science-principles')
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
            <span>导入科学原理</span>
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
