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
import { createSubjectMappingAction } from '@/app/actions/subject-mapping'
import { toast } from 'sonner'
import { FileJson, Copy, Loader2, AlertCircle, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const exampleJson = {
  "name": "力的相互作用与滑轮组",
  "basic": {
    "code": "SM-PHY-001",
    "purpose": "建立滑轮组展项与初中物理力学知识的深度关联"
  },
  "dimensions": {
    "exhibit": {
      "typeId": "mechanical-interaction",
      "subTypes": ["滑轮组", "省力机构"],
      "interaction": ["拉动绳索", "观察重物提升"],
      "experience": ["体感对比", "省力体验"]
    },
    "subject": {
      "category": "物理",
      "branch": "力学",
      "topic": "简单机械",
      "standard": "义务教育物理课程标准(2022年版)"
    },
    "grade": {
      "level": "初中",
      "specific": ["八年级下册"],
      "ageRange": "13-14岁",
      "cognitiveLevel": "形式运算阶段"
    }
  },
  "knowledge": {
    "principleId": "",
    "name": "滑轮组省力原理",
    "code": "PHY-MECH-05",
    "depth": "理解与应用",
    "type": "陈述性+程序性",
    "match": {
      "score": 5,
      "reason": "展项操作直接对应定滑轮、动滑轮及滑轮组的受力分析。",
      "pros": ["直观体验省力", "便于定量测量"],
      "cons": ["摩擦力干扰较大"],
      "complementary": ["虚拟仿真实验室"]
    }
  },
  "teaching": {
    "timing": "新课导入或巩固练习",
    "method": ["探究式", "小组合作"],
    "duration": "15-20分钟",
    "connection": "课内理论知识的实践验证",
    "difficulty": {
      "cognitive": 3,
      "operation": 2,
      "threshold": "需具备力的平衡基础",
      "skills": ["测力计读数", "数据记录"]
    },
    "adaptability": {
      "gender": "无差异",
      "culture": "普适",
      "specialNeeds": ["轮椅友好操作台"],
      "learningStyle": ["动觉型", "视觉型"],
      "personality": ["所有"]
    },
    "groupFit": {
      "individual": 3,
      "group": 5,
      "class": 4,
      "family": 4
    }
  },
  "goals": {
    "knowledge": ["理解定滑轮改变力的方向", "理解动滑轮省力但不省距离"],
    "ability": ["组装滑轮组", "测量机械效率"],
    "literacy": ["科学探究", "物理观念"],
    "emotion": ["体验机械之美", "培养合作精神"]
  },
  "assessment": {
    "dimensions": ["操作规范性", "数据准确性", "结论科学性"],
    "methods": ["观察量表", "任务单"],
    "tools": "实验记录单",
    "standards": [],
    "performance": "能正确组装并得出省力结论"
  },
  "outcome": {
    "works": ["实验数据表", "滑轮组设计图"],
    "example": "设计一个能省一半力的提升装置",
    "display": ["墙面展示", "汇报演讲"]
  },
  "implementation": {
    "conditions": {
      "space": "约2平米",
      "equipment": ["滑轮组", "钩码", "测力计", "绳索"],
      "personnel": "需1名辅导员引导",
      "safety": "防止重物脱落砸伤",
      "maintenance": "定期检查绳索磨损"
    },
    "resources": {
      "guide": "滑轮组探究指南.pdf",
      "manual": "设备维护手册.pdf",
      "background": "阿基米德与简单机械",
      "extended": [],
      "qa": "为什么实际测量并不完全符合理论值？（摩擦力影响）"
    },
    "schedule": {
      "prep": 5,
      "activity": 20,
      "cleanup": 5,
      "bestTime": ["平时下午", "周末全天"]
    },
    "cost": {
      "equipment": 2000,
      "material": 50,
      "labor": 100,
      "total": 2150
    }
  },
  "validation": {
    "cases": [],
    "schools": ["实验中学"],
    "dates": ["2025-10-15"],
    "report": "学生参与度高，但部分学生读数有困难",
    "feedback": {
      "student": "很有趣，比书本上直观",
      "teacher": "很好的教学补充",
      "effect": [],
      "engagement": 4,
      "satisfaction": 5
    },
    "improvement": {
      "history": [],
      "todos": ["增加数字测力计"],
      "suggestions": "降低悬挂高度以便于操作"
    },
    "status": {
      "level": "已验证",
      "agency": "教研组",
      "date": "2025-11-01",
      "report": "通过验收"
    }
  }
};

export function SubjectMappingImportDialog() {
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

      const res = await createSubjectMappingAction(parsedData)
      
      if (res.success) {
        toast.success("学科对照导入成功")
        setOpen(false)
        setJsonStr('')
        router.push('/content/subject-mappings')
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
            <span>导入学科对照</span>
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
